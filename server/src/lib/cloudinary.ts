import { v2 as cloudinary } from "cloudinary";
import { ValidationError } from "../types/app-error.js";
import { Readable } from "stream";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  bytes: number;
  originalFileName: string;
  resourceType: "raw" | "image";
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  bytes: number;
  resource_type?: string;
  error?: { message: string };
};

export function getSignedCloudinaryDownloadUrl(
  publicId: string,
  resourceType: "raw" | "image" = "raw",
) {
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: "upload",
    sign_url: true,
    secure: true,
  });
}

export async function uploadFileToCloudinary(
  buffer: Buffer,
  fileName: string,
): Promise<CloudinaryUploadResult> {
  const result = await new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "notebook/files",
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    originalFileName: fileName,
    resourceType: result.resource_type,
  };
}
