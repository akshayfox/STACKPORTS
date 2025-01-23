import React, { useState, useRef } from "react";
import { useEditorStore } from "../store/editorStore";
import {
  Type,
  Image,
  Square,
  Circle,
  Triangle,
  Trash2,
  ChevronDown,
  CreativeCommons,
} from "lucide-react";
import { nanoid } from "nanoid";
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

const Toolbar = () => {
  const { addElement, selectedElement, removeElement,activeTemplate } = useEditorStore();
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [isformopen, setisformopen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const element: EditorElement = {
          id: nanoid(),
          type: "image",
          content: event.target?.result as string,
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
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getShapePath = (shapeType: string, width: number, height: number) => {
    switch (shapeType) {
      case "rectangle":
        return `M 0 0 H ${width} V ${height} H 0 Z`;
      case "circle":
        const rx = width / 2;
        const ry = height / 2;
        return `M ${width / 2} 0 A ${rx} ${ry} 0 1 0 ${width / 2} ${height} A ${rx} ${ry} 0 1 0 ${width / 2} 0 Z`;
      case "triangle":
        return `M ${width / 2} 0 L ${width} ${height} L 0 ${height} Z`;
      case "star":
        const points = [
          [50, 0],
          [61, 35],
          [98, 35],
          [68, 57],
          [79, 91],
          [50, 70],
          [21, 91],
          [32, 57],
          [2, 35],
          [39, 35],
        ].map(([x, y]) => [(x * width) / 100, (y * height) / 100]);
        return `M ${points[0][0]} ${points[0][1]} ${points
          .slice(1)
          .map(([x, y]) => `L ${x} ${y}`)
          .join(" ")} Z`;
      default:
        return `M 0 0 H ${width} V ${height} H 0 Z`;
    }
  };

  const addShape = (shapeType: string) => {
    const width = 100;
    const height = 100;

    const element: EditorElement = {
      id: nanoid(),
      type: "shape",
      content: "",
      style: {
        x: 100,
        y: 100,
        width,
        height,
        rotation: 0,
        backgroundColor: "#e2e8f0",
        shapeType,
        fontSize: 16,
        color: "#000000",
        path: getShapePath(shapeType, width, height),
      },
    };

    addElement(element);
    setShowShapeMenu(false);
  };

  const createform = () => {
    setisformopen(true);
  };

  return (
    <>
      <div className="bg-white p-4 shadow-lg rounded-lg h-full">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <h3 className="font-semibold text-lg border-b pb-2 mb-4">Tools</h3>
        <div className="space-y-2">
          <button
            onClick={addText}
            className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors">
            <Type size={20} /> Add Text
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors">
            <Image size={20} /> Upload Image
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShapeMenu(!showShapeMenu)}
              className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors justify-between">
              <div className="flex items-center gap-3">
                <Square size={20} /> Add Shape
              </div>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  showShapeMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showShapeMenu && (
              <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => addShape("rectangle")}
                  className="w-full p-2 hover:bg-gray-100 flex items-center gap-2">
                  <Square size={16} /> Rectangle
                </button>
                <button
                  onClick={() => addShape("circle")}
                  className="w-full p-2 hover:bg-gray-100 flex items-center gap-2">
                  <Circle size={16} /> Circle
                </button>
                <button
                  onClick={() => addShape("triangle")}
                  className="w-full p-2 hover:bg-gray-100 flex items-center gap-2">
                  <Triangle size={16} /> Triangle
                </button>
                <button
                  onClick={() => addShape("star")}
                  className="w-full p-2 hover:bg-gray-100 flex items-center gap-2">
                  <span className="text-lg">★</span> Star
                </button>
              </div>
            )}
          </div>

          {selectedElement && (
            <button
              onClick={() => removeElement(selectedElement.id)}
              className="w-full p-3 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-3 transition-colors mt-4">
              <Trash2 size={20} /> Delete Element
            </button>
          )}
        </div>

        <button
          onClick={createform}
          className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors">
          <CreativeCommons size={20} />
          Create Form
        </button>
      </div>

      {/* Pass the design elements to the modal */}
      <FormgenerateModal open={isformopen} setOpen={setisformopen} template={activeTemplate} />
    </>
  );
};

export default Toolbar;
