import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Element } from "../types/editor";
import { useEditorStore } from "../store/editorStore";
import ResizeHandle from "./ResizeHandle";
import { getShapeStyles } from "@/utils/helpers";

interface CanvasElementProps {
  element: Element;
  drag?: boolean;
  onResizeStateChange?: (isResizing: boolean) => void;
}



const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  drag = true,
  onResizeStateChange,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const currentStyleRef = useRef(element.style);
  
  const { selectedElement, setSelectedElement, updateElement } = useEditorStore();
  const isSelected = selectedElement?.id === element.id;

  // Only enable drag if not resizing or editing
  const shouldEnableDrag = drag && !isResizing && !isEditing;
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    disabled: !shouldEnableDrag
  });

  useEffect(() => {
    currentStyleRef.current = element.style;
  }, [element.style]);

  // Transform style for dragging
  const transformStyle = useMemo(() => {
    if (transform && shouldEnableDrag) {
      return `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    }
    return undefined;
  }, [transform, shouldEnableDrag]);

  // Element style computation
  const style = useMemo(() => ({
    position: "absolute" as const,
    transform: transformStyle,
    top: element.style.y,
    left: element.style.x,
    width: element.style.width,
    height: element.style.height,
    rotate: `${element.style.rotation}deg`,
    fontSize: `${element.style.fontSize}px`,
    color: element.style.color,
    borderRadius: element.style.borderRadius ? `${element.style.borderRadius}%` : "0%",
    overflow: "hidden",
  }), [transformStyle, element.style]);


const validTextAligns = ["left", "right", "center", "justify", "start", "end"] as const;

const contentStyle: React.CSSProperties = useMemo(() => ({
  width: "100%",
  height: "100%",
  borderRadius: `${element.style.borderRadius || 0}px`,
  overflow: "hidden",
  textAlign: validTextAligns.includes(element.style.textAlign as any)
    ? element.style.textAlign as React.CSSProperties["textAlign"]
    : "left",
}), [element.style.borderRadius, element.style.textAlign]);




  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    onResizeStateChange?.(true);
    if (transform) {
      updateElement(element.id, {
        style: {
          ...element.style,
          x: element.style.x + transform.x,
          y: element.style.y + transform.y,
        },
      });
    }
  }, [element.id, element.style, transform, updateElement, onResizeStateChange]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    onResizeStateChange?.(false);
  }, [onResizeStateChange]);



  const handleResize = useCallback((updates: Partial<typeof element.style>) => {
    const style = currentStyleRef.current;
    updateElement(element.id, {
      style: {
        ...style,
        ...updates,
        width: updates.width !== undefined ? Math.max(20, updates.width) : style.width,
        height: updates.height !== undefined ? Math.max(20, updates.height) : style.height,
      },
    });
  }, [element.id, updateElement]);



  const handleCornerResize = useCallback((corner: string, dx: number, dy: number) => {
    const style = currentStyleRef.current;
    const updates: Partial<typeof element.style> = {};
    switch (corner) {
      case "top-left":
        updates.x = style.x + dx;
        updates.y = style.y + dy;
        updates.width = style.width - dx;
        updates.height = style.height - dy;
        break;
      case "top-right":
        updates.y = style.y + dy;
        updates.width = style.width + dx;
        updates.height = style.height - dy;
        break;
      case "bottom-left":
        updates.x = style.x + dx;
        updates.width = style.width - dx;
        updates.height = style.height + dy;
        break;
      case "bottom-right":
        updates.width = style.width + dx;
        updates.height = style.height + dy;
        break;
    }
    handleResize(updates);
  }, [handleResize]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, { content: e.target.value });
  }, [element.id, updateElement]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onResizeStateChange?.(false);
  }, [onResizeStateChange]);


  
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === "text") {
      setIsEditing(true);
      onResizeStateChange?.(true);
    }
  }, [element.type, onResizeStateChange]);

  // Click handler to select the element
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(element);
  }, [element, setSelectedElement]);

  // Render different types of content
  const renderContent = useCallback(() => {
    switch (element.type) {
      case "text":
        if (isEditing) {
          return (
            <textarea
              style={{
                ...contentStyle,
                fontSize: `${element.style.fontSize}px`,
                color: element.style.color,
                backgroundColor: element.style.backgroundColor,
              }}
              className="p-0 border-none bg-transparent resize-none focus:outline-none"
              value={element.content}
              onChange={handleTextChange}
              onBlur={handleBlur}
              autoFocus
            />
          );
        }
        return (
          <p style={contentStyle} className="m-0 p-0 break-words">
            {element.content}
          </p>
        );
      
      case "image":
        return (
          <img
            src={element.content}
            alt=""
            style={contentStyle}
            className="object-cover"
          />
        );
      
      case "shape":
        return (
          <div
            style={{
              ...contentStyle,
              ...getShapeStyles(
                element.style.shapeType,
                element.style.backgroundColor!,
                element.style.rotation ?? 0
              ),
            }}
          />
        );
      
      default:
        return null;
    }
  }, [element, isEditing, contentStyle, handleTextChange, handleBlur]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isSelected ? "ring-2 ring-blue-500" : ""} ${
        element.type === "text"
          ? "cursor-text"
          : shouldEnableDrag
          ? "cursor-move"
          : "cursor-default"
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      {...(shouldEnableDrag ? { ...listeners, ...attributes } : {})}>
      {renderContent()}

      {isSelected && (
        <>
          {/* Edge resize handles */}
          <ResizeHandle
            position="right"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx) => handleResize({ width: currentStyleRef.current.width + dx })}
          />
          <ResizeHandle
            position="bottom"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(_, dy) => handleResize({ height: currentStyleRef.current.height + dy })}
          />
          <ResizeHandle
            position="left"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx) => handleResize({ 
              x: currentStyleRef.current.x + dx,
              width: currentStyleRef.current.width - dx 
            })}
          />
          <ResizeHandle
            position="top"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(_, dy) => handleResize({ 
              y: currentStyleRef.current.y + dy,
              height: currentStyleRef.current.height - dy 
            })}
          />

          {/* Corner resize handles */}
          <ResizeHandle
            position="top-left"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx, dy) => handleCornerResize("top-left", dx, dy)}
          />
          <ResizeHandle
            position="top-right"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx, dy) => handleCornerResize("top-right", dx, dy)}
          />
          <ResizeHandle
            position="bottom-left"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx, dy) => handleCornerResize("bottom-left", dx, dy)}
          />
          <ResizeHandle
            position="bottom-right"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx, dy) => handleCornerResize("bottom-right", dx, dy)}
          />
        </>
      )}
    </div>
  );
};

export default CanvasElement;