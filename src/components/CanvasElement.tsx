import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useDraggable } from "@dnd-kit/core";
import { Element } from "../types/editor";
import { useEditorStore } from "../store/editorStore";
import ResizeHandle from "./ResizeHandle";

interface Props {
  element: Element;
  drag?: boolean;
  onResizeStateChange?: (isResizing: boolean) => void;
}

const CanvasElement: React.FC<Props> = ({
  element,
  drag = true,
  onResizeStateChange,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const shouldEnableDrag = drag && !isResizing && !isEditing;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });

  const { selectedElement, setSelectedElement, updateElement } =
    useEditorStore();
  const isSelected = selectedElement?.id === element.id;

  const currentStyleRef = useRef(element.style);

  useEffect(() => {
    currentStyleRef.current = element.style;
  }, [element.style]);

  const transformStyle = useMemo(() => {
    if (transform && shouldEnableDrag) {
      return `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    }
    return undefined;
  }, [transform, shouldEnableDrag]);

  const style = useMemo(
    () => ({
      transform: transformStyle,
      position: "absolute" as const,
      top: element.style.y,
      left: element.style.x,
      width: element.style.width,
      height: element.style.height,
      rotate: `${element.style.rotation}deg`,
      fontSize: `${element.style.fontSize}px`,
      color: element.style.color,
      // For the container
      borderRadius: element.style.borderRadius
        ? `${element.style.borderRadius}%`
        : "0%",
      overflow: "hidden", // This is crucial for clipping child elements
    }),
    [transformStyle, element.style]
  );

  const getShapeStyles = (type: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: "100%",
      height: "100%",
      backgroundColor: element.style.backgroundColor,
    };

    switch (type) {
      case "circle":
        return { ...base, borderRadius: "50%" };
      case "triangle":
        return { ...base, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" };
      case "star":
        return {
          ...base,
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        };
      default:
        return base;
    }
  };

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
  }, [
    element.id,
    element.style,
    transform,
    updateElement,
    onResizeStateChange,
  ]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    onResizeStateChange?.(false);
  }, [onResizeStateChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, { content: e.target.value });
  };

  const handleBlur = () => {
    setIsEditing(false);
    onResizeStateChange?.(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === "text") {
      setIsEditing(true);
      onResizeStateChange?.(true);
    }
  };

  const renderContent = () => {
    const contentStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      borderRadius: `${element.style.borderRadius || 0}px`,
      overflow: "hidden",
    };

    if (element.type === "text" && isEditing) {
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

    if (element.type === "text") {
      return (
        <p style={contentStyle} className="m-0 p-0 break-words">
          {element.content}
        </p>
      );
    }

    if (element.type === "image") {
      return (
        <img
          src={element.content}
          alt=""
          style={contentStyle}
          className="object-cover"
        />
      );
    }

    if (element.type === "shape") {
      return (
        <div
          style={{
            ...contentStyle,
            ...getShapeStyles(element.style.shapeType),
            backgroundColor: element.style.backgroundColor,
          }}
        />
      );
    }

    return null;
  };

  const handleResize = (key: "width" | "height", delta: number) => {
    const style = currentStyleRef.current;
    updateElement(element.id, {
      style: {
        ...style,
        [key]: Math.max(20, style[key] + delta),
      },
    });
  };

  // Modify the handleCornerResize function
  const handleCornerResize = (corner: string, dx: number, dy: number) => {
    const style = currentStyleRef.current;
    switch (corner) {
      case "top-left":
        updateElement(element.id, {
          style: {
            ...style,
            x: style.x + dx,
            y: style.y + dy,
            width: Math.max(20, style.width - dx),
            height: Math.max(20, style.height - dy),
          },
        });
        break;

      case "top-right":
        updateElement(element.id, {
          style: {
            ...style,
            y: style.y + dy,
            width: Math.max(20, style.width + dx),
            height: Math.max(20, style.height - dy),
          },
        });
        break;

      case "bottom-left":
        updateElement(element.id, {
          style: {
            ...style,
            x: style.x + dx,
            width: Math.max(20, style.width - dx),
            height: Math.max(20, style.height + dy),
          },
        });
        break;

      case "bottom-right":
        updateElement(element.id, {
          style: {
            ...style,
            width: Math.max(20, style.width + dx),
            height: Math.max(20, style.height + dy),
          },
        });
        break;
    }
  };
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
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      onDoubleClick={handleDoubleClick}
      {...(shouldEnableDrag ? { ...listeners, ...attributes } : {})}>
      {renderContent()}

      {isSelected && (
        <>
          <ResizeHandle
            position="right"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx) => handleResize("width", dx)}
          />
          <ResizeHandle
            position="bottom"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(_, dy) => handleResize("height", dy)}
          />
          <ResizeHandle
            position="left"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(dx) => {
              const style = currentStyleRef.current;
              updateElement(element.id, {
                style: {
                  ...style,
                  x: style.x + dx,
                  width: Math.max(20, style.width - dx),
                },
              });
            }}
          />
          <ResizeHandle
            position="top"
            onResizeStart={handleResizeStart}
            onResizeEnd={handleResizeEnd}
            onResize={(_, dy) => {
              const style = currentStyleRef.current;
              updateElement(element.id, {
                style: {
                  ...style,
                  y: style.y + dy,
                  height: Math.max(20, style.height - dy),
                },
              });
            }}
          />

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
