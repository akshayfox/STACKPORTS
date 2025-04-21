// ClientForm.tsx
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
  memo,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { Element, Template } from "@/types/editor";
import { useEditorStore } from "@/store/editorStore";
import Canvas from "@/components/Canvas";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Upload, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getGroupByClientId } from "@/services/userService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { debounce } from "lodash";
import { getHeaders } from "@/utils/auth";
import { v4 as uuidv4 } from "uuid";
import { captureCanvas } from "@/utils/helpers";

// Memoized FormField Component
const FormField = memo(
  ({
    element,
    formik,
    handleImageUpload,
    handleInputChange,
  }: {
    element: Element;
    formik: any;
    handleImageUpload: (id: string, e: ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (id: string, value: string) => void;
  }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (
      id: string,
      e: ChangeEvent<HTMLInputElement>
    ) => {
      setUploading(true);
      await handleImageUpload(id, e);
      setUploading(false);
    };

    // Debounced input change handler
    const debouncedChangeHandler = useMemo(
      () => debounce(handleInputChange, 300),
      [handleInputChange]
    );

    return (
      <div className="mb-4">
        <label
          htmlFor={element.id}
          className="block text-sm font-medium text-gray-700 mb-1">
          {element.fieldName}
          {element.metadata?.isRequired && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>

        {element.type === "image" ? (
          <div className="mt-1">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg border border-gray-300 cursor-pointer hover:bg-blue-50 transition-colors duration-200">
              {uploading ? (
                <Loader className="w-8 h-8 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
              <span className="mt-2 text-sm">
                {uploading ? "Uploading..." : "Select an image"}
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(element.id, e)}
                disabled={uploading}
              />
            </label>

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
          <>
            <input
              type="text"
              id={element.id}
              name={element.id}
              value={formik.values[element.id] || ""}
              onChange={(e) => {
                formik.handleChange(e);
                debouncedChangeHandler(element.id, e.target.value);
              }}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
              placeholder={`Enter ${element.fieldName}`}
            />
            {formik.touched[element.id] && formik.errors[element.id] && (
              <div className="mt-1 text-sm text-red-600">
                {formik.errors[element.id]}
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

const ClientForm: React.FC = () => {
  const location = useLocation();
  const { designId } = useParams<{ designId: string }>();
  const canvasRef = useRef<HTMLDivElement>(null);

  const searchParams = new URLSearchParams(location.search);
  const clientId = searchParams.get("clientId");
  const navigate = useNavigate();

  const { updateElement, setActiveTemplate, activeTemplate } = useEditorStore();
  console.log(activeTemplate, "activeTemplate");
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

  // Handler for immediate updates to the preview
  const handleInputChange = useCallback(
    (id: string, value: string) => {
      updateElement(id, { content: value });
    },
    [updateElement]
  );

  const handleImageUpload = async (
    id: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("images", file);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/image/upload`,
        formData
      );
      const uploadedUrl = res.data?.docs?.[0]?.url;
      if (uploadedUrl) {
        const imageUrl = `${import.meta.env.VITE_IMAGE_URL}${uploadedUrl}`;
        updateElement(id, {
          content: imageUrl,
        });
        formik.setFieldValue(id, imageUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const dynamicElements = useMemo(
    () => activeTemplate?.elements.filter((el) => el.dynamic) || [],
    [activeTemplate]
  );

  // Create initial values and validation schema
  const { initialValues, validationSchema } = useMemo(() => {
    const values: Record<string, string> = {};
    const schema: Record<string, any> = {};

    dynamicElements.forEach((element) => {
      values[element.id] = element.content || "";
      if (element.metadata?.isRequired && element.type !== "image") {
        schema[element.id] = Yup.string().required(
          `${element.fieldName} is required`
        );
      }
    });

    return {
      initialValues: values,
      validationSchema: Yup.object().shape(schema),
    };
  }, [dynamicElements]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (!activeTemplate) return;

      setFormSubmitting(true);
      try {
        Object.entries(values).forEach(([id, value]) => {
          updateElement(id, { content: value });
        });
        const thumbnail = await captureCanvas(canvasRef, activeTemplate);
        const base64Data = thumbnail.split(",")[1];
        const byteArray = new Uint8Array(
          atob(base64Data)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], { type: "image/png" });
        const studentCardData = {
          id: uuidv4(),
          name: activeTemplate?.name || "Untitled Card",
          canvasSize: activeTemplate?.canvasSize || { width: 800, height: 600 },
          elements: activeTemplate?.elements || [],
          client: clientId,
          group: values.group,
        };
        const formData = new FormData();
        formData.append("thumbnail", blob, "thumbnail.png"); // <-- Important!
        formData.append("data", JSON.stringify(studentCardData));
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/student`,
          formData,
          {
            headers: {
              ...getHeaders().headers, // Extract inner headers
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          navigate(-1);
        } else {
          throw new Error("Failed to save form data");
        }
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setFormSubmitting(false);
      }
    },
  });

  const { data: groupsByClient = [], isLoading: groupsByClientLoading } =
    useQuery({
      queryKey: ["groupsByClient", clientId],
      queryFn: () => getGroupByClientId(clientId),
      enabled: !!clientId,
    });

  const groupOptions = groupsByClient.map((group: any) => ({
    label: group.fullname,
    value: group._id,
  }));

  // Component for consistent loading state
  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center py-6">
      <Loader className="w-5 h-5 animate-spin text-blue-600 mr-2" />
      <span className="text-gray-600">{message}</span>
    </div>
  );

  // Component for empty state
  const EmptyState = () => (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <div className="rounded-full bg-gray-100 p-3 mb-4">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">
        No form fields found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        This design doesn't contain any dynamic fields to fill out.
      </p>
    </div>
  );

  // Component for form buttons
  const FormButtons = ({ submitting }: { submitting: boolean }) => (
    <div className="flex justify-end space-x-3">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        disabled={submitting}>
        Cancel
      </button>
      <button
        type="submit"
        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        disabled={submitting || !formik.isValid}>
        {submitting ? (
          <>
            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            Processing...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left panel - Form */}
            <div className="w-full md:w-1/2 p-6 lg:p-8">
              <div className="mb-6">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back</span>
                </button>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {activeTemplate?.name || "Client Information"}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Please fill in the required information below
                </p>
              </div>

              {isLoading ? (
                <LoadingState message="Loading form..." />
              ) : dynamicElements.length === 0 ? (
                <EmptyState />
              ) : (
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                    {groupsByClientLoading ? (
                      <div className="sm:col-span-2">
                        <LoadingState message="Loading groups..." />
                      </div>
                    ) : groupOptions.length > 0 ? (
                      <div className="sm:col-span-2 mb-2">
                        <label
                          htmlFor="group"
                          className="block text-sm font-medium text-gray-700 mb-1">
                          Select Group
                        </label>
                        <select
                          id="group"
                          name="group"
                          className="block w-full rounded-md border-gray-300 border px-3 py-2 bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                          defaultValue="">
                          <option value="" disabled>
                            Select a group
                          </option>
                          {groupOptions.map((group: any) => (
                            <option key={group.value} value={group.value}>
                              {group.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}

                    {/* Dynamic elements */}
                    {dynamicElements.map((element) => (
                      <div
                        key={element.id}
                        className={
                          element.type === "image" ? "sm:col-span-2" : ""
                        }>
                        <FormField
                          element={element}
                          formik={formik}
                          handleImageUpload={handleImageUpload}
                          handleInputChange={handleInputChange}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-200">
                    <FormButtons submitting={formSubmitting} />
                  </div>
                </form>
              )}
            </div>

            {/* Right panel - Preview */}
            <div className="w-full md:w-1/2 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
              <div className="p-6 lg:p-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Live Preview
                </h2>

                <div ref={canvasRef}>
                  <div id="canvas-content" className="">
                    <Canvas drag={false} />
                  </div>
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
