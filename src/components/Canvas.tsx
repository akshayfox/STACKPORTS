import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import CanvasElement from './CanvasElement';

interface CanvasProps {
  drag?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
}

const Canvas: React.FC<CanvasProps> = ({ drag = true, cardRef }) => {
  const {
    activeTemplate,
    updateElement,
    setSelectedElement,
    selectedElement,
    removeElement,
  } = useEditorStore();

  const [isAnyElementResizing, setIsAnyElementResizing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (isAnyElementResizing) return;

    const { active, delta } = event;
    const element = activeTemplate?.elements.find(el => el.id === active.id);

    if (element) {
      updateElement(active.id as string, {
        style: {
          ...element.style,
          x: element.style.x + delta.x,
          y: element.style.y + delta.y,
        },
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Delete' && selectedElement) {
      removeElement(selectedElement.id);
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  const handleResizeStateChange = (isResizing: boolean) => {
    setIsAnyElementResizing(isResizing);
  };

  if (!activeTemplate) return null;

  const canvasStyle = {
    width: activeTemplate.canvasSize?.width,
    height: activeTemplate.canvasSize?.height,
    maxWidth: '100%',
    transform: 'scale(var(--canvas-scale, 1))',
    transformOrigin: 'top left',
  } as React.CSSProperties;

  const elements = activeTemplate.elements.map(element => (
    <CanvasElement
      key={element.id}
      element={element}
      onResizeStateChange={handleResizeStateChange}
    />
  ));

  return (
    <div
      ref={cardRef}
      className="relative bg-white shadow-lg rounded-lg overflow-hidden mx-auto"
      onClick={handleCanvasClick}
      onKeyDown={handleKeyDown}
      style={canvasStyle}
      tabIndex={0}
    >
      {drag ? <DndContext sensors={sensors} onDragEnd={handleDragEnd}>{elements}</DndContext> : elements}
    </div>
  );
};

export default Canvas;
