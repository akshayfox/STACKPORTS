import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import CanvasElement from './CanvasElement';

const Canvas: React.FC = () => {
  const { activeTemplate, updateElement } = useEditorStore();
  console.log(activeTemplate,'activeTemplate')
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

  return (
    <div 
      className="relative bg-white shadow-lg rounded-lg overflow-hidden  mx-auto  "
      style={{
        width: activeTemplate.canvasSize.width,
        height: activeTemplate.canvasSize.height,
        maxWidth: '100%',
        transform: 'scale(var(--canvas-scale, 1))',
        transformOrigin: 'top left',
      }}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {activeTemplate.elements.map((element) => (
          <CanvasElement key={element.id} element={element} />
        ))}
      </DndContext>
    </div>
  );
};

export default Canvas;