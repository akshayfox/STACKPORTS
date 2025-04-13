import html2canvas from "html2canvas";
import { Template } from "../types/editor";

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

  try {
    const canvas = await html2canvas(canvasContent, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
      logging: false,
      allowTaint: true,
      width: activeTemplate.canvasSize.width,
      height: activeTemplate.canvasSize.height,
    });

    return canvas.toDataURL("image/png");
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