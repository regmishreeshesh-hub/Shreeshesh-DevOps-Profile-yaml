import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { themeType, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative group"
      aria-label="Toggle theme"
    >
      <div className="relative p-3 rounded-2xl bg-gradient-to-br from-orange-400/20 to-purple-400/20 dark:from-orange-400/10 dark:to-purple-400/10 backdrop-blur-sm border border-orange-300/30 dark:border-purple-300/20 hover:border-orange-400/50 dark:hover:border-purple-400/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/20 dark:hover:shadow-purple-500/20">
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
        
        {/* Icon container */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Sun icon for light mode */}
          <svg
            className={`absolute w-6 h-6 transition-all duration-500 ${
              themeType === 'light' 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-50 rotate-180'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="5" 
              className="fill-orange-400 stroke-orange-400"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="stroke-orange-300"
              d="M12 1v2m0 16v2m8.66-9.66l-1.42 1.42M6.76 6.76L5.34 5.34m14.32 14.32l-1.42-1.42M6.76 17.24l-1.42 1.42M23 12h-2M3 12H1"
            />
            {/* Animated rays */}
            <g className={`origin-center ${themeType === 'light' ? 'animate-spin' : ''}`} style={{ animationDuration: '20s' }}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                className="stroke-orange-300 opacity-60"
                d="M12 2l1 3m-1 14l1 3m7-7l3 1m-14 1l-3 1"
              />
            </g>
          </svg>

          {/* Moon icon for dark mode */}
          <svg
            className={`absolute w-6 h-6 transition-all duration-500 ${
              themeType === 'dark' 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-50 -rotate-180'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="stroke-purple-400 fill-purple-400/20"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
            {/* Stars around moon */}
            <g className={`origin-center ${themeType === 'dark' ? 'animate-pulse' : ''}`} style={{ animationDuration: '3s' }}>
              <circle cx="16" cy="8" r="1" className="fill-purple-300" />
              <circle cx="8" cy="10" r="0.5" className="fill-purple-300" />
              <circle cx="18" cy="12" r="0.5" className="fill-purple-300" />
              <circle cx="6" cy="14" r="1" className="fill-purple-300" />
            </g>
          </svg>
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {themeType === 'light' ? 'Switch to Dark' : 'Switch to Light'}
      </div>
    </button>
  );
};

export default ThemeToggle;
