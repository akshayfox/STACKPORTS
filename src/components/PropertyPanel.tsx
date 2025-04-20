import React, { useState } from "react";
import { useEditorStore } from "../store/editorStore";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Switch } from "./ui/switch";

const PropertyPanel: React.FC = () => {
  const { selectedElement, updateElement } = useEditorStore();
  const [fieldLabel, setFieldLabel] = useState("");
  const [isDynamic, setIsDynamic] = useState(false);
  if (!selectedElement) {
    return (
      <div className="bg-white p-4 shadow-lg rounded-lg">
        <p className="text-gray-500 text-center">
          Select an element to edit its properties
        </p>
      </div>
    );
  }

  const handleFieldLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setFieldLabel(newLabel);
    if (isDynamic) {
      updateElement(selectedElement.id, {
        fieldName: newLabel,
        content: newLabel,
      });
    }
  };

  const handleStyleChange = (property: string, value: string | number) => {
    updateElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    });
  };

  const handleDynamicToggle = (checked: boolean) => {
    setIsDynamic(checked);
    const field = fieldLabel || `field_${Date.now()}`;
    updateElement(selectedElement.id, {
      dynamic: checked,
      fieldName: checked ? field : undefined,
      content: checked ? `${field}` : "Double click to edit",
    });
  };

  const handleContentChange = (content: string) => {
    updateElement(selectedElement.id, { content });
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">Properties</h3>

      {selectedElement.type === "text" && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Dynamic Field
              </label>
              <Switch
                checked={selectedElement.dynamic}
                onCheckedChange={handleDynamicToggle}
              />
            </div>

            {selectedElement.dynamic && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={selectedElement.fieldName}
                  onChange={handleFieldLabelChange}
                  placeholder="Enter field name (e.g., student_name)"
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be used as the data key when generating IDs
                </p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Align
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleStyleChange("textAlign", "left")}
                className={`p-2 border rounded-md ${
                  selectedElement.style.textAlign === "left"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
                }`}>
                <AlignLeft size={20} />
              </button>
              <button
                onClick={() => handleStyleChange("textAlign", "center")}
                className={`p-2 border rounded-md ${
                  selectedElement.style.textAlign === "center"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
                }`}>
                <AlignCenter size={20} />
              </button>
              <button
                onClick={() => handleStyleChange("textAlign", "right")}
                className={`p-2 border rounded-md ${
                  selectedElement.style.textAlign === "right"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
                }`}>
                <AlignRight size={20} />
              </button>
              <button
                onClick={() => handleStyleChange("textAlign", "justify")}
                className={`p-2 border rounded-md ${
                  selectedElement.style.textAlign === "justify"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700"
                }`}>
                <AlignJustify size={20} />
              </button>
            </div>
          </div>

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

      {selectedElement.type === "image" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Dynamic Field
            </label>
            <Switch
              checked={selectedElement.dynamic}
              onCheckedChange={(checked) => {
                setIsDynamic(checked);
                const field = fieldLabel || `image_${Date.now()}`;
                updateElement(selectedElement.id, {
                  dynamic: checked,
                  fieldName: checked ? field : undefined,
                });
              }}
            />
          </div>

          {selectedElement.dynamic && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label
              </label>
              <input
                type="text"
                value={selectedElement.fieldName}
                onChange={(e) => {
                  const label = e.target.value;
                  setFieldLabel(label);
                  updateElement(selectedElement.id, {
                    fieldName: label,
                  });
                }}
                placeholder="Enter field name (e.g., student_photo)"
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be replaced with an image URL when generating IDs.
              </p>
            </div>
          )}
        </div>
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
