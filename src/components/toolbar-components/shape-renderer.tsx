import React from 'react';

interface ShapeProps {
  type: string;
  width: number;
  height: number;
  backgroundColor: string;
  rotation?: number;
}

const ShapeRenderer: React.FC<ShapeProps> = ({
  type,
  width,
  height,
  backgroundColor,
  rotation = 0
}) => {
  // Define all our shapes as SVG components
  const renderShape = () => {
    switch (type) {
      case 'circle':
        return <circle cx="50" cy="50" r="45" />;
      case 'triangle':
        return <polygon points="50,5 95,95 5,95" />;
      case 'ellipse':
        return <ellipse cx="50" cy="50" rx="45" ry="30" />;
      case 'pentagon':
        return <polygon points="50,5 95,35 80,90 20,90 5,35" />;
      case 'hexagon':
        return <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" />;
      case 'line':
        return <line x1="10" y1="50" x2="90" y2="50" strokeWidth="8" />;
      case 'arrow':
        return <path d="M10 50H90M90 50L60 20M90 50L60 80" strokeWidth="10" fill="none" />;
      case 'star':
        return <path d="M50 5L61.8 38.2H95.1L67.6 59.3L79.4 92.5L50 71.4L20.6 92.5L32.4 59.3L4.9 38.2H38.2L50 5Z" />;
      default: // rectangle
        return <rect width="90" height="90" x="5" y="5" />;
    }
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {renderShape()}
      <style>{`
        circle, polygon, rect, ellipse, path {
          fill: ${backgroundColor};
        }
        line, path[stroke-width] {
          stroke: ${backgroundColor};
          fill: none;
        }
      `}</style>
    </svg>
  );
};

export default ShapeRenderer;