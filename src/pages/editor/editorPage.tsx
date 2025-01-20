import { useEffect, useState } from "react";
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
import ZoomableCanvas from "../../components/ZoomableCanvas ";
import Canvas from "../../components/Canvas";
import PropertyPanel from "../../components/PropertyPanel";
import { useLocation } from "react-router-dom";

type LocationState = {
    width: number;
    height: number;
  };

const EditorPage = () => {
    const location = useLocation();

  const { setActiveTemplate } = useEditorStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPropertyPanelOpen, setIsPropertyPanelOpen] = useState(false);

  useEffect(() => {
    const canvasSize = (location.state as LocationState) || { width: 400, height: 500 };
    setActiveTemplate({
      id: "1",
      name: "Untitled Design",
      elements: [],
      canvasSize,
    });
  }, [location.state, setActiveTemplate]);

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
                Untitled Design
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-1 justify-center"></div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <button
              onClick={() => setIsPropertyPanelOpen(!isPropertyPanelOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg md:hidden">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg hidden md:block">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Download
            </button>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 hidden md:block">
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
              File
            </button>
            <button className="px-3 py-1 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
              Edit
            </button>
            <button className="px-3 py-1 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
              View
            </button>
          </div>
        </div>
      </header>

      <main className="flex relative h-[calc(100vh-104px)] md:h-[calc(100vh-104px)]">
        <div
          className={`
          absolute md:relative w-[210px] bg-white border-r border-gray-200 
          flex flex-col h-full z-40 transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}>
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
        </div>

        <div className="flex-1 bg-gray-100">
          <ZoomableCanvas>
            <div className="bg-white rounded-lg shadow-xl">
              <Canvas />
            </div>
          </ZoomableCanvas>
        </div>

        <div
          className={`
          absolute right-0 md:relative w-[300px] bg-white border-l border-gray-200 
          flex flex-col h-full z-40 transition-transform duration-300
          ${isPropertyPanelOpen ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0
        `}>
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
        </div>

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
