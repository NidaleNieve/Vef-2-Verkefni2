"use client";
import { useState, useEffect } from "react";
import { Home, Settings, Contact, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-2 shadow-lg" : "py-4"
      }`}
      style={{ background: "var(--nav-footer-bg)" }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white transition-all duration-300 hover:scale-105 cursor-pointer flex items-center">
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
                className="px-4 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/20 hover:shadow-md flex items-center gap-2"
              >
                <Home size={18} />
                Home
              </a>
            </li>
            <li>
              <a 
                href="/preferences" 
                className="px-4 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/20 hover:shadow-md flex items-center gap-2"
              >
                <Settings size={18} />
                Preferences
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="px-4 py-2 text-white rounded-lg transition-all duration-200 hover:bg-white/20 hover:shadow-md flex items-center gap-2"
              >
                <Contact size={18} />
                Contact
              </a>
            </li>
            <li className="pl-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-white" />}
              </button>
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            className="text-white md:hidden relative w-8 h-8 focus:outline-none flex items-center justify-center"
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
        style={{ background: "var(--nav-footer-bg)" }}
      >
        <ul className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <li>
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-all duration-200 hover:bg-white/20 hover:shadow-md"
              onClick={() => setOpen(false)}
            >
              <Home size={20} />
              Home
            </a>
          </li>
          <li>
            <a 
              href="/preferences" 
              className="flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-all duration-200 hover:bg-white/20 hover:shadow-md"
              onClick={() => setOpen(false)}
            >
              <Settings size={20} />
              Preferences
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-all duration-200 hover:bg-white/20 hover:shadow-md"
              onClick={() => setOpen(false)}
            >
              <Contact size={20} />
              Contact
            </a>
          </li>
          <li className="px-4 py-3 flex justify-center">
            <button
              onClick={() => {
                toggleDarkMode();
                setOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <>
                  <Sun size={18} className="text-white" />
                  <span className="text-white">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} className="text-white" />
                  <span className="text-white">Dark Mode</span>
                </>
              )}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}