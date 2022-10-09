const express = require('express');
const router = express.Router();
const upload = require('../utils/multer.util');
const limiter = require('../middlewares/rateLimit.middleware')
const {
    AcceptImageCompressionRequest,
    GetCompressionDetailsByRequestId,
    DownloadCompressedImage
} = require("../controllers/compressionRequest.controller");

router.get('/', (req, res) => {
    res.send('Welcome to Image Compression Service');
})

router.post('/image', limiter, upload.single('image'), AcceptImageCompressionRequest)

router.get('/status/:requestId', GetCompressionDetailsByRequestId);

router.get('/image/download/:linkReference', DownloadCompressedImage)

module.exports = router;