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
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB — keeps base64-encoded SendGrid attachments under its ~30MB message cap
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // The Siwes letter field also accepts JPEG scans; every other field (CV) stays PDF-only
    const allowedExt = file.fieldname === "siwesLetter" ? [".pdf", ".jpeg", ".jpg"] : [".pdf"];
    if (!allowedExt.includes(ext)) {
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  },
});

module.exports = upload;