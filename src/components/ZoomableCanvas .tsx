import React, { useState, useRef, useCallback } from 'react';
import { Minus, Plus, Move } from 'lucide-react';

interface ZoomableCanvasProps {
  children: React.ReactNode;
}

const ZoomableCanvas: React.FC<ZoomableCanvasProps> = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Predefined zoom levels with smoother gradations
  const zoomLevels = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const handleZoomIn = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(scale);
    if (currentIndex < zoomLevels.length - 1) {
      setScale(zoomLevels[currentIndex + 1]);
    }
  }, [scale]);

  const handleZoomOut = useCallback(() => {
    const currentIndex = zoomLevels.indexOf(scale);
    if (currentIndex > 0) {
      setScale(zoomLevels[currentIndex - 1]);
    }
  }, [scale]);

  const handleZoomSelect = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(parseFloat(event.target.value));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Middle mouse button (button === 1) or Alt + Left click (button === 0 && altKey)
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault(); // Prevent default drag behavior
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.preventDefault();
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  }, [isDragging, startPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleNativeWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      // Get the container's bounding rect
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      
      // Calculate mouse position relative to container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Calculate zoom
      const delta = e.deltaY * -0.01;
      const currentIndex = zoomLevels.indexOf(scale);
      let newScale;
      
      if (delta > 0 && currentIndex < zoomLevels.length - 1) {
        newScale = zoomLevels[currentIndex + 1];
      } else if (delta < 0 && currentIndex > 0) {
        newScale = zoomLevels[currentIndex - 1];
      }
      
      if (newScale) {
        // Calculate new position to zoom towards mouse
        const scaleChange = newScale / scale;
        const newPosition = {
          x: mouseX - (mouseX - position.x) * scaleChange,
          y: mouseY - (mouseY - position.y) * scaleChange
        };
        
        setScale(newScale);
        setPosition(newPosition);
      }
    }
  }, [scale, position]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleNativeWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleNativeWheel);
      }
    };
  }, [handleNativeWheel]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-center space-x-2 p-2 bg-white border-b border-gray-200">
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scale === zoomLevels[0]}
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        <select
          value={scale}
          onChange={handleZoomSelect}
          className="px-2 py-1 rounded-md border border-gray-200 bg-white text-sm"
        >
          {zoomLevels.map((level) => (
            <option key={level} value={level}>
              {Math.round(level * 100)}%
            </option>
          ))}
        </select>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scale === zoomLevels[zoomLevels.length - 1]}
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-2" />
        
        <button
          className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${isDragging ? 'bg-gray-100' : ''}`}
          title="Pan Tool (Alt + Drag)"
        >
          <Move className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-1  bg-gray-100 relative  flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className=" transition-transform duration-150 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            cursor: isDragging ? 'grabbing' : 'grab',
            willChange: 'transform'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ZoomableCanvas;