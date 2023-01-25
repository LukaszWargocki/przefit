const multer = require("multer");
const path = require("path");

// TODO: check if there is promise-based fileFilter
// setting up multer
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, callback) => {
    // get extension
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      callback(new Error("File type not supported - supported types: .jpg, .jpeg and .png"), false);
      return;
    };
    callback(null, true);
  },
});