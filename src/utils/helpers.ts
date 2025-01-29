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
