import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import CanvasElement from './CanvasElement';

const Canvas: React.FC<{ drag?: boolean }> = ({ drag = true }) => {
  const { activeTemplate, updateElement, setSelectedElement, selectedElement, removeElement } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    if (active) {
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
    }
  };

  if (!activeTemplate) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Delete' && selectedElement) {
      removeElement(selectedElement.id);
    }
  };

  const handleCanvasClick = () => {
    setSelectedElement(null);
  };

  return (
    <div
      className="relative bg-white shadow-lg rounded-lg overflow-hidden mx-auto"
      onClick={handleCanvasClick}
      onKeyDown={handleKeyDown}
      style={{
        width: activeTemplate.canvasSize!.width,
        height: activeTemplate.canvasSize!.height,
        maxWidth: '100%',
        transform: 'scale(var(--canvas-scale, 1))',
        transformOrigin: 'top left',
      }}
    >
      {drag ? (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {activeTemplate.elements.map((element) => (
            <CanvasElement key={element.id} element={element} />
          ))}
        </DndContext>
      ) : (
        activeTemplate.elements.map((element) => (
          <CanvasElement key={element.id} element={element} />
        ))
      )}
    </div>
  );
};

export default Canvas;
