import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { Type, Image, Square, Trash2 } from 'lucide-react';

const Toolbar: React.FC = () => {
  const { addElement, selectedElement, removeElement } = useEditorStore();

  const addText = () => {
    addElement({
      id: crypto.randomUUID(),
      type: 'text',
      content: 'Double click to edit',
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        rotation: 0,
        fontSize: 16,
        color: '#000000',
      },
    });
  };

  const addImage = () => {
    addElement({
      id: crypto.randomUUID(),
      type: 'image',
      content: 'https://source.unsplash.com/random/800x600',
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
      },
    });
  };

  const addShape = () => {
    addElement({
      id: crypto.randomUUID(),
      type: 'shape',
      content: '',
      style: {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0,
        backgroundColor: '#e2e8f0',
      },
    });
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg h-full ">
      <h3 className="font-semibold text-lg border-b pb-2 mb-4">Tools</h3>
      <div className="space-y-2">
        <button
          onClick={addText}
          className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors"
        >
          <Type size={20} /> Add Text
        </button>
        <button
          onClick={addImage}
          className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors"
        >
          <Image size={20} /> Add Image
        </button>
        <button
          onClick={addShape}
          className="w-full p-3 hover:bg-gray-100 rounded-lg flex items-center gap-3 transition-colors"
        >
          <Square size={20} /> Add Shape
        </button>
        {selectedElement && (
          <button
            onClick={() => removeElement(selectedElement.id)}
            className="w-full p-3 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-3 transition-colors mt-4"
          >
            <Trash2 size={20} /> Delete Element
          </button>
        )}
      </div>
    </div>
  );
};

export default Toolbar;