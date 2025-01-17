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
  id: string;
  name: string;
  elements: Element[];
  canvasSize: {
    width: number;
    height: number;
  };
}