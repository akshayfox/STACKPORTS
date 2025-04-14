import { useEditorStore } from "@/store/editorStore";
import { Element, UploadedImage } from "@/types/editor";
import React, { useState } from "react";
import { nanoid } from "nanoid";
import axios from "axios";

type FileUploadProps = {
  images: UploadedImage[]; // or whatever your image type is
  refreshFiles: () => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ images, refreshFiles }) => {
  const { addElement } = useEditorStore();
  const [selectedFiles, setSelectedFiles] = useState<UploadedImage[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleImageClick = (file: UploadedImage) => {
    if (isSelectMode) {
      toggleFileSelection(file);
    } else {
      const element: Element = {
        id: nanoid(),
        type: "image",
        content: `${import.meta.env.VITE_IMAGE_URL}${file.url}`,
        style: {
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          rotation: 0,
          shapeType: "image",
          backgroundColor: "transparent",
          fontSize: 16,
          color: "#000000",
        },
      };
      addElement(element);
    }
  };
  

  const toggleFileSelection = (file: UploadedImage) => {
    if (selectedFiles.some(f => f._id === file._id)) {
      setSelectedFiles(selectedFiles.filter(f => f._id !== file._id));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };
  

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedFiles([]);
    }
  };

  const getIdFromUrl = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1]; // Use the filename as the ID
  };

  const deleteFile = async (id: string) => {
    try {
      const fileId = getIdFromUrl(id);
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/image/delete/${fileId}`
      );
      refreshFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const fileIds = selectedFiles.map((file) => file._id);
      const fileUrls = selectedFiles.map((file) => file.url); // optional, only if backend needs it

      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/image/delete-multiple`,
        {
          data: { ids: fileIds, urls: fileUrls },
        }
      );

      setSelectedFiles([]);
      refreshFiles();
      setIsSelectMode(false);
    } catch (error) {
      console.error("Error deleting multiple files:", error);
      alert("Failed to delete selected files");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex gap-2">
          <button
            onClick={toggleSelectMode}
            className={`px-3 py-1 rounded text-sm ${
              isSelectMode
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-100 text-gray-600"
            }`}>
            {isSelectMode ? "Cancel" : "Select"}
          </button>
          {isSelectMode && (
            <button
              onClick={deleteSelectedFiles}
              disabled={selectedFiles.length === 0}
              className={`px-3 py-1 rounded text-sm ${
                selectedFiles.length > 0
                  ? "bg-red-500 text-white"
                  : "bg-red-200 text-gray-100 cursor-not-allowed"
              }`}>
              Delete ({selectedFiles.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {images.map((file, index) => (
       <div
       key={index}
       className={`group relative cursor-pointer border-2 rounded-xl ${
         selectedFiles.some((f) => f._id === file._id)
           ? "border-blue-500"
           : "border-transparent"
       }`}
     >
     
            <div className="aspect-square overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}${file.url}`}
                alt={file.name}
                onClick={() => handleImageClick(file)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="text-sm mt-2 text-gray-600 group-hover:text-gray-900 truncate">
              {file.name}
            </p>

            {!isSelectMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm(
                      "Are you sure you want to delete this image?"
                    )
                  ) {
                    deleteFile(file._id);
                  }
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {isSelectMode && (
              <div className="absolute top-2 right-2">
                <div
                  onClick={() => toggleFileSelection(file)}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
                    selectedFiles.some((f) => f._id === file._id)
                      ? "bg-blue-500 border-blue-500"
                      : "border-white bg-gray-100 bg-opacity-70"
                  }`}>
                  {selectedFiles.some((f) => f._id === file._id) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No images uploaded yet
        </div>
      )}
    </div>
  );
};

export default FileUpload;
