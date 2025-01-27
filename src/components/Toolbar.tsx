import React, { useRef, useState } from "react";
import FileUpload from "./file-upload";
import { icons } from "@/constants/Icons";
import axios from "axios";
import { MenuItem } from "@/types/editor";
import { useQuery } from "@tanstack/react-query";




const Toolbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);


  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const handleItemClick = (itemName: string) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  const fetchDImages = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/files`);
    if(response){
      return response.data.files;
    }
  };


  const {
    data:images,
    isLoading,
  } = useQuery({
    queryKey: ["images"],
    queryFn: fetchDImages,
  });
console.log(images,'imges')





  const menuItems:MenuItem[] = [
    { name: "Template", icon: icons.Template },
    { name: "Photos", icon: icons.Photos },
    { name: "Text", icon: icons.Text },
    { name: "Elements", icon: icons.Elements },
    { name: "Graphics", icon: icons.Graphics },
    { name: "Music", icon: icons.Music },
    { name: "Videos", icon: icons.Videos },
    {
      name: "Uploads",
      icon: icons.Uploads,
      content: images?.length>0 ? images: [],
    },
    { name: "Folders", icon: icons.Folders },
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
    Array.from(files).forEach((file) => formData.append('images', file));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 200) {
        console.log(response,'response')

      } else {
        throw new Error('Failed to upload images.');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Minimal Sidebar */}
      <div className="w-16 h-full bg-white shadow-sm flex flex-col items-center py-4 z-10 fixed">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative w-12 mb-2"
            onClick={() => handleItemClick(item.name)}>
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

          <FileUpload menuItems={menuItems}/>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
