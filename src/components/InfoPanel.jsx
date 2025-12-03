import { Activity, Code2, Info, X } from "lucide-react";

const InfoPanel = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div
      className="absolute right-4 top-4 bottom-4 w-80 backdrop-blur-md rounded-xl transform transition-all duration-300 ease-in-out z-50 overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--panel-bg)",
        border: "1px solid var(--border-primary)",
        boxShadow: "var(--shadow-xl)",
      }}
    >
      <div
        className="p-4 flex justify-between items-center"
        style={{
          borderBottom: "1px solid var(--border-primary)",
          backgroundColor: "var(--bg-tertiary)",
        }}
      >
        <h2
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: "var(--text-primary)" }}
        >
          <Info className="w-5 h-5" style={{ color: "var(--accent-blue)" }} />
          Component Details
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--interactive-hover)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <label
            className="text-xs uppercase tracking-wider font-semibold mb-1 block"
            style={{ color: "var(--text-muted)" }}
          >
            Name
          </label>
          <h3
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {node.data.label}
          </h3>
          <span
            className="inline-block px-2 py-1 rounded text-xs font-medium"
            style={{
              backgroundColor: "var(--interactive-bg)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            {node.type.replace("Node", "")}
          </span>
        </div>

        <div className="mb-6">
          <label
            className="text-xs uppercase tracking-wider font-semibold mb-2 block flex items-center gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <Activity className="w-4 h-4" /> Description
          </label>
          <p
            className="leading-relaxed text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {node.data.description}
          </p>
        </div>

        <div>
          <label
            className="text-xs uppercase tracking-wider font-semibold mb-2 block flex items-center gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <Code2 className="w-4 h-4" /> Technologies
          </label>
          <div className="flex flex-wrap gap-2">
            {node.data.tech.split(",").map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: "var(--accent-blue-glow)",
                  color: "var(--accent-blue)",
                  border: "1px solid var(--accent-blue)",
                }}
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
