import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search skills..." }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative max-w-md mx-auto mb-8">
      <div className={`
        relative group transition-all duration-300
        ${isFocused ? 'scale-[1.02]' : 'scale-100'}
      `}>
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40 group-focus-within:text-orange-400 transition-colors">
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-12 py-3 rounded-xl
            bg-gray-100 dark:bg-white/5
            border border-gray-200 dark:border-white/10
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-white/40
            focus:outline-none focus:ring-2 focus:ring-orange-400/50
            focus:border-orange-400/50
            transition-all duration-300
            font-mono-code text-sm
          `}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}

        {/* Subtle glow effect on focus */}
        <div className={`
          absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/10 to-blue-400/10
          opacity-0 group-focus-within:opacity-100 transition-opacity duration-300
          pointer-events-none
        `} />
      </div>

      {/* Search Results Count */}
      {query && (
        <div className="mt-2 text-xs text-gray-500 dark:text-white/40 font-mono-code text-center">
          Searching for: <span className="text-orange-400 font-bold">"{query}"</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
