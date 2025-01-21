import { Palette, Wand2, Users, Sparkles, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/editor", { state: { width: 235, height: 400 } });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-indigo-600" />
              <span className="font-bold text-xl">DesignPro</span>
            </div>
            <nav className="hidden md:flex space-x-8">
  <Link to="/templates" className="text-gray-600 hover:text-gray-900">
    Templates
  </Link>
  <Link to="/features" className="text-gray-600 hover:text-gray-900">
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

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Design Anything <span className="text-indigo-600">Beautiful</span>
            <br />
            in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create stunning designs effortlessly with our intuitive design tool.
            Perfect for social media, presentations, and marketing materials.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 flex items-center">
              Create a Design
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border border-gray-300 hover:bg-gray-50">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-2xl p-4 inline-block mb-4">
                <Wand2 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Design</h3>
              <p className="text-gray-600">
                Let our AI help you create stunning designs in seconds with
                smart suggestions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-2xl p-4 inline-block mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Work together with your team in real-time on any design project
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-2xl p-4 inline-block mb-4">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Million+ Assets</h3>
              <p className="text-gray-600">
                Access our vast library of templates, photos, and design
                elements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
