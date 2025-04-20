// ClientForm.tsx
import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState, memo } from "react";
import axios from "axios";
import { Element, Template } from "@/types/editor";
import { useEditorStore } from "@/store/editorStore";
import Canvas from "@/components/Canvas";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Loader } from "lucide-react";

// Memoized FormField Component
const FormField = memo(({ 
  element, 
  handleInputChange, 
  handleImageUpload 
}: { 
  element: Element, 
  handleInputChange: (id: string, value: string) => void, 
  handleImageUpload: (id: string, e: ChangeEvent<HTMLInputElement>) => void 
}) => {
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    await handleImageUpload(id, e);
    setUploading(false);
  };
  
  return (
    <div className="mb-6">
      <label htmlFor={element.id} className="block text-sm font-medium text-gray-700 mb-2">
        {element.fieldName}
        {element.metadata?.isRequired && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      {element.type === "image" ? (
        <div className="mt-1">
          <div className="flex items-center">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-lg tracking-wide border border-blue-300 cursor-pointer hover:bg-blue-50 transition-colors duration-200">
              <Upload className="w-8 h-8" />
              <span className="mt-2 text-sm">Select an image</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(element.id, e)} 
                disabled={uploading}
              />
            </label>
          </div>
          
          {uploading && (
            <div className="mt-3 flex justify-center">
              <Loader className="animate-spin h-6 w-6 text-blue-600" />
            </div>
          )}
          
          {element.content && !uploading && (
            <div className="mt-3 flex justify-center">
              <img
                src={element.content}
                alt="Uploaded"
                className="rounded-lg border border-gray-200 h-24 object-contain bg-gray-50"
              />
            </div>
          )}
        </div>
      ) : (
        <input
          type="text"
          id={element.id}
          value={element.content || ""}
          onChange={(e) => handleInputChange(element.id, e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
          placeholder={`Enter ${element.fieldName}`}
          required={element.metadata?.isRequired}
        />
      )}
    </div>
  );
});

const ClientForm: React.FC = () => {
  const { designId } = useParams<{ designId: string }>();
  const navigate = useNavigate();

  const { updateElement, setActiveTemplate, activeTemplate } = useEditorStore();
  const [isLoading, setIsLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

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
        updateElement(id, { content: `${import.meta.env.VITE_IMAGE_URL}${uploadedUrl}` });
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      // You can add form submission logic here
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating API call
      navigate(-1); // Navigate back after submit
    } catch (error) {
      console.error("Form submission error:", error);
      setFormSubmitting(false);
    }
  };

  const dynamicElements = useMemo(
    () => activeTemplate?.elements.filter((el) => el.dynamic) || [],
    [activeTemplate]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left panel - Form */}
            <div className="w-full md:w-1/2 p-8">
              <div className="mb-8">
                <button 
                  onClick={() => navigate(-1)} 
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </button>
                
                <h1 className="text-3xl font-bold text-gray-900">
                  {activeTemplate?.name || "Client Information"}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Please fill in the required information below
                </p>
              </div>

              {isLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Loading form...</span>
                </div>
              ) : dynamicElements.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-gray-100 p-3 mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No form fields found</h3>
                  <p className="mt-1 text-sm text-gray-500">This design doesn't contain any dynamic fields to fill out.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {dynamicElements.map((element) => (
                      <div key={element.id} className={element.type === "image" ? "sm:col-span-2" : ""}>
                        <FormField
                          element={element}
                          handleInputChange={handleInputChange}
                          handleImageUpload={handleImageUpload}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-5 border-t border-gray-200">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={formSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={formSubmitting}
                      >
                        {formSubmitting ? (
                          <>
                            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                            Processing...
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            {/* Right panel - Preview */}
            <div className="w-full md:w-1/2 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
                <div className="bg-white rounded-lg shadow p-2">
                  <Canvas drag={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;