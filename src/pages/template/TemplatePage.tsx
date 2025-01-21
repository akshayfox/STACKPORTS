// import  { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Heart,
//   Eye,
//   ChevronDown,
//   Search,
//   SlidersHorizontal,
// } from "lucide-react";

// const templates = [
//   {
//     id: 1,
//     name: "Untitled Design",
//     elements: [
//       {
//         id: "_Gwug_KZ1tnAF6me9fPoi",
//         type: "text",
//         content: "Double click to edit",
//         style: {
//           x: 42,
//           y: 60,
//           width: 200,
//           height: 50,
//           rotation: 0,
//           fontSize: 16,
//           shapeType: "text",
//           color: "#000000",
//           backgroundColor: "transparent",
//           _id: {
//             $oid: "678f1fa1314aa83fda943665",
//           },
//         },
//       },
//     ],
//     canvasSize: {
//       width: 235,
//       height: 400,
//       _id: {
//         $oid: "678f1fa1314aa83fda943666",
//       },
//     },
//   },
// ];

// function TemplatePage() {
//   const [hoveredId, setHoveredId] = useState<number | null>(null);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-8">
//               <h1 className="text-xl font-bold">Template Gallery</h1>
//               <div className="hidden md:flex items-center gap-4">
//                 <Button variant="ghost" className="text-sm">
//                   Categories <ChevronDown className="ml-1 w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" className="text-sm">
//                   Complexity <ChevronDown className="ml-1 w-4 h-4" />
//                 </Button>
//                 <Button variant="ghost" className="text-sm">
//                   Sort By <ChevronDown className="ml-1 w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="relative hidden md:block">
//                 <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search templates..."
//                   className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <Button variant="outline" size="icon">
//                 <SlidersHorizontal className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {templates.map((template) => (
//             <Card
//               key={template.id}
//               className="group relative bg-white border hover:shadow-lg transition-shadow duration-300"
//               onMouseEnter={() => setHoveredId(template.id)}
//               onMouseLeave={() => setHoveredId(null)}>
//               {/* Quick Action Buttons */}
//               <div
//                 className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${
//                   hoveredId === template.id ? "opacity-100" : "opacity-0"
//                 }`}>
//                 <Button size="icon" variant="secondary" className="w-8 h-8">
//                   <Heart className="w-4 h-4" />
//                 </Button>
//                 <Button size="icon" variant="secondary" className="w-8 h-8">
//                   <Eye className="w-4 h-4" />
//                 </Button>
//               </div>

//               {/* <Canvas /> */}
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TemplatePage;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Eye,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import axios from "axios";

// Function to fetch designs
const fetchDesigns = async () => {
  const response = await axios.get("http://localhost:3001/api/designs"); // Update with your actual API endpoint
  return response.data.designs;
};

function TemplatePage() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["designs"],
    queryFn: fetchDesigns,
  });

  console.log(templates, "templates");

  if (isLoading) {
    return <div>Loading designs...</div>;
  }

  if (isError) {
    return <div>Error loading designs. Please try again later.</div>;
  }

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  lg:grid-cols-4  gap-1">
    {templates.map((template: any) => (
      <Card
        key={template.id}
        className="group relative bg-white border hover:shadow-lg transition-shadow duration-300 w-44 h-full"
        onMouseEnter={() => setHoveredId(template.id)}
        onMouseLeave={() => setHoveredId(null)}>
        {template.thumbnail && (
          <div className=" overflow-hidden rounded-md">
            <img
              src={`http://localhost:3001/${template.thumbnail}`}
              alt={`${template.name} Thumbnail`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </Card>
    ))}
  </div>
</div>

    </div>
  );
}

export default TemplatePage;
