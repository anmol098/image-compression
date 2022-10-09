const STATUS_CODE = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    UNSUPPORTED_MEDIA_TYPE: 415,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

const STATUS_MESSAGE = {
    SUCCESS: "Success",
    CREATED: "Created",
    ACCEPTED: "Accepted",
    NO_CONTENT: "No Content",
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    CONFLICT: "Conflict",
    UNPROCESSABLE_ENTITY: "Unprocessable Entity",
    UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
    TOO_MANY_REQUESTS: "Too Many Requests",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    BAD_GATEWAY: "Bad Gateway",
    SERVICE_UNAVAILABLE: "Service Unavailable",
    GATEWAY_TIMEOUT: "Gateway Timeout"
}

const CORS_ORIGIN = {
    LOCAL: ["http://localhost:3000"],
    PRODUCTION: ["https://www.example.com"]
}

const ACCEPTED_FILE_TYPES = {
    PNG: "png",
    JPG: "jpg",
    JPEG: "jpeg"
}

const AVAILABLE_FILE_EXTENSIONS = [`.${ACCEPTED_FILE_TYPES.PNG}`, `.${ACCEPTED_FILE_TYPES.JPG}`, `.${ACCEPTED_FILE_TYPES.JPEG}`];

module.exports = {
    STATUS_CODE,
    STATUS_MESSAGE,
    CORS_ORIGIN,
    ACCEPTED_FILE_TYPES,
    AVAILABLE_FILE_EXTENSIONS
}