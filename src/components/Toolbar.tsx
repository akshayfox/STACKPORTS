


import React, { useState } from 'react';

const icons = {
  Template: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  Photos: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  ),
  Text: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7V4h16v3" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  ),
  Elements: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Graphics: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    </svg>
  ),
  Music: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Videos: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <path d="M10 8l6 4-6 4V8z" />
    </svg>
  ),
  Uploads: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Folders: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  )
};
type MenuItem = {
  name: string;
  icon: React.ReactNode;
  content?: { type: string; name: string }[];
};

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { name: 'Template', icon: icons.Template },
    { name: 'Photos', icon: icons.Photos },
    { name: 'Text', icon: icons.Text },
    { name: 'Elements', icon: icons.Elements },
    { name: 'Graphics', icon: icons.Graphics },
    { name: 'Music', icon: icons.Music },
    { name: 'Videos', icon: icons.Videos },
    {
      name: 'Uploads',
      icon: icons.Uploads,
      content: [
        { type: 'image', name: 'Presentation.jpg' },
        { type: 'image', name: 'Logo Design.png' },
        { type: 'image', name: 'Banner.jpg' },
        { type: 'image', name: 'Profile Pic.png' },
        { type: 'image', name: 'Background.jpg' },
        { type: 'image', name: 'Icon Set.png' },
      ],
    },
    { name: 'Folders', icon: icons.Folders },
  ];

  const handleItemClick = (itemName: string) => {
    setActiveItem(activeItem === itemName ? null : itemName);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Minimal Sidebar */}
      <div className="w-16 h-full bg-white shadow-sm flex flex-col items-center py-4 z-10 fixed">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative w-12 mb-2"
            onClick={() => handleItemClick(item.name)}
          >
            <div
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200
                ${activeItem === item.name
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'hover:bg-gray-100 text-gray-600'
                }`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Content */}
      {activeItem === 'Uploads' && (
        <div className="w-80 h-full bg-white border-l border-gray-200 shadow-sm p-6 transition-all duration-300 ease-in-out ml-16 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Uploads</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Upload New
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {menuItems.find((item) => item.name === 'Uploads')?.content?.map((file, index) => (
              <div key={index} className="group relative cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
                  <img
                    src="/api/placeholder/200/200"
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <p className="text-sm mt-2 text-gray-600 group-hover:text-gray-900 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export default Sidebar;