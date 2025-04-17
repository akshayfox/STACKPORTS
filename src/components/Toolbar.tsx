import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";

// Local components
import FileUpload from "./file-upload";
import ImageGallery from "./toolbar-components/ImageGallery";
import ShapeGallery from "./toolbar-components/shape-gallery";

// Constants and store
import { icons } from "@/constants/Icons";
import { useEditorStore } from "@/store/editorStore";

// Types
import { MenuItem } from "@/types/editor";

// Types - could be moved to a separate types file
interface ElementStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  backgroundColor: string;
  shapeType: string;
  fontSize?: number;
  color?: string;
  path?: string;
  textAlign?:string
}

interface EditorElement {
  id: string;
  type: "text" | "image" | "shape";
  content: string;
  style: ElementStyle;
}



const ELEMENTS = [
  { type: "line", name: "Line" },
  { type: "curve", name: "Curve" },
  { type: "frame", name: "Frame" },
  { type: "grid", name: "Grid" },
  { type: "bubble", name: "Speech Bubble" },
  { type: "callout", name: "Callout" },
];

const TEXT_STYLES = [
  { type: "heading", name: "Heading", content: "Heading Text" },
  { type: "subheading", name: "Subheading", content: "Subheading Text" },
  {
    type: "paragraph",
    name: "Paragraph",
    content: "Paragraph text goes here. This is a sample paragraph.",
  },
  {
    type: "quote",
    name: "Quote",
    content: "This is a beautiful quote example",
  },
  { type: "list", name: "List Item", content: "• List item" },
];

const IMAGE_CATEGORIES = [
  "Nature",
  "Business",
  "People",
  "Technology",
  "Food",
  "Abstract",
  "Travel",
];

const DEFAULT_POSITION = { x: 100, y: 100 };

const Toolbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addElement } = useEditorStore();
  const handleItemClick = useCallback((itemName: string) => {
    setActiveItem(prevActive => prevActive === itemName ? null : itemName);
  }, []);

  const fetchImages = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/image/files`
    );
    return response?.data?.files || [];
  };

  const { data: images, isLoading, refetch: refetchImages } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
  });




  const addText = useCallback(() => {
    const element: EditorElement = {
      id: nanoid(),
      type: "text",
      content: "Double click to edit",
      style: {
        ...DEFAULT_POSITION,
        width: 200,
        height: 50,
        rotation: 0,
        fontSize: 16,
        color: "#000000",
        shapeType: "text",
        backgroundColor: "transparent",
        textAlign:'center'
        
      },
    };
    addElement(element);
  }, [addElement]);

  const addShape = useCallback((shapeType: string) => {
    const element: EditorElement = {
      id: nanoid(),
      type: "shape",
      content: "",
      style: {
        ...DEFAULT_POSITION,
        width: 150,
        height: 150,
        rotation: 0,
        shapeType: shapeType,
        backgroundColor: "#4F46E5",
      },
    };
    addElement(element);
  }, [addElement]);

  // File upload handlers
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append("images", file));
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.status === 200) {
        refetchImages();
      } else {
        throw new Error("Failed to upload images.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  }, [refetchImages]);

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      name: "Images",
      icon: icons.Photos || icons.Template,
      action: () => handleItemClick("Images"),
    },
    {
      name: "Icons",
      icon: icons.Elements || icons.Graphics,
      action: () => handleItemClick("Icons"),
    },
    {
      name: "Shapes",
      icon: icons.Graphics || icons.Elements,
      action: () => handleItemClick("Shapes"),
    },
    {
      name: "Text",
      icon: icons.Text,
      action: () => handleItemClick("Text"),
    },
    {
      name: "Uploads",
      icon: icons.Uploads,
      action: () => handleItemClick("Uploads"),
      content: images || [],
    },
  ];

  // Render sidebar content based on active item
  const renderSidebarContent = () => {
    if (!activeItem) return null;
    
    switch (activeItem) {
      case "Uploads":
        return (
          <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Uploads</h3>
              <div>
                <button
                  onClick={handleFileButtonClick}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload New"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  multiple
                />
              </div>
            </div>
            <FileUpload images={images} refreshFiles={refetchImages} />
          </div>
        );
        
      case "Shapes":
        return (
          <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm transition-all duration-300 ease-in-out ml-16">
            <ShapeGallery />
          </div>
        );
        
      case "Elements":
        return (
          <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Elements</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ELEMENTS.map((element) => (
                <div
                  key={element.type}
                  onClick={() => addShape(element.type)}
                  className="p-4 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center transition-all duration-200"
                >
                  <div className="text-sm text-center text-gray-600">
                    {element.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "Text":
        return (
          <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Text</h3>
            </div>
            <div className="space-y-4">
              {TEXT_STYLES.map((style) => (
                <div
                  key={style.type}
                  onClick={addText}
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-200"
                >
                  <div
                    className={`text-gray-800 ${
                      style.type === "heading"
                        ? "text-xl font-bold"
                        : style.type === "subheading"
                        ? "text-lg font-semibold"
                        : style.type === "quote"
                        ? "text-base italic"
                        : "text-base"
                    }`}
                  >
                    {style.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case "Images":
        return (
          <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Images</h3>
            </div>
            <ImageGallery categories={IMAGE_CATEGORIES} />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Sidebar menu */}
      <div className="w-16 h-full bg-white shadow-sm flex flex-col items-center py-4 z-10 fixed">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative w-12 mb-2"
            onClick={item.action}
          >
            <div
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200
               ${
                 activeItem === item.name
                   ? "bg-blue-100 text-blue-600 shadow-sm"
                   : "hover:bg-gray-100 text-gray-600"
               }`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic sidebar content */}
      {renderSidebarContent()}
    </div>
  );
};

export default Toolbar;