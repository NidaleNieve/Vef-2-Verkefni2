"use client";
import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      {dark ? "🌙" : "☀️"}
    </button>
  );
}