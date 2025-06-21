"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicId = extractPublicId;
exports.generateSecureRandomCode = generateSecureRandomCode;
const crypto = require("crypto");
function extractPublicId(url) {
    if (!url)
        return null;
    try {
        const parts = url.split('/');
        const folder = parts[parts.length - 2];
        const filename = parts[parts.length - 1].split('.')[0];
        return `${folder}/${filename}`;
    }
    catch (err) {
        return null;
    }
}
function generateSecureRandomCode(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(bytes[i] % characters.length);
    }
    return result;
}
//# sourceMappingURL=file.util.js.map