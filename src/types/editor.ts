import { LucideIcon } from "lucide-react";

export interface Element {
  id: string;
  type: "text" | "image" | "shape" | "textarea" | "button";
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
  placeholder?: string;
  label?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}



export interface Template {
  _id?: string;
  id: string;
  name: string;
  thumbnail?: string;
  elements: Element[];
  canvasSize: {
    width: number;
    height: number;
  };
}


export interface FormElement extends Element {
  options?: Array<{ value: string; label: string }>;
}

export interface Form {
  templateId: string;
  name: string;
  elements: FormElement[];
  createdAt?: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
  templateId: string | null;
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
