import React, { useRef, useCallback } from 'react';

interface ResizeHandleProps {
  position: string;
  onResize: (deltaX: number, deltaY: number) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ 
  position, 
  onResize,
  onResizeStart,
  onResizeEnd
}) => {
  const startPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    startPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
    onResizeStart();
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResizeStart]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    
    onResize(deltaX, deltaY);
    startPosRef.current = { x: e.clientX, y: e.clientY };
  }, [onResize]);
  
  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      onResizeEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [onResizeEnd, handleMouseMove]);

  return (
    <div
      className={`absolute w-3 h-3 bg-blue-500 rounded-full z-10 ${getHandlePositionClass(position)}`}
      onMouseDown={handleMouseDown}
      data-position={position}
    />
  );
};

const getHandlePositionClass = (position: string) => {
  const base = 'transform';
  
  switch (position) {
    // Corner handles
    case 'top-left':
      return `${base} -translate-x-1/2 -translate-y-1/2 top-0 left-0 cursor-nw-resize`;
    case 'top-right':
      return `${base} translate-x-1/2 -translate-y-1/2 top-0 right-0 cursor-ne-resize`;
    case 'bottom-left':
      return `${base} -translate-x-1/2 translate-y-1/2 bottom-0 left-0 cursor-sw-resize`;
    case 'bottom-right':
      return `${base} translate-x-1/2 translate-y-1/2 bottom-0 right-0 cursor-se-resize`;
    
    // Edge handles
    case 'top':
      return `${base} -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 cursor-n-resize`;
    case 'right':
      return `${base} translate-x-1/2 -translate-y-1/2 top-1/2 right-0 cursor-e-resize`;
    case 'bottom':
      return `${base} -translate-x-1/2 translate-y-1/2 bottom-0 left-1/2 cursor-s-resize`;
    case 'left':
      return `${base} -translate-x-1/2 -translate-y-1/2 top-1/2 left-0 cursor-w-resize`;
    
    default:
      return '';
  }
};

export default ResizeHandle;