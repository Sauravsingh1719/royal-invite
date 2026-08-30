"use server";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadWeddingImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("image") as File;

    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files (JPG, PNG, WEBP) are allowed" };
    }

    // Safety guard aligned with Vercel serverless limits (4.5MB)
    if (file.size > 4.5 * 1024 * 1024) {
      return {
        success: false,
        error: "Compressed image payload exceeds 4.5MB server limit",
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "royal_invites",
            resource_type: "image",
            transformation: [
              {
                width: 1400,
                crop: "limit",
                quality: "auto:good",
                fetch_format: "auto",
              },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Cloudinary upload failed"));
              return;
            }
            resolve(result);
          }
        )
        .end(buffer);
    });

    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error("[Cloudinary Upload Error]:", error);
    return { success: false, error: error.message || "Failed to upload image" };
  }
}