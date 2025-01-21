import { LucideIcon } from "lucide-react";

export interface Element {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  style: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fontSize?: number;
    shapeType: string;
    color?: string;
    backgroundColor?: string;
  };
}

export interface Template {
  _id?:string,
  id: string;
  name: string;
  thumbnail?:string;
  elements: Element[];
  canvasSize: {
    width: number;
    height: number;
  };
}


export interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
  templateId: string | null;  // Allow null here
}

export interface ContextMenuItem {
  icon: LucideIcon;
  label: string;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onOptionClick: (action: string) => void;
}
