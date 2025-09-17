"use client";
import { useState, useEffect } from "react";
import { Home, User, MessageSquare, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is preferred system setting
    const isDarkPreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkPreferred);
    document.documentElement.classList.toggle('dark', isDarkPreferred);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-lg" : "py-4"
      }`}
      style={{ 
        background: "var(--nav-bg)",
        boxShadow: isScrolled ? "0 4px 20px var(--nav-shadow)" : "none"
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold transition-all duration-300 hover:scale-105 cursor-pointer flex items-center"
            style={{ color: "var(--nav-text)" }}>
          <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          BrandName
        </h1>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-2">
            <li>
              <a 
                href="#" 
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group"
                style={{ 
                  color: "var(--nav-text)",
                  background: "var(--nav-item-bg)"
                }}
                onMouseEnter={(e) => e.target.style.background = "var(--nav-item-hover)"}
                onMouseLeave={(e) => e.target.style.background = "var(--nav-item-bg)"}
              >
                <Home size={18} className="group-hover:scale-110 transition-transform" />
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group"
                style={{ 
                  color: "var(--nav-text)",
                  background: "var(--nav-item-bg)"
                }}
                onMouseEnter={(e) => e.target.style.background = "var(--nav-item-hover)"}
                onMouseLeave={(e) => e.target.style.background = "var(--nav-item-bg)"}
              >
                <User size={18} className="group-hover:scale-110 transition-transform" />
                Profile
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 group"
                style={{ 
                  color: "var(--nav-text)",
                  background: "var(--nav-item-bg)"
                }}
                onMouseEnter={(e) => e.target.style.background = "var(--nav-item-hover)"}
                onMouseLeave={(e) => e.target.style.background = "var(--nav-item-bg)"}
              >
                <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                Chats
              </a>
            </li>
            <li className="pl-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full transition-all duration-200 flex items-center justify-center group"
                style={{ 
                  background: "var(--nav-item-bg)",
                  color: "var(--nav-text)"
                }}
                onMouseEnter={(e) => e.target.style.background = "var(--nav-item-hover)"}
                onMouseLeave={(e) => e.target.style.background = "var(--nav-item-bg)"}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={20} className="group-hover:rotate-12 transition-transform" />
                ) : (
                  <Moon size={20} className="group-hover:rotate-12 transition-transform" />
                )}
              </button>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative w-8 h-8 focus:outline-none flex items-center justify-center transition-transform hover:scale-110"
            style={{ color: "var(--nav-text)" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ background: "var(--nav-bg)" }}
      >
        <ul className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {['Home', 'Profile', 'Chats'].map((item, index) => (
            <li key={item}>
              <a 
                href="#" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group"
                style={{ 
                  color: "var(--nav-text)",
                  background: "var(--nav-item-bg)"
                }}
                onMouseEnter={(e) => e.target.style.background = "var(--nav-item-hover)"}
                onMouseLeave={(e) => e.target.style.background = "var(--nav-item-bg)"}
                onClick={() => setOpen(false)}
              >
                {index === 0 && <Home size={20} className="group-hover:scale-110 transition-transform" />}
                {index === 1 && <User size={20} className="group-hover:scale-110 transition-transform" />}
                {index === 2 && <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />}
                {item}
              </a>
            </li>
          ))}
          <li className="px-4 py-3 flex justify-center">
            <button
              onClick={() => {
                toggleDarkMode();
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 group"
              style={{ 
                background: "var(--nav-item-bg)",
                color: "var(--nav-text)"
              }}
              onMouseEnter={(e) => e.target.style.background = "var(--nav-item-hover)"}
              onMouseLeave={(e) => e.target.style.background = "var(--nav-item-bg)"}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <>
                  <Sun size={18} className="group-hover:rotate-12 transition-transform" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="group-hover:rotate-12 transition-transform" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}