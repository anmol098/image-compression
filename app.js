const express = require('express')
const app = express();
const imageCompressionRoutes = require('./routes/imageCompression.routes')
const {handleError} = require("./handlers/error.handler");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use('/', imageCompressionRoutes);

app.use((err, req, res, next) => {
    handleError(err, res);
});

app.listen(3000, async () => {
    console.log('Image Compression app running on port 3000!');
})
