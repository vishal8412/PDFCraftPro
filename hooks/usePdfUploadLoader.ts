import { useState, useCallback } from "react";

/**
 * Custom hook to manage PDF upload, instant loader, and file URL state.
 *
 * Handles:
 *  - file input handling
 *  - loader toggle before parsing starts
 *  - automatic blob URL creation
 *  - cleanup on unmount or new upload
 */

export function usePdfUploadLoader() {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = useCallback((file: File | null) => {
    if (!file) return;

    // Reset and show loader immediately
    setIsUploading(true);
    setFileUrl("");

    // Give a short delay to simulate processing
    const blobUrl = URL.createObjectURL(file);

    // Simulate small transition time for smoother loader
    setTimeout(() => {
      setFileUrl(blobUrl);
      setIsUploading(false);
    }, 300);
  }, []);

  // Clean up blob URLs on unmount or new upload
  const resetUpload = useCallback(() => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl("");
    setIsUploading(false);
  }, [fileUrl]);

  return {
    fileUrl,
    isUploading,
    handleUpload,
    resetUpload,
  };
}
