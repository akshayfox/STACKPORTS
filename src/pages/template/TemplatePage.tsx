import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import {
  Edit,
  Copy,
  Trash,
  Share,
  LucideIcon,
  Plus,
} from "lucide-react";
import axios from "axios";
import { ContextMenuState, Template } from "@/types/editor";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DataEntryModal from "@/components/modal/DataEntryModal";
import { useEditorStore } from "@/store/editorStore";

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

const deleteTemplate = async (templateId: string) => {
  const response = await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/designs/${templateId}`
  );
  return response.data;
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  visible,
  onOptionClick,
}) => {
  if (!visible) return null;

  const menuItems: MenuItem[] = [
    { icon: Edit, label: "Edit" },
    { icon: Copy, label: "Duplicate" },
    { icon: Share, label: "Share" },
    { icon: Plus, label: "Create" },
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
  const navigate = useNavigate();
  const {
    activeTemplate,
    setActiveTemplate,
  } = useEditorStore();

  console.log(activeTemplate, "activeTemplate");

  const queryClient = useQueryClient();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    visible: false,
    template: null,
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDataEntry, setshowDataEntry] = useState(false);

  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery<Template[]>({
    queryKey: ["designs"],
    queryFn: fetchDesigns,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] });
    },
  });

  const handleRightClick = (event: React.MouseEvent, template: Template) => {
    setActiveTemplate(template);
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
      template,
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
    if (!contextMenu.template) {
      return; // Exit if template is null
    }

    switch (action) {
      case "edit":
        navigate(`/editor/${contextMenu.template?._id}`);
        break;
      case "duplicate":
        break;
      case "share":
        break;
      case "create":
        console.log("working");
        setshowDataEntry(true);
        break;
      case "delete":
        setShowDeleteDialog(true);
        break;

      default:
        break;
    }
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const handleDeleteConfirm = async () => {
    if (contextMenu.template && contextMenu.template._id) {
      await deleteMutation.mutateAsync(contextMenu.template._id);
    }
    setShowDeleteDialog(false);
  };

  if (isLoading) return <div>Loading designs...</div>;
  if (isError) return <div>Error loading designs. Please try again later.</div>;
  if (!templates) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-7">
          {templates.map((template: Template) => (
            <Card
              key={template?._id}
              className="group relative bg-white border hover:shadow-lg transition-shadow duration-300 w-44 h-full"
              // onMouseEnter={() => setHoveredId(template.id)}
              // onMouseLeave={() => setHoveredId(null)}
              onContextMenu={(e) => handleRightClick(e, template)}>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataEntryModal
        open={showDataEntry}
        setOpen={setshowDataEntry}
        template={activeTemplate}
      />
    </div>
  );
};

export default TemplatePage;
