import html2canvas from "html2canvas";
import { Template } from "../types/editor";
import React from "react";


export const captureCanvas = async (
  canvasRef: React.RefObject<HTMLDivElement>,
  activeTemplate?: Template | null
): Promise<string> => {
  const canvasContent = canvasRef.current?.querySelector<HTMLElement>(
    ".bg-white.rounded-lg.shadow-xl"
  );
  if (!canvasContent) {
    throw new Error("Canvas content not found");
  }

  // Safety check for activeTemplate and canvasSize
  if (!activeTemplate?.canvasSize) {
    throw new Error("Canvas size is not defined in the active template.");
  }

  // Calculate bounding box of all elements
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  activeTemplate.elements.forEach((el) => {
    const { x = 0, y = 0, width = 0, height = 0 } = el.style || {};
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  const boundingWidth = maxX - minX || activeTemplate.canvasSize.width;
  const boundingHeight = maxY - minY || activeTemplate.canvasSize.height;

  try {
    const canvas = await html2canvas(canvasContent, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: boundingWidth, // Use bounding box width
      height: boundingHeight, // Use bounding box height
      x: minX, // Offset to start of bounding box
      y: minY, // Offset to start of bounding box
    });

    // Create a temporary canvas to ensure the correct size
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = boundingWidth * 2; // Scale for high resolution
    tempCanvas.height = boundingHeight * 2;
    const context = tempCanvas.getContext("2d");
    context.drawImage(canvas, 0, 0);

    return tempCanvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error capturing canvas:", error);
    throw error;
  }
};







// Add this above your component
export const getImageId = (category: string, index: number): number => {
  const categoryMap: Record<string, [number, number]> = {
    Nature: [1015, 1016],
    Business: [1005, 1006],
    People: [1011, 1012],
    Technology: [1004, 1009],
    Food: [1080, 1081],
    Abstract: [1062, 1069],
    Travel: [1018, 1019]
  };
  
  return categoryMap[category]?.[index - 1] || 1000 + index;
};











export const getShapeStyles = (
  type: string,
  backgroundColor: string,
  rotation: number = 0
): React.CSSProperties => {
  const base: React.CSSProperties = {
    width: "100%",
    height: "100%",
    backgroundColor,
    transform: `rotate(${rotation}deg)`,
    overflow: "hidden",
  };

  switch (type) {
    case "circle":
      return { ...base, borderRadius: "50%" };
    case "triangle":
      return { ...base, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" };
    case "ellipse":
      return { ...base, borderRadius: "50%", transform: `${base.transform} scaleX(1.5)` };
    case "star":
      return {
        ...base,
        clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
      };
    case "pentagon":
      return {
        ...base,
        clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
      };
    case "hexagon":
      return {
        ...base,
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      };
    case "line":
      return {
        ...base,
        backgroundColor: "transparent",
        backgroundImage: `linear-gradient(${backgroundColor}, ${backgroundColor})`,
        backgroundSize: "100% 8px",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      };
    case "arrow":
      return {
        ...base,
        backgroundColor,
        clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
      };
    default: // rectangle
      return base;
  }
};