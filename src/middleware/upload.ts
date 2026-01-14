import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (_, file, cb) => {
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const fileFilter: multer.Options["fileFilter"] = (_, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Invalid file type"));
  } else {
    cb(null, true);
  }
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("files", 10);
