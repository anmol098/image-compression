const express = require('express')
const app = express();
const imageCompressionRoutes = require('./routes/imageCompression.routes')
const {handleError} = require("./handlers/error.handler");

app.use(express.json());

app.use('/', imageCompressionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    handleError(err, res);
});

app.listen(3000, async () => {
    console.log('Image Compression app running on port 3000!');
})
