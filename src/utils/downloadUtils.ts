// utils/downloadUtils.ts

import { Template } from "../types/editor";



export interface DesignElement {
  id: string;
  type: string;
  [key: string]: unknown;
}



export type DownloadType = 'json' | 'image';

export const downloadDesign = (template: Template | null): void => {
  if (!template) {
    console.error('No template provided for download');
    return;
  }
  const designData: string = JSON.stringify(template, null, 2);
  const blob: Blob = new Blob([designData], { type: 'application/json' });
  const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = `${template.name || 'untitled-design'}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAsImage = async (canvasRef: React.RefObject<HTMLCanvasElement>): Promise<void> => {
  if (!canvasRef.current) {
    console.error('Canvas reference is not available');
    return;
  }
  try {
    const dataUrl: string = canvasRef.current.toDataURL('image/png');
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = dataUrl;
    link.download = 'design.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};