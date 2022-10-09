const kue = require("kue");
const {DB} = require("../configs/db.config");
const CompressionRequest = require("../models/compressionRequest");
const compressionRequest = new CompressionRequest(DB);
const sharp = require('sharp');
const fs = require("fs");
const {DELETE_INTERVAL_OFFSET, COMPRESSION_PATH, redis} = require("../configs/other.config");
const path = require("path");

async function updateProcessStatus(requestId, destinationPath, compressionStatus, timeTaken, error, linkReference) {
    try {
        await compressionRequest.update(requestId, destinationPath, compressionStatus, timeTaken, error, linkReference);
    } catch (e) {
        console.log(`Error in compressing image for request id: ${requestId} with error: ${e}`);
        return;
    }
}

class CompressionServiceQueue {
    constructor() {
        this.queue = kue.createQueue({
            redis: redis
        });
        this.job = null;
    }

    createJob(jobName, data) {
        return new Promise((resolve, reject) => {
            this.job = this.queue.create(jobName, data);
            this.job.save((err) => {
                if (err) {
                    reject(err);
                }
                this.activateListener();
                resolve(this.job);
            });
        })
    }

    processJob(jobName) {
        this.queue.process(jobName, this.compressImage);
    }

    async compressImage(job, done) {
        var requestId = job.data.requestId;
        var startTime = new Date().getTime();
        console.log("Compressing image for request id: " + requestId);
        try {
            var image = await compressionRequest.getById(requestId)
        } catch (e) {
            done(new Error(JSON.stringify({error: e.message, requestId: requestId})));
            return;
        }
        var {imagePath, imageType, compressionPercentage} = image;
        var processedImageName = `${requestId}.${imageType.split("/")[1]}`;
        var destinationPath = `${COMPRESSION_PATH}${processedImageName}`;
        try {
            var imageBuffer = fs.readFileSync(imagePath);
        } catch (e) {
            done(new Error(JSON.stringify({error: e.message, requestId: requestId})));
            return;
        }
        if (imageType === "image/jpeg" || imageType === "image/jpg") {
            try {
                await sharp(imageBuffer)
                    .jpeg({quality: compressionPercentage})
                    .toFile(destinationPath)
            } catch (e) {
                done(new Error(JSON.stringify({error: e.message, requestId: requestId})));
                return;
            }
        } else if (imageType === "image/png") {
            try {
                await sharp(imageBuffer)
                    .png({quality: compressionPercentage})
                    .toFile(destinationPath)
            } catch (e) {
                done(new Error(JSON.stringify({error: e.message, requestId: requestId})));
                return;
            }
        } else {
            done(new Error(JSON.stringify({
                error: `Error in compressing image for request id: ${requestId} with error: Unsupported image type`,
                requestId: requestId
            })));
            return;
        }
        var endTime = new Date().getTime();
        done(null, {
            requestId: requestId,
            destinationPath: destinationPath,
            timeTaken: endTime - startTime,
            linkReference: processedImageName
        });
    }

    activateListener() {
        this.job.on('complete', this.onCompleted);
        this.job.on('failed', this.onFailed);
    }

    async onCompleted(result) {
        await updateProcessStatus(result.requestId, result.destinationPath, "completed", result.timeTaken, null, result.linkReference);
        console.log(`Job completed with result ${JSON.stringify(result)} and data `);
    }

    async onFailed(err) {
        console.error(err);
        await updateProcessStatus(JSON.parse(err).requestId, null, "failed", null, JSON.parse(err).error, null);
    }

    async init() {
        try {
            await compressionRequest.createTable();
        } catch (e) {
            console.error(e)
            process.exit(1)
        }
        this.processJob("imageCompression");
        this.restartJobsOnServerRestart();
        var self = this;
        setInterval(async () => {
            try {
                var result = await compressionRequest.getExpiredFiles();
                await self.deleteExpiredFiles(result);
            } catch (e) {
                console.error(e)
            }
        }, DELETE_INTERVAL_OFFSET); // every 10 minutes
    }

    async restartJobsOnServerRestart() {
        try {
            var pendingRequest = await compressionRequest.getPendingRequest();
        } catch (e) {
            console.error(e);
            throw e;
        }

        for (const request of pendingRequest) {
            await this.createJob("imageCompression", {
                requestId: request.id,
                title: `Image Processing Request for ${request.id}`
            });
        }
    }

    async deleteExpiredFiles(expiredFiles) {
        for (const file of expiredFiles) {
            try {
                fs.unlinkSync(path.resolve(file.destinationPath));
            } catch (e) {
                console.error(e);
            }
            compressionRequest.deleteById(file.id);
        }
    }
}

module.exports = CompressionServiceQueue;