import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    console.log("File:", file.originalname);
    console.log("Mimetype:", file.mimetype);


    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ];


    const extension = path
      .extname(file.originalname)
      .toLowerCase();


    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG and WEBP images are allowed"
        ),
        false
      );
    }
  },
});


export default upload;