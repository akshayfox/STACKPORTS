import React, { useRef, useState } from "react";
import FileUpload from "./file-upload";
import { icons } from "@/constants/Icons";
import axios from "axios";
import { MenuItem } from "@/types/editor";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import FormgenerateModal from "./modal/FormgenerateModal ";

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
  const [isformopen, setisformopen] = useState(false);
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
    refetch: refetchImages, // ✅ this is now a function you can call later
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

  const menuItems: MenuItem[] = [
    {
      name: "Template",
      icon: icons.Template,
      action: () => {
        console.log("Template selected");
      },
    },
    {
      name: "Photos",
      icon: icons.Photos,
      action: () => {
        console.log("Photos selected");
      },
    },
    {
      name: "Text",
      icon: icons.Text,
      action: addText, // Calls the `addText` function
    },
    {
      name: "Elements",
      icon: icons.Elements,
      action: () => {
        console.log("Elements selected");
      },
    },
    {
      name: "Graphics",
      icon: icons.Graphics,
      action: () => {
        console.log("Graphics selected");
      },
    },
    {
      name: "Music",
      icon: icons.Music,
      action: () => {
        console.log("Music selected");
      },
    },
    {
      name: "Videos",
      icon: icons.Videos,
      action: () => {
        console.log("Null");
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
    {
      name: "Folders",
      icon: icons.Folders,
      action: () => {
        console.log("Folders selected");
      },
    },
    {
      name: "Folders",
      icon: icons.Create,
      action: () => {
        setisformopen(true);
      },
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

      <FormgenerateModal
        open={isformopen}
        setOpen={setisformopen}
        template={activeTemplate}
      />
    </div>
  );
};

export default Toolbar;
