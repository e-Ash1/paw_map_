import React from 'react';

const CategoryTabs = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="flex space-x-2 p-2 bg-white rounded-lg shadow-sm">
        {categories.map(cat => (
            <button
            key={cat.value}
            onClick={() => onSelect(cat.value)}
            className={`px-4 py-2 rounded-full font-medium transition 
                focus:outline-none focus:ring-2 focus:ring-green-300
                ${
                selectedCategory === cat.value
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
            {cat.label}
            </button>
        ))}
    </div>

  );
};

export default CategoryTabs;
