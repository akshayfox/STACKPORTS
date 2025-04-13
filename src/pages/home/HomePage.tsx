import { Palette, Wand2, Users, Sparkles, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations

function HomePage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/editor", { state: { width: 235, height: 400 } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 text-center">
          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
          >
            Design Anything{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Beautiful
            </span>
            <br />
            in Minutes
          </motion.h1>

          {/* Animated Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Create stunning designs effortlessly with our intuitive design tool.
            Perfect for social media, presentations, and marketing materials.
          </motion.p>

          {/* Buttons with Hover Effects */}
          <div className="flex justify-center flex-wrap gap-4">
            <motion.button
              onClick={handleCreate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center"
            >
              Create a Design
              <ChevronRight className="ml-2 h-5 w-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              Watch Demo
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/templates"
                className="inline-block bg-gray-100 text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                Browse Templates
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Optional: Add a Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Palette className="h-8 w-8 text-indigo-600" />,
              title: "Customizable",
              desc: "Tailor every design to your unique style.",
            },
            {
              icon: <Wand2 className="h-8 w-8 text-indigo-600" />,
              title: "Intuitive Tools",
              desc: "Easy-to-use tools for all skill levels.",
            },
            {
              icon: <Sparkles className="h-8 w-8 text-indigo-600" />,
              title: "Stunning Templates",
              desc: "Start with professional designs.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              {feature.icon}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;