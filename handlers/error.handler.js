class ErrorHandler extends Error {
    constructor(statusCode, statusMessage, message) {
        super();
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.message = message;
    }
}

const handleError = (err, res) => {
    const {statusCode, statusMessage, message} = err;
    res.status(statusCode).json({
        status: statusMessage,
        statusCode,
        message
    });
};
module.exports = {
    ErrorHandler,
    handleError
}
