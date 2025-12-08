// const multer = require('multer');
// const path = require('path');


// let upload = multer({

//   fileFilter: (req, file, cb) => {
//     let ext = path.extname(file.originalname);
//     if (ext !== ".pdf") {
//       req.fileValidationError = "Forbidden extension";
//       return cb(null, false, req.fileValidationError);
//     }
//     cb(null, true);
//   },

// });

// module.exports = upload

const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  },
});

module.exports = upload;