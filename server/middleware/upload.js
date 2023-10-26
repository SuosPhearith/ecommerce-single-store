const multer = require("multer");
const path = process.env.SAVE_IMAGES_PATH;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Not an image file!"), false); // Reject the file
  }
};
const upload = multer({ storage: storage, fileFilter: imageFilter });
module.exports = upload;
