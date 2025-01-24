import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Element, Form, Template } from "@/types/editor";
import Canvas from "../Canvas";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEditorStore } from "@/store/editorStore";

interface FormgenerateModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  template: Template | null;
}

function DataEntryModal({
  open,
  setOpen,
  template,
}: FormgenerateModalProps) {
  const { selectedElement, setSelectedElement } = useEditorStore();
  const [selectedelements, setSelectedElements] = useState<Element[]>([]);


  useEffect(() => {
    if (
      open &&
      selectedElement &&
      !selectedelements.some((el) => el.id === selectedElement.id)
    ) {
      setSelectedElements((prev) => [...prev, selectedElement]);
    }
  }, [selectedElement]);



  const handleRemoveElement = (id: string) => {
    setSelectedElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedElement(null);
  };

  const handleSubmit = async () => {
    const formData: Form = {
      templateId: template?._id || "",
      name: template?.name || "Generated Form",
      elements: selectedelements.map((el) => ({
        id: el.id,
        type: el.type,
        label: el.label || "",
        placeholder: el.placeholder || "",
        content: el.content || "",
        required: el.required || false,
        options: el.options || [],
        style: el.style,
      })),
    };
    try {
      const response = await fetch("http://localhost:3001/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to save form data");
      }
      alert("Form data saved successfully!");
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving form data.");
    }
  };

  const renderFormField = (element: Element) => {
    switch (element.type) {
      case "text":
        return (
          <div key={element.id} className="mb-4 relative">
            <label htmlFor={element.id} className="block text-sm font-semibold">
              {element.label || "Text Input"}
            </label>
            <div className="relative">
              <input
                type="text"
                id={element.id}
                name={element.id}
                placeholder={element.content || ""}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => handleRemoveElement(element.id)}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-600 bg-white border-none p-1 rounded-full hover:bg-gray-200">
                &times;
              </button>
            </div>
          </div>
        );
      case "image":
        return (
          <div key={element.id} className="mb-4 relative">
            <label
              htmlFor={element.id}
              className="block text-sm font-semibold mb-2">
              {element.label || "Upload Image"}
            </label>
            <div className="relative">
              <input
                type="file"
                id={element.id}
                name={element.id}
                accept="image/*"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg pr-10"
              />
              <button
                type="button"
                onClick={() => handleRemoveElement(element.id)}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-600 bg-white border-none p-1 rounded-full hover:bg-gray-200">
                &times;
              </button>
            </div>
          </div>
        );
      default:
        return <p>Unsupported element type.</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Form</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
          <button
            onClick={handleSubmit}
            className="mb-6 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Generate Form
          </button>
          <div className="flex flex-col md:flex-row gap-4 bg-gray-100 p-4 w-full max-w-6xl">
            <div className="bg-white rounded-lg shadow-xl p-4 flex-1">
              {template ? (
                <Canvas drag={false} />
              ) : (
                <p>No template available</p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-xl p-4 flex-1">
              <h3 className="font-semibold text-lg mb-4">Generated Form</h3>
              <form>{selectedelements.map((el) => renderFormField(el))}</form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DataEntryModal;
