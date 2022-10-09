const {v4: uuidv4} = require("uuid");
const {ErrorHandler} = require("../handlers/error.handler");
const {STATUS_CODE, STATUS_MESSAGE} = require("../constants/general.constant");
const ResponseHandler = require("../handlers/response.handler");
const CompressionRequest = require("../models/compressionRequest");
const {DB} = require("../configs/db.config");
const CompressionServiceQueue = require("../services/compression.service");
const GeneralConfig = require("../configs/other.config");

const constCompressionRequest = new CompressionRequest(DB);
const jobQueue = new CompressionServiceQueue();
jobQueue.init()


async function AcceptImageCompressionRequest(req, res, next) {
    if(!req.file){
        next(new ErrorHandler(STATUS_CODE.BAD_REQUEST, STATUS_MESSAGE.BAD_REQUEST, "Please provide a valid image"));
        return;
    }
    const {filename, path, mimetype} = req.file;
    var {compressionLevel} = req.body;
    if (compressionLevel === undefined) {
        compressionLevel = 1;
    }
    var requestId = uuidv4()
    try {
        await constCompressionRequest.create(requestId, filename, path, mimetype, compressionLevel)
    } catch (e) {
        next(new ErrorHandler(STATUS_CODE.INTERNAL_SERVER_ERROR, STATUS_MESSAGE.INTERNAL_SERVER_ERROR, e));
        return;
    }

    try {
        await jobQueue.createJob('imageCompression', {
            requestId: requestId,
            title: `Image Processing Request for ${requestId}`
        });
    } catch (e) {
        next(new ErrorHandler(STATUS_CODE.INTERNAL_SERVER_ERROR, STATUS_MESSAGE.INTERNAL_SERVER_ERROR, e));
        return;
    }

    new ResponseHandler(STATUS_CODE.ACCEPTED, {
        message: `Image Compression request accepted use /status/${requestId} endpoint to check status`,
        requestId: requestId
    }).sendResponse(res);
}

async function GetCompressionDetailsByRequestId(req, res, next) {
    let requestId = req.params.requestId;
    let image;
    try {
        image = await constCompressionRequest.getById(requestId)
    } catch (e) {
        next(new ErrorHandler(STATUS_CODE.INTERNAL_SERVER_ERROR, STATUS_MESSAGE.INTERNAL_SERVER_ERROR, e));
        return;
    }
    if (image === undefined) {
        next(new ErrorHandler(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.NOT_FOUND, "Image not found"));
        return;
    }
    var imageDeletionTime = new Date((new Date()).setTime(((new Date(image.updatedAt)).getTime()) + (GeneralConfig.MAX_TIME_COMPRESSED_IMAGE_AVAILABLE)))
    if(imageDeletionTime < new Date() && image.status === "completed"){
        await jobQueue.deleteExpiredFiles([image])
        next(new ErrorHandler(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.NOT_FOUND, "Image not found"));
        return;
    }
    if (image.error) {
        next(new ErrorHandler(STATUS_CODE.UNPROCESSABLE_ENTITY, STATUS_MESSAGE.UNPROCESSABLE_ENTITY, image.error));
        return;
    }
    if (image.linkReference) {
        image.downloadLink = `${req.protocol}://${req.headers.host}/image/download/${image.linkReference}`;
        image.availableTill = imageDeletionTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    }
    delete image.linkReference;
    new ResponseHandler(STATUS_CODE.SUCCESS, {
        "id": image.id,
        "imageType": image.imageType,
        "compressionPercentage": image.compressionPercentage,
        "compressionStatus": image.compressionStatus,
        "timeTaken": image.timeTaken,
        "createdAt": new Date(image.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        "updatedAt": new Date(image.updatedAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
        "downloadLink": image.downloadLink,
        "availableTill": image.availableTill
    }).sendResponse(res);
}

async function DownloadCompressedImage(req, res, next) {
    let linkReference = req.params.linkReference;
    let image;
    try {
        image = await constCompressionRequest.getByLinkReference(linkReference)
    } catch (e) {
        next(new ErrorHandler(STATUS_CODE.INTERNAL_SERVER_ERROR, STATUS_MESSAGE.INTERNAL_SERVER_ERROR, e));
        return;
    }
    if (image === undefined) {
        next(new ErrorHandler(STATUS_CODE.NOT_FOUND, STATUS_MESSAGE.NOT_FOUND, "Image not found"));
        return;
    }
    if (image.error) {
        next(new ErrorHandler(STATUS_CODE.INTERNAL_SERVER_ERROR, STATUS_MESSAGE.INTERNAL_SERVER_ERROR, image.error));
        return;
    }
    res.download(image.destinationPath);
}


module.exports = {AcceptImageCompressionRequest, GetCompressionDetailsByRequestId, DownloadCompressedImage}