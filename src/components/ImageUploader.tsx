"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, CheckCircle2, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import { uploadWeddingImage, deleteCloudinaryImage } from "@/actions/upload";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: "portrait" | "landscape" | "square";
  hint?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = "portrait",
  hint = "Any size photo (Auto-compressed for ultra-fast loading)",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === "portrait"
      ? "h-72 md:h-80"
      : aspectRatio === "landscape"
      ? "h-52 md:h-60"
      : "h-64 w-64 mx-auto";

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WEBP, HEIC)");
      return;
    }

    setError(null);
    const previousImageUrl = value;

    try {
      // 1. Client-Side Smart Compression
      setStatusText("Optimizing high-res image...");

      const compressionOptions = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/jpeg",
        initialQuality: 0.88,
      };

      const compressedBlob = await imageCompression(file, compressionOptions);
      const compressedFile = new File(
        [compressedBlob],
        file.name.replace(/\.[^/.]+$/, ".jpg"),
        {
          type: "image/jpeg",
        }
      );

      // 2. Upload the lightweight image to Cloudinary via Server Action
      setStatusText("Uploading to Cloudinary...");
      const formData = new FormData();
      formData.append("image", compressedFile);

      const res = await uploadWeddingImage(formData);

      if (!res.success || !res.url) {
        setError(res.error || "Upload failed");
        setStatusText(null);
        return;
      }

      // 3. Update field with new image URL
      onChange(res.url);

      // 4. Automatically delete the previous image from Cloudinary to free storage
      if (previousImageUrl && previousImageUrl !== res.url) {
        deleteCloudinaryImage(previousImageUrl).catch((err) =>
          console.warn("Could not delete previous image:", err)
        );
      }

      setStatusText(null);
    } catch (err: any) {
      console.error("[Upload Error]:", err);
      setError("Failed to process and upload photo. Please try again.");
      setStatusText(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imageToDelete = value;

    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Delete removed photo from Cloudinary in background
    if (imageToDelete) {
      deleteCloudinaryImage(imageToDelete).catch((err) =>
        console.warn("Cloudinary asset deletion error:", err)
      );
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-900 font-[family-name:var(--font-cinzel)]">
          {label}
        </label>
        {value && !statusText && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !statusText && fileInputRef.current?.click()}
        className={`relative w-full ${aspectClass} rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-300 flex flex-col items-center justify-center ${
          isDragging
            ? "border-[#8B1E41] bg-[#8B1E41]/5 scale-[1.01]"
            : value
            ? "border-[#D4AF37] bg-black shadow-md"
            : "border-gray-300 hover:border-[#D4AF37] bg-white hover:bg-[#FDFBF7]"
        }`}
      >
        <AnimatePresence>
          {statusText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#2A0410]/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center"
            >
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mb-2" />
              <p className="text-xs font-bold text-[#FDFBF7] font-[family-name:var(--font-cinzel)] uppercase tracking-wider">
                {statusText}
              </p>
              <p className="text-[10px] text-[#D4AF37] mt-1">
                Maintaining 100% studio fidelity
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {value ? (
          <div className="relative w-full h-full group bg-black">
            <Image
              src={value}
              alt={label}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <span className="text-xs font-semibold text-white px-3 py-1.5 bg-black/60 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5" /> Replace Photo
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#8B1E41]/10 flex items-center justify-center mb-3 text-[#8B1E41] border border-[#D4AF37]/30">
              <UploadCloud className="w-6 h-6 text-[#8B1E41]" />
            </div>
            <p className="text-xs font-bold text-gray-900 font-[family-name:var(--font-cinzel)] uppercase tracking-wider mb-1">
              Click or Drag Photo Here
            </p>
            <p className="text-[11px] text-gray-500">{hint}</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
    </div>
  );
}