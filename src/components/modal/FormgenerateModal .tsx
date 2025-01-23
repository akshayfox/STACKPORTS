import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Element, Template } from "@/types/editor";
import Canvas from "../Canvas";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEditorStore } from "@/store/editorStore";

interface FormgenerateModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  template: Template | null;
}

function FormgenerateModal({ open, setOpen, template }: FormgenerateModalProps) {
  const { selectedElement, setSelectedElement } = useEditorStore();
  const [selectedelements, setSelectedElements] = useState<Element[]>([]);


  useEffect(() => {
    if (open && selectedElement && !selectedelements.some((el) => el.id === selectedElement.id)) {
      setSelectedElements((prev) => [...prev, selectedElement]);
    }
  }, [selectedElement]);

  const handleRemoveElement = (id: string) => {
    setSelectedElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedElement(null);
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
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-600 bg-white border-none p-1 rounded-full hover:bg-gray-200"
              >
                &times;
              </button>
            </div>
          </div>
        );
      case "image":
        return (
          <div key={element.id} className="mb-4 relative">
            <label htmlFor={element.id} className="block text-sm font-semibold mb-2">
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
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-600 bg-white border-none p-1 rounded-full hover:bg-gray-200"
              >
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
      <DialogTrigger asChild>
        <button onClick={() => setOpen(true)}>Open</button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Form</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-4 bg-gray-100 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 flex-1">
            {template ? <Canvas drag={false} /> : <p>No template available</p>}
          </div>
          <div className="bg-white rounded-lg shadow-xl p-4 flex-1">
            <h3 className="font-semibold text-lg mb-4">Generated Form</h3>
            <form>{selectedelements.map((el) => renderFormField(el))}</form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FormgenerateModal;
