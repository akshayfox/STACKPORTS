import React, { useRef, useState } from "react";
import FileUpload from "./file-upload";
import { icons } from "@/constants/Icons";
import axios from "axios";
import { MenuItem } from "@/types/editor";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";

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
}

interface EditorElement {
  id: string;
  type: "text" | "image" | "shape";
  content: string;
  style: ElementStyle;
}

const Toolbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { addElement, selectedElement, removeElement, activeTemplate } =
    useEditorStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleItemClick = (itemName: string) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  const fetchDImages = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/image/files`
    );
    if (response) {
      return response.data.files;
    }
  };

  const {
    data: images,
    isLoading,
    refetch: refetchImages,
  } = useQuery({
    queryKey: ["images"],
    queryFn: fetchDImages,
  });

  const addText = () => {
    const element: EditorElement = {
      id: nanoid(),
      type: "text",
      content: "Double click to edit",
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        rotation: 0,
        fontSize: 16,
        color: "#000000",
        shapeType: "text",
        backgroundColor: "transparent",
      },
    };
    addElement(element);
  };
  
  const addShape = (shapeType: string) => {
    const element: EditorElement = {
      id: nanoid(),
      type: "shape",
      content: "",
      style: {
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        rotation: 0,
        shapeType: shapeType,
        backgroundColor: "#4F46E5",
      },
    };
    addElement(element);
  };
  
  const addImage = (imageUrl: string) => {
    const element: EditorElement = {
      id: nanoid(),
      type: "image",
      content: imageUrl,
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
        shapeType: "image",
        backgroundColor: "transparent",
      },
    };
    addElement(element);
  };

  const menuItems: MenuItem[] = [
    {
      name: "Images",
      icon: icons.Photos || icons.Template, // Assuming Photos icon exists
      action: () => {
        console.log("Images selected");
      },
    },
    {
      name: "Icons",
      icon: icons.Elements || icons.Graphics, // Use appropriate icon
      action: () => {
        console.log("Icons selected");
      },
    },
    {
      name: "Shapes",
      icon: icons.Graphics || icons.Elements, // Use appropriate icon
      action: () => {
        console.log("Shapes selected");
      },
    },
    {
      name: "Elements",
      icon: icons.Elements,
      action: () => {
        console.log("Elements selected");
      },
    },
    {
      name: "Text",
      icon: icons.Text,
      action: () => {
        console.log("Text selected");
      },
    },
    {
      name: "Uploads",
      icon: icons.Uploads,
      action: () => {
        setActiveItem("Uploads"); // Opens the uploads sidebar
      },
      content: images?.length > 0 ? images : [],
    },
  ];

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));
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
        console.log(response, "response");
      } else {
        throw new Error("Failed to upload images.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // Sample shape data
  const shapes = [
    { type: "rectangle", name: "Rectangle" },
    { type: "circle", name: "Circle" },
    { type: "ellipse", name: "Ellipse" },
    { type: "triangle", name: "Triangle" },
    { type: "pentagon", name: "Pentagon" },
    { type: "hexagon", name: "Hexagon" },
    { type: "star", name: "Star" },
    { type: "arrow", name: "Arrow" },
  ];

  // Sample basic elements
  const elements = [
    { type: "line", name: "Line" },
    { type: "curve", name: "Curve" },
    { type: "frame", name: "Frame" },
    { type: "grid", name: "Grid" },
    { type: "bubble", name: "Speech Bubble" },
    { type: "callout", name: "Callout" }
  ];

  // Sample text styles
  const textStyles = [
    { type: "heading", name: "Heading", content: "Heading Text" },
    { type: "subheading", name: "Subheading", content: "Subheading Text" },
    { type: "paragraph", name: "Paragraph", content: "Paragraph text goes here. This is a sample paragraph." },
    { type: "quote", name: "Quote", content: "This is a beautiful quote example" },
    { type: "list", name: "List Item", content: "• List item" },
  ];

  // Sample stock photos categories
  const imageCategories = [
    "Nature", "Business", "People", "Technology", "Food", "Abstract", "Travel"
  ];

  return (
    <div className="">
      <div className="w-16 h-full bg-white shadow-sm flex flex-col items-center py-4 z-10 fixed">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative w-12 mb-2"
            onClick={() => {
              handleItemClick(item.name);
              if (item.action) {
                item.action();
              }
            }}>
            <div
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200
             ${
               activeItem === item.name
                 ? "bg-blue-100 text-blue-600 shadow-sm"
                 : "hover:bg-gray-100 text-gray-600"
             }`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Content */}
      {activeItem === "Uploads" && (
        <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Uploads</h3>
            <div>
              <button
                onClick={handleButtonClick}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                disabled={isLoading}>
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
      )}

      {activeItem === "Shapes" && (
        <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Shapes</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {shapes.map((shape) => (
              <div 
                key={shape.type}
                onClick={() => addShape(shape.type)}
                className="aspect-square rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center transition-all duration-200"
              >
                <div className="text-xs text-center text-gray-600">{shape.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeItem === "Elements" && (
        <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Elements</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {elements.map((element) => (
              <div 
                key={element.type}
                onClick={() => addShape(element.type)}
                className="p-4 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center transition-all duration-200"
              >
                <div className="text-sm text-center text-gray-600">{element.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeItem === "Text" && (
        <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Text</h3>
          </div>
          <div className="space-y-4">
            {textStyles.map((style) => (
              <div 
                key={style.type}
                onClick={addText}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-200"
              >
                <div className={`text-gray-800 ${style.type === 'heading' ? 'text-xl font-bold' : 
                  style.type === 'subheading' ? 'text-lg font-semibold' : 
                  style.type === 'quote' ? 'text-base italic' : 'text-base'}`}>
                  {style.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeItem === "Images" && (
        <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Images</h3>
          </div>
          <div className="space-y-4">
            {imageCategories.map((category) => (
              <div key={category} className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {/* These would be actual images from your API/stock provider */}
                  <div 
                    className="aspect-square bg-gray-200 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => addImage(`https://source.unsplash.com/random/300x300?${category.toLowerCase()}`)}
                  />
                  <div 
                    className="aspect-square bg-gray-200 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => addImage(`https://source.unsplash.com/random/300x300?${category.toLowerCase()},2`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeItem === "Icons" && (
        <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Icons</h3>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search icons..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {/* These would be actual icons from your library */}
            {Array(16).fill(0).map((_, i) => (
              <div 
                key={i}
                className="aspect-square rounded-md bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
                onClick={() => addShape('icon')}
              >
                <div className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;