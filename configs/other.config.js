module.exports = {
    "UPLOAD_PATH": "uploads/raw",
    "COMPRESSION_PATH": "./uploads/processed/",
    "MAX_ACCEPTED_REQUESTS": 10, // 10 requests per 10 minutes
    "MAX_ACCEPTED_REQUESTS_TIME_FRAME": 60 * 60 * 1000, // 1 hour
    "MAX_TIME_COMPRESSED_IMAGE_AVAILABLE": 6 * 60 * 60 * 1000, // 6 hours
    "DELETE_INTERVAL_OFFSET": 10 * 60 * 1000, // 10 minutes
    redis: {
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
    }
}