import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, Bell, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface HeaderTitleMap {
  [key: string]: string;
}



function BasicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

      const sidebar = document.getElementById("sidebar");
      const target = event.target as Element;

      if (
        sidebarOpen &&
        sidebar &&
        !sidebar.contains(target) &&
        !target.closest("#sidebarToggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("dropdownMenu");
      const target = event.target as Node;

      if (dropdown && !dropdown.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleCreateDesign = () => {
    navigate("/editor");
  };

  const handleLogout = () => {
    // You can clear tokens or localStorage here
    // Example: localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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

              <div className="flex items-center space-x-4 ml-auto">
                <button
                  onClick={handleCreateDesign}
                  className="md:hidden bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors shadow-sm flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center focus:outline-none"
                  >
                    <span className="text-xs font-medium text-blue-600">JD</span>
                  </button>

                  {dropdownOpen && (
                    <div
                      id="dropdownMenu"
                      className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-30"
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
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
