const multer = require("multer");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg" || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/JPG') {
    cb(null, true)
  } else {
    cb({ message: "Unsupported file format" }, false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
})


module.exports = upload;