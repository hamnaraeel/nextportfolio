"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Video, Star } from "lucide-react";

interface FileUploadProps {
  projectId: string;
  onUploadSuccess: () => void;
}

interface ProjectMedia {
  id: string;
  type: "IMAGE" | "VIDEO" | "THUMBNAIL";
  url: string;
  altText: string | null;
  order: number;
}

export default function FileUpload({ projectId, onUploadSuccess }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const fetchMedia = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/media`);
      if (response.ok) {
        const mediaData = await response.json();
        setMedia(mediaData);
      }
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoadingMedia(false);
    }
  }, [projectId]);

  // Fetch existing media when component mounts
  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (files: FileList, type: "IMAGE" | "VIDEO" | "THUMBNAIL") => {
    if (!files.length) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);
        formData.append("type", type);
        formData.append("altText", file.name);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          await fetchMedia(); // Refresh media list
          onUploadSuccess();
        } else {
          const error = await response.json();
          alert(`Upload failed: ${error.error}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
      }
    }
    
    setUploading(false);
  };

  const handleDelete = async (mediaId: string) => {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/media?mediaId=${mediaId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchMedia();
        onUploadSuccess();
      } else {
        alert("Failed to delete media");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete media");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "IMAGE" | "VIDEO" | "THUMBNAIL") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files, type);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "IMAGE":
      case "THUMBNAIL":
        return <ImageIcon className="h-4 w-4" />;
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Project Media</h3>
      
      {/* Upload Areas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thumbnail Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, "THUMBNAIL")}
        >
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 mb-1">Thumbnail</p>
          <p className="text-xs text-gray-500 mb-2">Main project image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleUpload(e.target.files, "THUMBNAIL")}
            className="hidden"
            id="thumbnail-upload"
            disabled={uploading}
          />
          <label
            htmlFor="thumbnail-upload"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </label>
        </div>

        {/* Images Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, "IMAGE")}
        >
          <ImageIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 mb-1">Images</p>
          <p className="text-xs text-gray-500 mb-2">Screenshots, photos</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleUpload(e.target.files, "IMAGE")}
            className="hidden"
            id="images-upload"
            disabled={uploading}
          />
          <label
            htmlFor="images-upload"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </label>
        </div>

        {/* Videos Upload */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, "VIDEO")}
        >
          <Video className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900 mb-1">Videos</p>
          <p className="text-xs text-gray-500 mb-2">Demos, tutorials</p>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => e.target.files && handleUpload(e.target.files, "VIDEO")}
            className="hidden"
            id="videos-upload"
            disabled={uploading}
          />
          <label
            htmlFor="videos-upload"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </label>
        </div>
      </div>

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600 mt-2">Uploading...</p>
        </div>
      )}

      {/* Media List */}
      {loadingMedia ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : media.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Uploaded Media</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative bg-white border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getMediaIcon(item.type)}
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {item.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {item.type === "VIDEO" ? (
                  <video
                    src={item.url}
                    className="w-full h-32 object-cover rounded"
                    controls
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.altText || "Project media"}
                    width={200}
                    height={128}
                    className="w-full h-32 object-cover rounded"
                  />
                )}
                
                {item.altText && (
                  <p className="text-xs text-gray-500 mt-2 truncate">{item.altText}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Upload className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No media uploaded yet</p>
        </div>
      )}
    </div>
  );
}
