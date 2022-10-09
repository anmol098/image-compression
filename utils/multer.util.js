const multer = require('multer')
const {ErrorHandler} = require("../handlers/error.handler");
const {STATUS_CODE, STATUS_MESSAGE} = require("../constants/general.constant");
const {UPLOAD_PATH} = require("../configs/other.config");
const ACCEPTED_FILE_TYPES = require('../constants/general.constant').ACCEPTED_FILE_TYPES;

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_PATH);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `raw-${file.fieldname}-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    let inputFileType = file.mimetype.split("/")[1]
    if (inputFileType === ACCEPTED_FILE_TYPES.PNG || inputFileType === ACCEPTED_FILE_TYPES.JPG || inputFileType === ACCEPTED_FILE_TYPES.JPEG) {
        cb(null, true);
    } else {
        cb(new ErrorHandler(STATUS_CODE.UNSUPPORTED_MEDIA_TYPE, STATUS_MESSAGE.UNSUPPORTED_MEDIA_TYPE, `Accepted Image Format are JPG, JPEG, PNG`), false);
    }
};

module.exports = multer({storage: multerStorage, fileFilter: multerFilter});