import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg transition-all duration-300 
        bg-[var(--interactive-bg)] hover:bg-[var(--interactive-hover)]
        border border-[var(--border-primary)] hover:border-[var(--border-hover)]
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
