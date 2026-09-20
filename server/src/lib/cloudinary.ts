import { v2 as cloudinary } from "cloudinary";
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

export function getSignedCloudinaryDownloadUrl(
  publicId: string,
  format: string,
  resourceType: "raw" | "image" = "raw",
) {
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: resourceType,
    type: "private",
    expires_at: Math.floor(Date.now() / 1000) + 60 * 5,
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
        type: "private",
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
