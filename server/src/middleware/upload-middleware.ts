import multer from "multer";
import { type RequestHandler } from "express";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

export const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_SIZE_BYTES },

  fileFilter: (_req, file, callback) => {

    console.log("Hello")

    const isPdf =
      file.mimetype === "application/pdf" ||
      (file.mimetype === "application/octet-stream" &&
        file.originalname.toLowerCase().endsWith(".pdf"));

    if (isPdf) {
      callback(null, true);
      return;
    }

    callback(new Error("Only PDF files are allowed"));
  },
});

export const uploadSinglePdf: RequestHandler = pdfUpload.single("file");
