"use server";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Extracts the full public_id including folder (e.g., "royal_invites/filename")
 */
function extractPublicId(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    let path = parts[1];
    // Remove transformation/version string if present (e.g., v1712345678/ or c_limit,w_1400/v1712345678/)
    path = path.replace(/^.*v\d+\//, "");
    // Remove file extension (.jpg, .png, .webp, etc.)
    const lastDotIndex = path.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }
    return path;
  } catch {
    return null;
  }
}

export async function uploadWeddingImage(
  formData: FormData
): Promise<UploadResult> {
  try {
    const file = formData.get("image") as File;

    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Only image files (JPG, PNG, WEBP) are allowed",
      };
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

/**
 * Deletes an image from Cloudinary storage
 */
export async function deleteCloudinaryImage(
  imageUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!imageUrl) return { success: true };

  try {
    const publicId = extractPublicId(imageUrl);
    if (!publicId) {
      return { success: true }; // Not a Cloudinary URL or already cleared
    }

    const res = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "image",
    });

    return {
      success: res.result === "ok" || res.result === "not found",
    };
  } catch (error: any) {
    console.error("[Cloudinary Delete Error]:", error);
    return { success: false, error: error.message || "Failed to delete image" };
  }
}