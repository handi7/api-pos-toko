const multer = require("multer");

const storage = multer.memoryStorage();
const uploadSingle = multer({ storage }).single("file");
const uploadMulti = multer({ storage }).fields([{ name: "file" }]);

module.exports = { uploadSingle, uploadMulti };
