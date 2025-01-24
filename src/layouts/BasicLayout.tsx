import { Palette } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

function BasicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-indigo-600" />
              <Link to={'/'}>
              <span className="font-bold text-xl">DesignPro</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/templates"
                className="text-gray-600 hover:text-gray-900">
                Templates
              </Link>
              <Link
                to="/features"
                className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                Sign in
              </button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Sign up free
              </button>
            </div>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default BasicLayout;
