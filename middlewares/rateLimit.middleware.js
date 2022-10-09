const rateLimit = require('express-rate-limit')
const {MAX_ACCEPTED_REQUESTS_TIME_FRAME, MAX_ACCEPTED_REQUESTS} = require("../configs/other.config");
const {msToTime} = require("../utils/general.util");
const {ErrorHandler} = require("../handlers/error.handler");
const {STATUS_CODE, STATUS_MESSAGE} = require("../constants/general.constant");

const limiter = rateLimit({
    windowMs: MAX_ACCEPTED_REQUESTS_TIME_FRAME,
    max: MAX_ACCEPTED_REQUESTS,
    standardHeaders: true,
    legacyHeaders: true,
    message: async (request, response) => {
        var error = `You can only make ${MAX_ACCEPTED_REQUESTS} image compression requests in every ${msToTime(MAX_ACCEPTED_REQUESTS_TIME_FRAME)}. Please Retry after ${msToTime(response.getHeader("RateLimit-Reset") * 1000)}`
        return new ErrorHandler(STATUS_CODE.TOO_MANY_REQUESTS, STATUS_MESSAGE.TOO_MANY_REQUESTS, error)
    },
})
module.exports = limiter
