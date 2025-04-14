import { FolderOpen, RefreshCw, Search } from "lucide-react";
import { useState } from "react";

export default function NoDataFoundPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* Illustration */}
      <div className="mb-8 relative">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-blue-50 rounded-full flex items-center justify-center">
          <FolderOpen className="w-16 h-16 md:w-20 md:h-20 text-blue-300" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">No Data Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        We couldn't find any data matching your current criteria. Try adjusting your filters or create a new item.
      </p>

    </div>
  );
}