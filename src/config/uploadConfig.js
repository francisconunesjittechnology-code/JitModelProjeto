import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("audio")) {
      cb(null, "public/music");
    } else {
      cb(null, "public/images");
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now();
    cb(null, unique + "-" + file.originalname);
  }
});

export default multer({ storage });