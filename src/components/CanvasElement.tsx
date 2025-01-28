import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Element } from '../types/editor';
import { useEditorStore } from '../store/editorStore';

interface Props {
  element: Element;
}

const CanvasElement: React.FC<Props> = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });
  const { selectedElement, setSelectedElement, updateElement } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);

  const getShapeStyles = (shapeType: string): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor: element.style.backgroundColor,
    };

    switch (shapeType) {
      case 'circle':
        return {
          ...baseStyles,
          borderRadius: '50%',
        };
      case 'triangle':
        return {
          ...baseStyles,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        };
      case 'star':
        return {
          ...baseStyles,
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        };
      default: // rectangle
        return baseStyles;
    }
  };

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    position: 'absolute' as const,
    top: element.style.y,
    left: element.style.x,
    width: element.style.width,
    height: element.style.height,
    rotate: `${element.style.rotation}deg`,
    fontSize: `${element.style.fontSize}px`,
    color: element.style.color,
  };

  const isSelected = selectedElement?.id === element.id;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'text') {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, { content: e.target.value });
  };
  const handleBlur = () => {
    setIsEditing(false);
  };
  const renderContent = () => {
    if (element.type === 'text' && isEditing) {
      return (
        <textarea
          value={element.content}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className="w-full h-full p-0 border-none bg-transparent resize-none focus:outline-none"
          autoFocus
          style={{
            fontSize: `${element.style.fontSize}px`,
            color: element.style.color,
          }}
        />
      );
    }
    if (element.type === 'text') {
      return <p className="m-0 p-0 break-words">{element.content}</p>;
    }
    if (element.type === 'image') {
      return <img src={element.content} alt="" className="w-full h-full object-cover" />;
    }
    // Shape rendering
    if (element.type === 'shape') {
      return <div style={getShapeStyles(element.style.shapeType)} />;
    }
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isSelected ? 'ring-2 ring-blue-500' : ''} ${element.type === 'text' ? 'cursor-text' : 'cursor-move'}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      onDoubleClick={handleDoubleClick}
      {...(isEditing ? {} : { ...listeners, ...attributes })}
    >
      {renderContent()}
    </div>
  );
};

export default CanvasElement;