import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Menu,
  Search,
  Share2,
  ChevronDown,
  Home,
  Settings,
} from "lucide-react";
import { useEditorStore } from "../../store/editorStore";
import Toolbar from "../../components/Toolbar";
import Canvas from "../../components/Canvas";
import PropertyPanel from "../../components/PropertyPanel";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Template } from "../../types/editor";
import html2canvas from "html2canvas";
import ZoomableCanvas from "@/components/ZoomableCanvas ";

interface LocationState {
  width: number;
  height: number;
}

const DEFAULT_CANVAS_SIZE = {
  width: 400,
  height: 500,
};

const api = {
  async saveDesign(design: Template): Promise<Template> {
    const response = await axios.post<Template>(
      `${import.meta.env.VITE_BASE_URL}/designs`,
      design
    );
    return response.data;
  },

  async fetchDesign(id: string): Promise<Template> {
    const response = await axios.get<{ design: Template }>(
      `${import.meta.env.VITE_BASE_URL}/designs/${id}`
    );
    return response.data.design;
  },

  async uploadThumbnail(formData: FormData
): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/designs`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return {
      success: response.ok,
      error: !response.ok ? result.error : undefined,
    };
  },

  async updateDesign(
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; error?: string }> {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/designs/${id}`,
      {
        method: "PUT",
        body: formData,
      }
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
  console.log(activeTemplate, "activeTemplate");

  useEffect(() => {
    saveInitialDesign();
  }, [location.state, setActiveTemplate, id]);

  const saveInitialDesign = async () => {
    if (!id) {
      const locationState = location.state as LocationState;
      const canvasSize = locationState || DEFAULT_CANVAS_SIZE;
      const newTemplate = {
        id: uuidv4(),
        name: "Untitled Design",
        elements: [],
        canvasSize,
      };
      setActiveTemplate(newTemplate);

      try {
        const thumbnail = await captureCanvas();
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
        await api.uploadThumbnail(formData);
      } catch (error) {
        console.error("Initial save error:", error);
      }
    }
  };

  const { data: design, isError } = useQuery({
    queryKey: ["design", id],
    queryFn: () =>
      id
        ? api.fetchDesign(id).then((design) => {
            setActiveTemplate(design);
            // Auto-save loaded template
            handleSave();
            return design;
          })
        : null,
    enabled: !!id,
  });

  const captureCanvas = async (): Promise<string> => {
    const canvasContent = canvasRef.current?.querySelector<HTMLElement>(
      ".bg-white.rounded-lg.shadow-xl"
    );
    if (!canvasContent) {
      throw new Error("Canvas content not found");
    }
    try {
      const canvas = await html2canvas(canvasContent, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: activeTemplate?.canvasSize.width,
        height: activeTemplate?.canvasSize.height,
      });
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error capturing canvas:", error);
      throw error;
    }
  };

  const { mutate: saveTemplate, isPending } = useMutation({
    mutationFn: api.saveDesign,
    onSuccess: () => {
      alert("Design saved successfully!");
    },
    onError: (error) => {
      console.error("Save error:", error);
      alert("Failed to save the design");
    },
  });

  const handleSave = async () => {
    if (!activeTemplate) {
      return;
    }
    try {
      const thumbnail = await captureCanvas();
      const formData = new FormData();
      const base64Data = thumbnail.split(",")[1];
      const byteArray = new Uint8Array(
        atob(base64Data)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteArray], { type: "image/png" });
      formData.append("file", blob, "thumbnail.png");
      formData.append("name", activeTemplate.name);
      formData.append("templateData", JSON.stringify(activeTemplate));
      const result = await api.uploadThumbnail(formData);
      if (result.success) {
        alert("Design saved successfully!");
      } else {
        alert(`Failed to save design: ${result.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save the design");
    }
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Error loading design</p>
      </div>
    );
  }

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
          className={`absolute md:relative w-[210px] bg-white border-r border-gray-200 
          flex flex-col h-full z-40 transition-transform duration-300
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}>
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search elements..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Toolbar />
          </div>
        </aside>

        <div className="flex-1 bg-gray-100" ref={canvasRef}>
          <ZoomableCanvas>
            <div className="bg-white rounded-lg shadow-xl">
              <Canvas />
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
