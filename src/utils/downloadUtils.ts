// utils/downloadUtils.ts

import { Template } from "../types/editor";

// export interface CanvasSize {
//   width: number;
//   height: number;
// }

export interface DesignElement {
  id: string;
  type: string;
  [key: string]: unknown;
}

// export interface Template {
//   id: string;
//   name: string;
//   elements: DesignElement[];
//   canvasSize: CanvasSize;
// }


export type DownloadType = 'json' | 'image';

export const downloadDesign = (template: Template | null): void => {
  if (!template) {
    console.error('No template provided for download');
    return;
  }

  // Convert the design data to a JSON string
  const designData: string = JSON.stringify(template, null, 2);
  
  // Create a Blob with the design data
  const blob: Blob = new Blob([designData], { type: 'application/json' });
  
  // Create a URL for the Blob
  const url: string = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = `${template.name || 'untitled-design'}.json`;
  
  // Append link to body, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

export const downloadAsImage = async (canvasRef: React.RefObject<HTMLCanvasElement>): Promise<void> => {
  if (!canvasRef.current) {
    console.error('Canvas reference is not available');
    return;
  }
  
  try {
    // Convert the canvas content to a data URL
    const dataUrl: string = canvasRef.current.toDataURL('image/png');
    
    // Create a temporary anchor element
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = dataUrl;
    link.download = 'design.png';
    
    // Append link to body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};