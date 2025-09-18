"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function ClickableCircle() {
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -translate-y-20 space-y-8">
      {/* Container for circle and arrow */}
      <div className="relative flex items-center justify-center">
        {/* Arrow pointing at circle */}
        <div className="absolute right-full mr-2 flex items-center animate-float">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-300 whitespace-nowrap">
            Click me!
          </div>
          <svg 
            className={`w-8 h-8 text-gray-700 dark:text-gray-300 transition-all duration-500 ${isHovered ? 'scale-110' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        
        {/* Clickable Circle with custom scaled-down animation */}
        <div
          className={`flex items-center justify-center w-50 h-50 md:w-66 md:h-66 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
            isClicked ? 'animate-subtle-ping' : ''
          }`}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--nav-text)'
          }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Plus size={120} className="transition-transform duration-300 hover:rotate-90" />
        </div>
      </div>

      {/* Message Bar */}
      <div className="w-full max-w-xs mx-4">
        <div 
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-center shadow-md"
          style={{ borderColor: 'var(--accent)' }}
        >
          <p 
            className="text-blue-800 dark:text-blue-200 font-mono text-lg font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            Enter code here...
          </p>
        </div>
      </div>
    </div>
  );
}