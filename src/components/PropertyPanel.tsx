import React from "react";
import { useEditorStore } from "../store/editorStore";

const PropertyPanel: React.FC = () => {
  const { selectedElement, updateElement } = useEditorStore();

  if (!selectedElement) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg">
        <p className="text-gray-500 text-center">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const handleStyleChange = (property: string, value: string | number) => {
    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    });
  };

  const handleContentChange = (content: string) => {
    updateElement(selectedElement.id, { content });
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg space-y-4 h-full">
      <h3 className="font-semibold text-lg border-b pb-2">Properties</h3>

      {selectedElement.type === "text" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={selectedElement.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Font Size
            </label>
            <input
              type="number"
              value={selectedElement.style.fontSize}
              onChange={(e) =>
                handleStyleChange("fontSize", Number(e.target.value))
              }
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="8"
              max="200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={selectedElement.style.color}
              onChange={(e) => handleStyleChange("color", e.target.value)}
              className="w-full h-10 p-1 border rounded-md"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position X
        </label>
        <input
          type="number"
          value={selectedElement.style.x}
          onChange={(e) => handleStyleChange("x", Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Position Y
        </label>
        <input
          type="number"
          value={selectedElement.style.y}
          onChange={(e) => handleStyleChange("y", Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Width
        </label>
        <input
          type="number"
          value={selectedElement.style.width}
          onChange={(e) => handleStyleChange("width", Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          min="10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Height
        </label>
        <input
          type="number"
          value={selectedElement.style.height}
          onChange={(e) => handleStyleChange("height", Number(e.target.value))}
          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          min="10"
        />
      </div>
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              value={selectedElement.style.color}
              onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
              className="w-full h-10 p-1 border rounded-md"
            />
          </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rotation
        </label>
        <input
          type="range"
          value={selectedElement.style.rotation}
          onChange={(e) =>
            handleStyleChange("rotation", Number(e.target.value))
          }
          className="w-full"
          min="0"
          max="360"
        />
        <div className="text-center text-sm text-gray-600">
          {selectedElement.style.rotation}°
        </div>
      </div>

      <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Border Radius
  </label>
  <input
    type="number"
    value={selectedElement.style.borderRadius || 0}
    onChange={(e) =>
      handleStyleChange("borderRadius", Number(e.target.value))
    }
    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
    min="0"
    max="200"
  />
</div>

    </div>
  );
};

export default PropertyPanel;
