import { Link, useLocation } from "react-router-dom";
import {
  Palette,
  User,
  LayoutDashboard,
  Users,
  Folder,
  Layers,
  X,
  PenTool,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDesign: () => void;
}

interface NavItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  isActive?: boolean;
  badge?: number;
}

const navItems: NavItemProps[] = [
  {
    to: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
  },
  {
    to: "/clients",
    icon: <Users className="h-5 w-5" />,
    label: "Clients",
    badge: 3,
  },
  {
    to: "/groups",
    icon: <Folder className="h-5 w-5" />,
    label: "Groups",
  },
  {
    to: "/templates",
    icon: <Layers className="h-5 w-5" />,
    label: "Templates",
    badge: 2,
  },
];

function Sidebar({ isOpen, onClose, onCreateDesign }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          onClose={onClose}
          onCreateDesign={onCreateDesign}
          isActive={isActive}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white shadow-sm fixed inset-y-0 left-0">
        <SidebarContent
          onClose={onClose}
          onCreateDesign={onCreateDesign}
          isActive={isActive}
        />
      </div>
    </>
  );
}

function SidebarContent({
  onClose,
  onCreateDesign,
  isActive,
}: {
  onClose: () => void;
  onCreateDesign: () => void;
  isActive: (path: string) => boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo and Close Button */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
        <div className="flex items-center">
          <Palette className="h-7 w-7 text-blue-600" />
          <span className="text-gray-800 text-lg font-semibold ml-2">IDMATE</span>
        </div>
        <button
          className="p-1 rounded-full hover:bg-gray-100 md:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Create Design Button */}
      <div className="px-4 py-4">
        <button
          onClick={onCreateDesign}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center py-2 px-4 rounded-md transition-colors shadow-sm"
        >
          <PenTool className="h-4 w-4 mr-2" />
          <span className="font-medium">Create Design</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="px-2 space-y-6">
          {/* Overview Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Overview
            </h3>
            <NavItem {...navItems[0]} isActive={isActive(navItems[0].to)} />
          </div>

          {/* Management Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Management
            </h3>
            {navItems.slice(1).map((item) => (
              <NavItem
                key={item.to}
                {...item}
                isActive={isActive(item.to)}
              />
            ))}
          </div>
        </nav>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">Administrator</p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon, label, isActive = false, badge }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className={`${isActive ? "text-blue-600" : "text-gray-500"} mr-3`}>
        {icon}
      </div>
      <span className="text-sm font-medium flex-1">{label}</span>
      {badge && (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default Sidebar;