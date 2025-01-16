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
    backgroundColor: element.style.backgroundColor,
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
      {element.type === 'text' && isEditing ? (
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
      ) : element.type === 'text' ? (
        <p className="m-0 p-0 break-words">{element.content}</p>
      ) : element.type === 'image' ? (
        <img src={element.content} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" style={{ backgroundColor: element.style.backgroundColor }} />
      )}
    </div>
  );
};

export default CanvasElement;