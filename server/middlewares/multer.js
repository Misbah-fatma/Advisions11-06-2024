const multer = require("multer");
const path = require("path");

// Multer configuration
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    // Generate a unique name for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File format should be PNG, JPG, JPEG, PDF"), false);
  }
};

// Multer upload instance
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
});

module.exports = upload;
