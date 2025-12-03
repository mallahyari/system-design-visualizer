// Theme definitions using CSS custom properties
// Each theme defines color tokens that map to Tailwind-style naming

export const themes = {
  dark: {
    name: "dark",
    label: "Dark",
    colors: {
      // Background colors
      "--bg-primary": "#020617", // slate-950
      "--bg-secondary": "#0f172a", // slate-900
      "--bg-tertiary": "#1e293b", // slate-800
      "--bg-elevated": "rgba(15, 23, 42, 0.7)", // slate-900/70
      "--bg-overlay": "rgba(0, 0, 0, 0.2)",

      // Text colors
      "--text-primary": "#f8fafc", // slate-50
      "--text-secondary": "#94a3b8", // slate-400
      "--text-tertiary": "#64748b", // slate-500
      "--text-muted": "#475569", // slate-600

      // Border colors
      "--border-primary": "rgba(255, 255, 255, 0.1)",
      "--border-secondary": "rgba(255, 255, 255, 0.05)",
      "--border-hover": "rgba(255, 255, 255, 0.2)",

      // Interactive elements
      "--interactive-bg": "#1e293b", // slate-800
      "--interactive-hover": "#334155", // slate-700
      "--interactive-active": "#475569", // slate-600

      // Accent colors (these stay consistent across themes)
      "--accent-blue": "#3b82f6",
      "--accent-blue-hover": "#2563eb",
      "--accent-blue-glow": "rgba(59, 130, 246, 0.2)",
      "--accent-emerald": "#10b981",
      "--accent-purple": "#a855f7",
      "--accent-orange": "#f97316",
      "--accent-yellow": "#eab308",

      // Shadows
      "--shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.3)",
      "--shadow-md": "0 4px 6px rgba(0, 0, 0, 0.3)",
      "--shadow-lg": "0 10px 15px rgba(0, 0, 0, 0.3)",
      "--shadow-xl": "0 20px 25px rgba(0, 0, 0, 0.4)",

      // Component-specific
      "--node-bg": "#111827", // gray-900
      "--node-border": "#374151", // gray-700
      "--node-border-hover": "#4b5563", // gray-600
      "--panel-bg": "rgba(17, 24, 39, 0.95)",

      // Mermaid theme
      "--mermaid-theme": "dark",
    },
  },

  light: {
    name: "light",
    label: "Light",
    colors: {
      // Background colors
      "--bg-primary": "#ffffff",
      "--bg-secondary": "#f8fafc", // slate-50
      "--bg-tertiary": "#f1f5f9", // slate-100
      "--bg-elevated": "rgba(248, 250, 252, 0.9)",
      "--bg-overlay": "rgba(255, 255, 255, 0.5)",

      // Text colors
      "--text-primary": "#0f172a", // slate-900
      "--text-secondary": "#475569", // slate-600
      "--text-tertiary": "#64748b", // slate-500
      "--text-muted": "#94a3b8", // slate-400

      // Border colors
      "--border-primary": "rgba(0, 0, 0, 0.1)",
      "--border-secondary": "rgba(0, 0, 0, 0.05)",
      "--border-hover": "rgba(0, 0, 0, 0.15)",

      // Interactive elements
      "--interactive-bg": "#f1f5f9", // slate-100
      "--interactive-hover": "#e2e8f0", // slate-200
      "--interactive-active": "#cbd5e1", // slate-300

      // Accent colors
      "--accent-blue": "#2563eb",
      "--accent-blue-hover": "#1d4ed8",
      "--accent-blue-glow": "rgba(37, 99, 235, 0.15)",
      "--accent-emerald": "#059669",
      "--accent-purple": "#9333ea",
      "--accent-orange": "#ea580c",
      "--accent-yellow": "#ca8a04",

      // Shadows
      "--shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.05)",
      "--shadow-md": "0 4px 6px rgba(0, 0, 0, 0.07)",
      "--shadow-lg": "0 10px 15px rgba(0, 0, 0, 0.1)",
      "--shadow-xl": "0 20px 25px rgba(0, 0, 0, 0.15)",

      // Component-specific
      "--node-bg": "#ffffff",
      "--node-border": "#e2e8f0", // slate-200
      "--node-border-hover": "#cbd5e1", // slate-300
      "--panel-bg": "rgba(255, 255, 255, 0.95)",

      // Mermaid theme
      "--mermaid-theme": "default",
    },
  },
};

export const getTheme = (themeName) => themes[themeName] || themes.dark;

export const applyTheme = (theme) => {
  const root = document.documentElement;
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Set data-theme attribute for potential CSS selectors
  root.setAttribute("data-theme", theme.name);
};
