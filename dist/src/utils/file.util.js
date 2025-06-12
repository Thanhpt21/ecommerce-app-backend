"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicId = extractPublicId;
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
//# sourceMappingURL=file.util.js.map