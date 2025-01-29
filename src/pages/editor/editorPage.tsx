import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Menu, Share2, ChevronDown, Home, Settings } from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import Toolbar from "../../components/Toolbar";
import Canvas from "../../components/Canvas";
import PropertyPanel from "../../components/PropertyPanel";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Template } from "../../types/editor";
import ZoomableCanvas from "@/components/ZoomableCanvas ";
import { captureCanvas } from "@/utils/helpers";

const DEFAULT_CANVAS_SIZE = {
  width: 400,
  height: 500,
};

type DesignResponse = {
  success: boolean;
  error?: string;
  design?: {
    _id: string;
    name: string;
    thumbnail: string;
    elements: any[];
    canvasSize: any;
    createdAt: string;
    updatedAt: string;
  } | null;
};

const api = {
  async saveDesign(design: Template): Promise<Template> {
    const { data } = await axios.post<Template>(
      `${import.meta.env.VITE_BASE_URL}/designs`,
      design
    );
    return data;
  },

  async fetchDesign(id: string): Promise<Template> {
    const { data } = await axios.get<{ design: Template }>(
      `${import.meta.env.VITE_BASE_URL}/designs/${id}`
    );
    return data.design;
  },

  async uploadThumbnail(formData: FormData): Promise<DesignResponse> {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/designs`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return {
      success: response.ok,
      error: !response.ok ? result.error : undefined,
      design: response.ok ? result.design : null,
    };
  },

  async updateDesign(id: string, formData: FormData): Promise<DesignResponse> {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/designs/${id}`,
      { method: "PUT", body: formData }
    );
    const result = await response.json();
    return {
      success: response.ok,
      error: !response.ok ? result.error : undefined,
    };
  },
};

const EditorPage: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { setActiveTemplate, activeTemplate } = useEditorStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      saveInitialDesign();
    }
    return () => setActiveTemplate(null);
  }, [location.state, setActiveTemplate, id]);

  const saveInitialDesign = async () => {
    if (!id || activeTemplate?._id) {
      const locationState =
        (location.state as { width: number; height: number }) ||
        DEFAULT_CANVAS_SIZE;

      // Ensure activeTemplate is properly set with default canvas size
      const newTemplate = {
        id: uuidv4(),
        name: "Untitled Design",
        elements: [],
        canvasSize: activeTemplate?.canvasSize || locationState,
      };

      try {
        const thumbnail = await captureCanvas(canvasRef, newTemplate); // Pass newTemplate instead of activeTemplate
        const formData = new FormData();
        const base64Data = thumbnail.split(",")[1];
        const byteArray = new Uint8Array(
          atob(base64Data)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], { type: "image/png" });
        formData.append("file", blob, "thumbnail.png");
        formData.append("name", newTemplate.name);
        formData.append("templateData", JSON.stringify(newTemplate));

        const result = await api.uploadThumbnail(formData);
        if (result.success && result.design?._id) {
          setActiveTemplate(result.design);
          localStorage.setItem("design_id", result.design._id);
          window.history.replaceState(null, "", `/editor/${result.design._id}`);
        }
      } catch (error) {}
    }
  };

  const { data: design, isError } = useQuery({
    queryKey: ["design", id],
    queryFn: () =>
      id
        ? api.fetchDesign(id).then((design) => {
            setActiveTemplate(design);
            return design;
          })
        : null,
    enabled: !!id,
  });

  const { mutate: saveTemplate, isPending } = useMutation({
    mutationFn: api.saveDesign,
    onSuccess: () => alert("Design saved successfully!"),
    onError: (error) => {
      console.error("Save error:", error);
      alert("Failed to save the design");
    },
  });

  const handleSave = async () => {
    if (!activeTemplate) return;

    try {
      const thumbnail = await captureCanvas(canvasRef, activeTemplate);
      const formData = new FormData();
      const base64Data = thumbnail.split(",")[1];
      const byteArray = new Uint8Array(
        atob(base64Data)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: "image/png" });
      formData.append("file", blob, "thumbnail.png");
      formData.append("name", activeTemplate.name!);
      formData.append("templateData", JSON.stringify(activeTemplate));
      const result = activeTemplate._id
        ? await api.updateDesign(activeTemplate._id, formData)
        : await api.uploadThumbnail(formData);
      if (result.success && result.design) {
        localStorage.setItem("design_id", result.design._id);
        window.history.replaceState(null, "", `/editor/${result.design._id}`);
      }
      alert(
        result.success
          ? "Design saved successfully!"
          : `Failed to save design: ${result.error}`
      );
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save the design");
    }
  };

  if (isError)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error loading design</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center h-14 px-2 md:px-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-purple-50 rounded-lg md:hidden">
              <Menu className="w-5 h-5 text-purple-700" />
            </button>
            <button className="p-2 hover:bg-purple-50 rounded-lg hidden md:block">
              <Home className="w-5 h-5 text-purple-700" />
            </button>
            <div className="hidden md:flex items-center space-x-2">
              <span className="font-semibold text-gray-700 truncate max-w-[150px]">
                {activeTemplate?.name || "Untitled Design"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-1 justify-center" />

          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={() => setIsPropertyPanelOpen(!isPropertyPanelOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden md:block">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleSave}
              className="px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:bg-purple-400"
              disabled={isPending}>
              {isPending ? "Saving..." : "Save Design"}
            </button>
          </div>
        </div>

        <nav className="bg-gray-50 px-4 py-2 border-b border-gray-200 hidden md:block">
          <div className="flex items-center space-x-4">
            {["File", "Edit", "View", "Save"].map((item) => (
              <button
                key={item}
                onClick={item === "Save" ? handleSave : undefined}
                className="px-3 py-1 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
                {item}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex relative h-[calc(100vh-104px)] md:h-[calc(100vh-104px)]">
        <aside
          className={`absolute  bg-white border-r border-gray-200 
          flex flex-col h-full z-40 transition-transform duration-300
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}>
          <div className="flex-1 overflow-y-auto">
            <Toolbar />
          </div>
        </aside>

        <div className="flex-1 bg-gray-100" ref={canvasRef}>
          <ZoomableCanvas>
            <div className="bg-white rounded-lg shadow-xl">
              <Canvas drag={true} />
            </div>
          </ZoomableCanvas>
        </div>

        <aside
          className={`absolute right-0 md:relative w-[300px] bg-white border-l border-gray-200 
          flex flex-col h-full z-40 transition-transform duration-300
          ${
            isPropertyPanelOpen ? "translate-x-0" : "translate-x-full"
          } md:translate-x-0`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Properties</span>
              <button
                onClick={() => setIsPropertyPanelOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg md:hidden">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PropertyPanel />
          </div>
        </aside>

        {(isSidebarOpen || isPropertyPanelOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => {
              setIsSidebarOpen(false);
              setIsPropertyPanelOpen(false);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default EditorPage;
