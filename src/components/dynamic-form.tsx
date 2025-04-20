import { Element, Template } from "@/types/editor";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState, memo } from "react";
import axios from "axios";
import Canvas from "./Canvas";
import { useEditorStore } from "@/store/editorStore";

// Memoized form field component for better performance
const FormField = memo(({ 
  element, 
  handleInputChange, 
  handleImageUpload 
}: { 
  element:Element, 
  handleInputChange: (id: string, value: string) => void, 
  handleImageUpload: (id: string, e: ChangeEvent<HTMLInputElement>) => void 
}) => {
  return (
    <div className="h-full flex flex-col">
      <label
        htmlFor={element.id}
        className="block text-sm font-medium text-gray-700 mb-1">
        {element.fieldName}
        {element.metadata?.isRequired && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {element.type === "image" ? (
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(element.id, e)}
            className="w-full py-1 px-2 text-sm border rounded-md"
          />
          {element.content && (
            <img
              src={`${element.content}`}
              alt="Uploaded"
              className="mt-2 rounded-md border w-full max-h-32 object-contain"
            />
          )}
        </div>
      ) : (
        <input
          type="text"
          id={element.id}
          value={element.content || ""}
          onChange={(e) => handleInputChange(element.id, e.target.value)}
          className="w-full py-1 px-2 text-sm border rounded-md flex-1"
          placeholder={`Enter ${element.fieldName}`}
          required={element.metadata?.isRequired}
        />
      )}
    </div>
  );
});

const DynamicFormModal: React.FC<{
  designId: string | undefined;
  onClose: () => void;
}> = ({ designId, onClose }) => {
  const { updateElement, setActiveTemplate, activeTemplate } = useEditorStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchDesign = async (id: string): Promise<Template> => {
    const { data } = await axios.get<{ design: Template }>(
      `${import.meta.env.VITE_BASE_URL}/designs/${id}`
    );
    return data.design;
  };

  useEffect(() => {
    if (!designId) return;

    const loadDesign = async () => {
      try {
        const designData = await fetchDesign(designId);
        setActiveTemplate({ ...designData });
      } catch (error) {
        console.error("Error fetching design:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDesign();
  }, [designId, setActiveTemplate]);

  const handleInputChange = (id: string, value: string) => {
    updateElement(id, { content: value });
  };

  const handleImageUpload = async (
    id: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/image/upload`, formData);
      const uploadedUrl = res.data?.docs?.[0]?.url;

      if (uploadedUrl) {
        updateElement(id, { content:`${import.meta.env.VITE_IMAGE_URL}${uploadedUrl}`  });
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
  };

  const dynamicElements = useMemo(
    () => activeTemplate?.elements.filter((el) => el.dynamic) || [],
    [activeTemplate]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="w-full md:w-1/2 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">
              {activeTemplate?.name || "Fill in the details"}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-pulse text-sm">Loading form...</div>
            </div>
          ) : dynamicElements.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">
              No dynamic fields found in this design.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicElements.map((element) => (
                  <FormField 
                    key={element.id}
                    element={element} 
                    handleInputChange={handleInputChange} 
                    handleImageUpload={handleImageUpload} 
                  />
                ))}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <Canvas drag={true} />
        </div>
      </div>
    </div>
  );
};

export default memo(DynamicFormModal);
