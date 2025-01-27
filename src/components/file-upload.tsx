import { useEditorStore } from "@/store/editorStore";
import { Element, MenuItem } from "@/types/editor";
import React from "react";
import { nanoid } from 'nanoid';



type FileUploadProps = {
  menuItems: MenuItem[];
};

const FileUpload: React.FC<FileUploadProps> = ({ menuItems }) => {
      const { setActiveTemplate, activeTemplate,addElement } = useEditorStore();

      const handleImageClick = (fileUrl: string) => {
        const element: Element = {
          id: nanoid(),
          type: "image",
          content: `${import.meta.env.VITE_IMAGE_URL}${fileUrl}`,
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
        addElement(element); // Trigger adding element to your editor state
      };
    
  return (
    <div className="grid grid-cols-2 gap-4">
      {menuItems
        .find((item) => item.name === "Uploads")
        ?.content?.map((file, index) => (
          <div key={index} className="group relative cursor-pointer">
            <div className="aspect-square overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}${file.url}`}
                alt={file.name}
                onClick={() => handleImageClick(file.url)} // Add onClick to the image

                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <p className="text-sm mt-2 text-gray-600 group-hover:text-gray-900 truncate">
              {file.name}
            </p>
          </div>
        ))}
    </div>
  );
};

export default FileUpload;









// import { MenuItem } from "@/types/editor";
// import React, { useState } from "react";

// type FileUploadProps = {
//   menuItems: MenuItem[];
//   addElement: (element: EditorElement) => void; // Add this to trigger element addition
// };

// const FileUpload: React.FC<FileUploadProps> = ({ menuItems, addElement }) => {
//   const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

//   // Handle file upload and conversion to base64
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         // Add the uploaded image to the state
//         setUploadedFiles((prevFiles) => [
//           ...prevFiles,
//           { name: file.name, url: event.target?.result as string },
//         ]);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Add image to editor when clicked
//   const handleImageClick = (fileUrl: string) => {
//     const element: EditorElement = {
//       id: nanoid(),
//       type: "image",
//       content: fileUrl,
//       style: {
//         x: 100,
//         y: 100,
//         width: 200,
//         height: 200,
//         rotation: 0,
//         shapeType: "image",
//         backgroundColor: "transparent",
//         fontSize: 16,
//         color: "#000000",
//       },
//     };
//     addElement(element); // Trigger adding element to your editor state
//   };

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       {/* Upload Section */}
//       <div>
//         <input
//           type="file"
//           onChange={handleImageUpload}
//           className="hidden"
//           accept="image/*"
//         />
//         <button
//           onClick={() => document.querySelector("input[type='file']")?.click()}
//           className="w-full p-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//         >
//           Upload Image
//         </button>
//       </div>

//       {/* Display Images from menuItems */}
//       {menuItems
//         .find((item) => item.name === "Uploads")
//         ?.content?.map((file, index) => (
//           <div key={index} className="group relative cursor-pointer" onClick={() => handleImageClick(file.url)}>
//             <div className="aspect-square overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
//               <img
//                 src={`${import.meta.env.VITE_IMAGE_URL}${file.url}`}
//                 alt={file.name}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//               />
//             </div>
//             <p className="text-sm mt-2 text-gray-600 group-hover:text-gray-900 truncate">
//               {file.name}
//             </p>
//           </div>
//         ))}

//       {/* Display Newly Uploaded Images */}
//       {uploadedFiles.map((file, index) => (
//         <div
//           key={index}
//           className="group relative cursor-pointer"
//           onClick={() => handleImageClick(file.url)} // Add the image to the editor when clicked
//         >
//           <div className="aspect-square overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
//             <img
//               src={file.url}
//               alt={file.name}
//               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
//             />
//           </div>
//           <p className="text-sm mt-2 text-gray-600 group-hover:text-gray-900 truncate">
//             {file.name}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default FileUpload;
