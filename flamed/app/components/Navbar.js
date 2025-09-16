"use client";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full">
      <div className="flex justify-between items-center py-4 px-4">
        <h1 className="text-xl font-bold text-white">Logo</h1>
        <button
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul
          className={`flex-col absolute left-0 top-16 w-full md:bg-transparent md:static md:flex md:flex-row md:space-x-4 md:w-auto transition-all duration-200 ease-in ${open ? "flex" : "hidden"} md:flex`}
          style={{ background: "var(--nav-footer-bg)" }}
        >
          <li><a href="#" className="block px-4 py-2 text-white hover:bg-white/20 transition-colors">Home</a></li>
          <li><a href="/preferences" className="block px-4 py-2 text-white hover:bg-white/20 transition-colors">Preferences</a></li>
          <li><a href="#" className="block px-4 py-2 text-white hover:bg-white/20 transition-colors">Contact</a></li>
          <li className="px-4 py-2"><DarkModeToggle /></li>
        </ul>
      </div>
    </nav>
  );
}