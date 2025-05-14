import React from "react";

const Navbar = ({ onSearch, onMap, onClear }) => (
  <nav className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex items-center px-8 z-50">
    {/* Left: App title as a link back home */}
    <div className="flex-shrink-0">
      <a
        href="/"
        className="text-2xl font-bold text-green-600 hover:underline"
      >
        PawMap
      </a>
    </div>

    {/* Right: Nav links */}
    <div className="ml-auto flex space-x-8">
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onSearch(); }}
        className="text-gray-700 hover:text-green-600 transition-colors"
      >
        Search
      </a>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onMap(); }}
        className="text-gray-700 hover:text-green-600 transition-colors"
      >
        Map
      </a>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); onClear(); }}
        className="text-gray-700 hover:text-green-600 transition-colors"
      >
        Clear
      </a>
    </div>
  </nav>
);

export default Navbar;
