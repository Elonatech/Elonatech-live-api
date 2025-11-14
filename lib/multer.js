const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JPG"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max image
  },
});

module.exports = upload;


// const multer = require("multer");
// const path = require("path");

// // ✅ Proper disk storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // ✅ File filter for image types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file format"), false);
//   }
// };

// // ✅ Multer instance
// const upload = multer({ storage, fileFilter });

// module.exports = upload;