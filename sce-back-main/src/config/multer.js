import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

//const uploadDir = path.resolve("uploads");
const uploadDir = "uploads" 

// garante que a pasta exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomBytes(16).toString("hex")}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Apenas arquivos PDF são permitidos."), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
