import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ isMobile = false }) => {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, we would handle the search query here
    console.log('Search for:', searchQuery);
    setSearchQuery('');
    setIsActive(false);
  };

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-auto'}`}>
      <form onSubmit={handleSubmit} className="flex items-center">
        <button
          type="button"
          className={`p-2 rounded-full transition-colors ${
            isActive 
              ? 'text-gray-800 bg-gray-100' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          onClick={() => setIsActive(!isActive)}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        
        <AnimatePresence>
          {isActive && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? 'auto' : 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              type="text"
              placeholder="Search guides..."
              className="ml-2 pl-2 pr-4 py-1 border-b-2 border-gray-300 focus:border-primary focus:outline-none bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SearchBar;