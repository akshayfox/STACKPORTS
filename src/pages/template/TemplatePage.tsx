import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  Edit,
  Copy,
  Trash,
  Share,
  LucideIcon,
} from "lucide-react";
import axios from "axios";
import { ContextMenuState, Template } from "@/types/editor";

interface MenuItem {
  icon: LucideIcon;
  label: string;
}

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onOptionClick: (action: string) => void;
}

const fetchDesigns = async (): Promise<Template[]> => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/designs`);
  return response.data.designs;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  visible,
  onClose,
  onOptionClick,
}) => {
  if (!visible) return null;

  const menuItems: MenuItem[] = [
    { icon: Edit, label: "Edit" },
    { icon: Copy, label: "Duplicate" },
    { icon: Share, label: "Share" },
    { icon: Trash, label: "Delete" },
  ];

  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
      style={{
        left: x,
        top: y,
        minWidth: "160px",
      }}>
      {menuItems.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          onClick={() => onOptionClick(label.toLowerCase())}>
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

const TemplatePage: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    visible: false,
    templateId: null, // Initialize with null or appropriate default value
  });

  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery<Template[]>({
    queryKey: ["designs"],
    queryFn: fetchDesigns,
  });

  const handleRightClick = (event: React.MouseEvent, templateId: string) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const menuWidth = 160;
    const menuHeight = 160;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const x =
      clientX + menuWidth > viewportWidth ? clientX - menuWidth : clientX;
    const y =
      clientY + menuHeight > viewportHeight ? clientY - menuHeight : clientY;
    setContextMenu({
      x,
      y,
      visible: true,
      templateId, // Set the templateId correctly when the right-click happens
    });
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };

    if (contextMenu.visible) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleContextMenuOption = async (action: string) => {
    switch (action) {
      case "edit":
        break;
      case "duplicate":
        break;
      case "share":
        break;
      case "delete":
        break;
      default:
        break;
    }
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  if (isLoading) return <div>Loading designs...</div>;
  if (isError) return <div>Error loading designs. Please try again later.</div>;
  if (!templates) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold">Template Gallery</h1>
              <div className="hidden md:flex items-center gap-4">
                <Button variant="ghost" className="text-sm">
                  Categories <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
                <Button variant="ghost" className="text-sm">
                  Complexity <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
                <Button variant="ghost" className="text-sm">
                  Sort By <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {templates.map((template: Template) => (
            <Card
              key={template?._id}
              className="group relative bg-white border hover:shadow-lg transition-shadow duration-300 w-44 h-full"
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              onContextMenu={(e) => handleRightClick(e, template.id)}>
              {template.thumbnail && (
                <div className="overflow-hidden rounded-md">
                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL}/${
                      template.thumbnail
                    }`}
                    alt={`${template.name} Thumbnail`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        onOptionClick={handleContextMenuOption}
      />
    </div>
  );
};

export default TemplatePage;
