import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Bell, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface HeaderTitleMap {
  [key: string]: string;
}

const headerTitles: HeaderTitleMap = {
  "/dashboard": "Dashboard",
  "/clients": "Client Management",
  "/groups": "Group Organization",
  "/templates": "Templates Library",
  "/settings": "System Settings",
  "/help": "Help & Support",
  "/editor": "Design Editor",
};

function BasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return;
      
      const sidebar = document.getElementById('sidebar');
      const target = event.target as Element;
      
      if (sidebarOpen && 
          sidebar && 
          !sidebar.contains(target) && 
          !target.closest('#sidebarToggle')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);



  
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleCreateDesign = () => {
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden" />
      )}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCreateDesign={handleCreateDesign}
      />
      <div className="flex-1 md:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Mobile Menu Button */}
              <button
                id="sidebarToggle"
                className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex-1 text-lg font-medium text-gray-800 ml-3 md:ml-0">
                {headerTitles[location.pathname] || ""}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreateDesign}
                  className="md:hidden bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors shadow-sm flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </button>

                <button className="p-1 rounded-full hover:bg-gray-100 relative">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
                </button>

                <div className="md:hidden">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">JD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default BasicLayout;