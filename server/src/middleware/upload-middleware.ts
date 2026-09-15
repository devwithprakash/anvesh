import multer from "multer";
import { type RequestHandler } from "express";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_EXTENSIONS = [".pdf", ".txt", ".md"];

const ALLOWED_MIME_TYPES = ["application/pdf", "text/plain", "text/markdown"];

export const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_SIZE_BYTES },

  fileFilter: (_req, file, callback) => {
    const extension = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));

    const isAllowedExtension = ALLOWED_EXTENSIONS.includes(extension);

    const isAllowedMimeType =
      ALLOWED_MIME_TYPES.includes(file.mimetype) ||
      file.mimetype === "application/octet-stream";

    if (isAllowedExtension && isAllowedMimeType) {
      callback(null, true);
      return;
    }

    callback(new Error("Only PDF, TXT, and Markdown files are allowed"));
  },
});

export const uploadSingleFile: RequestHandler = fileUpload.single("file");
