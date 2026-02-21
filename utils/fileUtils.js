const fs = require('fs');
const path = require('path');

/**
 * Deletes a file from the server
 * @param {string} relativePath - Path relative to the server root (e.g. /uploads/image.jpg)
 */
const deleteFile = (relativePath) => {
    if (!relativePath || relativePath.startsWith('http')) return;

    // Remove leading slash if exists
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    const absolutePath = path.join(process.cwd(), cleanPath);

    fs.access(absolutePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(absolutePath, (err) => {
                if (err) console.error(`Error deleting file: ${absolutePath}`, err);
                else console.log(`Successfully deleted file: ${absolutePath}`);
            });
        }
    });
};

module.exports = { deleteFile };
