const GeneralConfig = require("../configs/other.config");

class CompressionRequest {
    constructor(db) {
        this.db = db
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS compressionRequest (
            id TEXT PRIMARY KEY,
            imageName TEXT,
            imagePath TEXT,
            imageType TEXT,
            compressionPercentage INTEGER,
            destinationPath TEXT DEFAULT NULL,
            compressionStatus TEXT DEFAULT 'pending',
            timeTaken INTEGER DEFAULT 0,
            error TEXT DEFAULT NULL,
            linkReference TEXT DEFAULT NULL,
            isDeleted INTEGER DEFAULT 0,
            createdAt TEXT DEFAULT (datetime('now','localtime')),
            updatedAt TEXT DEFAULT (datetime('now','localtime'))
        )`
        return this.db.run(sql)
    }

    create(id, imageName, imagePath, imageType, compressionPercentage) {
        return this.db.run('INSERT INTO compressionRequest (id, imageName, imagePath, imageType, compressionPercentage) VALUES (?, ?, ?, ?, ?)', [id, imageName, imagePath, imageType, compressionPercentage])
    }

    update(id, destinationPath, compressionStatus, timeTaken, error, linkReference) {
        var updatedDate = new Date().toISOString();
        return this.db.run('UPDATE compressionRequest SET destinationPath = ?, compressionStatus = ?, timeTaken = ?, error = ?, linkReference = ?, updatedAt = ? WHERE id = ?', [destinationPath, compressionStatus, timeTaken, error, linkReference, updatedDate, id])
    }

    getById(id) {
        return this.db.get('SELECT * FROM compressionRequest WHERE id = ? AND isDeleted = "0"', [id])
    }

    getByLinkReference(linkReference) {
        return this.db.get('SELECT * FROM compressionRequest WHERE linkReference = ?', [linkReference])
    }

    getPendingRequest() {
        return this.db.all('SELECT id FROM compressionRequest WHERE compressionStatus = "pending"')
    }

    getExpiredFiles() {
        return this.db.all('SELECT id, destinationPath, updatedAt FROM compressionRequest WHERE isDeleted="0" AND compressionStatus = "completed" AND (strftime("%s", "now") - strftime("%s", updatedAt)) > ?', [(GeneralConfig.MAX_TIME_COMPRESSED_IMAGE_AVAILABLE) / 1000])
    }

    deleteById(id, isDeleted = 1) {
        var updatedDate = new Date().toISOString();
        return this.db.run('UPDATE compressionRequest SET isDeleted = ?, updatedAt = ? WHERE id = ?', [isDeleted, updatedDate, id])
    }
}

module.exports = CompressionRequest