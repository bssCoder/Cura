// components/ThemeToggle.js
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="py-1 px-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white transition"
      title="Toggle Theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
