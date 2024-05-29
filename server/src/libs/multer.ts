import multer, { FileFilterCallback } from "multer";
import { type Request } from "express";
const maxSize = 1048576;

const multerConfig: multer.Options = {
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype.split("/")[0] != "image") {
      return cb(new Error("file type is not image"));
    }

    const fileSize = parseInt(req.headers["content-length"] || "");

    if (fileSize > maxSize) {
      return cb(new Error("max size 1mb"));
    }
    return cb(null, true);
  },
  limits: {
    fileSize: maxSize, //1mb
  },
};

export const blobUploader = () =>
  multer({
    ...multerConfig,
  });
