class ResponseHandler {
    constructor(statusCode, responseBody = {}) {
        this.response = {
            statusCode: statusCode,
            ...responseBody
        };
    }

    sendResponse(res) {
        res.status(this.response.statusCode).send(this.response);
    }
}

module.exports = ResponseHandler;