import { Check, Copy, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const MermaidDisplay = ({ chart }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [copied, setCopied] = useState(false);
  const { themeName } = useTheme();

  // Re-initialize mermaid when theme changes
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: themeName === "dark" ? "dark" : "default",
      securityLevel: "loose",
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
      },
    });
  }, [themeName]);

  useEffect(() => {
    if (containerRef.current && chart) {
      mermaid.render(`mermaid-${Date.now()}`, chart).then(({ svg }) => {
        containerRef.current.innerHTML = svg;
      });
    }
  }, [chart, themeName]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const handleReset = () => setScale(1);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className="w-full h-full relative rounded-lg overflow-hidden flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Toolbar */}
      <div
        className="absolute top-4 right-4 z-10 flex items-center gap-2 backdrop-blur-sm p-1.5 rounded-lg"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded transition-colors"
          style={{ color: "var(--text-secondary)" }}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span
          className="text-xs font-mono w-8 text-center"
          style={{ color: "var(--text-muted)" }}
        >
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded transition-colors"
          style={{ color: "var(--text-secondary)" }}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div
          className="w-px h-4 mx-1"
          style={{ backgroundColor: "var(--border-primary)" }}
        />
        <button
          onClick={handleReset}
          className="p-1.5 rounded transition-colors"
          style={{ color: "var(--text-secondary)" }}
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div
          className="w-px h-4 mx-1"
          style={{ backgroundColor: "var(--border-primary)" }}
        />
        <button
          onClick={handleCopy}
          className="p-1.5 rounded transition-colors"
          style={{
            color: copied ? "var(--accent-emerald)" : "var(--text-secondary)",
          }}
          title="Copy Mermaid Code"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Diagram Container */}
      <div className="flex-1 overflow-auto p-4 flex">
        <div
          className="m-auto transition-transform duration-200 origin-center"
          style={{ transform: `scale(${scale})` }}
        >
          <div ref={containerRef} />
        </div>
      </div>
    </div>
  );
};

export default MermaidDisplay;
