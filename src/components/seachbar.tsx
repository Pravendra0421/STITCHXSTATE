import React, { useState, useRef, useEffect } from 'react';
import { CiSearch } from "react-icons/ci"; // Importing the search icon from react-icons

const SearchInput: React.FC = () => {
  // State to manage the visibility of the search input field
  const [showInput, setShowInput] = useState(false);

  // Ref to directly access the input element for focusing
  const inputRef = useRef<HTMLInputElement>(null);

  // Ref to the container of the search bar to detect clicks outside
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Function to handle clicking the search icon
  const handleIconClick = () => {
    setShowInput(true); // Show the input field
  };

  // Effect to focus the input field when it becomes visible
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus(); // Focus the input field
    }
  }, [showInput]); // Re-run this effect when showInput changes

  // Effect to handle clicks outside the search container to hide the input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the click is outside the search container, hide the input
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowInput(false);
      }
    };

    // Add event listener when the input is shown
    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener when the component unmounts or input is hidden
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]); // Re-run this effect when showInput changes

  return (
    <div ref={searchContainerRef} className="relative flex items-center justify-center p-4">
      {/* Search Icon - Always visible, triggers input visibility on click */}
      {!showInput && (
        <button
          onClick={handleIconClick}
          className="p-3 text-black rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out"
          aria-label="Open search input"
        >
          <CiSearch className="text-xl" />
        </button>
      )}

      {/* Search Input Field - Conditionally rendered based on showInput state */}
      {showInput && (
        <div className="relative w-full max-w-md flex items-center">
          <input
            ref={inputRef} // Assign ref to the input element
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 transition-all duration-300 ease-in-out text-lg"
            // Optional: Add value and onChange for controlled component if you need to handle input value
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Search icon inside the input for visual clarity */}
          <div className="absolute left-3 text-gray-400">
            <CiSearch className="text-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
