import { useEditorStore } from "@/store/editorStore";
import { Element } from "@/types/editor";
import { nanoid } from "nanoid";

interface ImageGalleryProps {
  categories: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ categories }) => {
  const { addElement } = useEditorStore();

  // Map of category to image IDs (using Picsum Photos)
  const categoryImageMap: Record<string, [number, number]> = {
    Nature: [1015, 1016],
    Business: [1005, 1006],
    People: [1011, 1012],
    Technology: [1004, 1009],
    Food: [1080, 1081],
    Abstract: [1062, 1069],
    Travel: [1018, 1019]
  };

  const handleImageClick = (imageUrl: string) => {
    const element: Element = {
      id: nanoid(),
      type: "image",
      content: imageUrl,
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
        shapeType: "image",
        backgroundColor: "transparent",
      } 
    };
    addElement(element);
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const [imgId1, imgId2] = categoryImageMap[category] || [1000, 1001];
        
        return (
          <div key={category} className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
            <div className="grid grid-cols-2 gap-2">
              {/* First Image */}
              <div 
                className="group relative aspect-square cursor-pointer"
                onClick={() => 
                  handleImageClick(`https://picsum.photos/id/${imgId1}/600/600`)
                }
              >
                <img
                  src={`https://picsum.photos/id/${imgId1}/300/300`}
                  alt={category}
                  className="w-full h-full object-cover rounded-md group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-md" />
              </div>
              
              {/* Second Image */}
              <div 
                className="group relative aspect-square cursor-pointer"
                onClick={() => 
                  handleImageClick(`https://picsum.photos/id/${imgId2}/600/600`)
                }
              >
                <img
                  src={`https://picsum.photos/id/${imgId2}/300/300`}
                  alt={category}
                  className="w-full h-full object-cover rounded-md group-hover:opacity-90 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-md" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGallery;