import date from "joi";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";

export const multerLocal = ({ customPath = "general", customTypes = [] }) => {
  const dir_path = `uploads/${customPath}`;
  if (!fs.existsSync(dir_path)) {
    fs.mkdirSync(dir_path, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dir_path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "_" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    

    if (!customTypes.includes(file.mimetype)) {
      cb(new Error("I don't have a clue!"));
    } else {
      cb(null, true);
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload;
};
