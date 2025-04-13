import { useEditorStore } from "@/store/editorStore";
import { Element } from "@/types/editor";
import { nanoid } from "nanoid";
import React from "react";

interface Shape {
  type: string;
  name: string;
  svg: React.ReactNode;
}

const shapes: Shape[] = [
  { 
    type: "rectangle", 
    name: "Rectangle",
    svg: (
      <svg viewBox="0 0 100 100">
        <rect width="100" height="100" rx="0" fill="currentColor" />
      </svg>
    )
  },
  { 
    type: "circle", 
    name: "Circle",
    svg: (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="currentColor" />
      </svg>
    )
  },
  { 
    type: "triangle", 
    name: "Triangle",
    svg: (
      <svg viewBox="0 0 100 100">
        <polygon points="50,5 95,95 5,95" fill="currentColor" />
      </svg>
    )
  },
  { 
    type: "ellipse", 
    name: "Ellipse",
    svg: (
      <svg viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="60" ry="30" fill="currentColor" />
      </svg>
    )
  },
  { 
    type: "star", 
    name: "Star",
    svg: (
      <svg viewBox="0 0 100 100">
        <path d="M50 5L61.8 38.2H95.1L67.6 59.3L79.4 92.5L50 71.4L20.6 92.5L32.4 59.3L4.9 38.2H38.2L50 5Z" fill="currentColor" />
      </svg>
    )
  },
  { 
    type: "arrow", 
    name: "Arrow",
    svg: (
      <svg viewBox="0 0 100 100">
        <path d="M10 50H90M90 50L60 20M90 50L60 80" stroke="currentColor" strokeWidth="10" fill="none" />
      </svg>
    )
  },
  { 
    type: "pentagon", 
    name: "Pentagon",
    svg: (
      <svg viewBox="0 0 100 100">
        <polygon points="50,5 95,35 80,90 20,90 5,35" fill="currentColor" />
      </svg>
    )
  },
  { 
    type: "hexagon", 
    name: "Hexagon",
    svg: (
      <svg viewBox="0 0 100 100">
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="currentColor" />
      </svg>
    )
  },
  { 
    type: "line", 
    name: "Line",
    svg: (
      <svg viewBox="0 0 100 100">
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="8" />
      </svg>
    )
  }
];

const ShapeGallery = () => {
  const { addElement } = useEditorStore();

  const addShape = (shapeType: string) => {
    const element: Element = {
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

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Shapes</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {shapes.map((shape) => (
          <div
            key={shape.type}
            onClick={() => addShape(shape.type)}
            className="group aspect-square rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer flex flex-col items-center justify-center transition-all duration-200 p-3"
          >
            <div className="w-full h-3/4 text-indigo-600 group-hover:text-indigo-700">
              {shape.svg}
            </div>
            <div className="text-xs text-center text-gray-600 mt-2">
              {shape.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShapeGallery;