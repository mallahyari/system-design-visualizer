import { FileUp, Loader2 } from "lucide-react";
import { useCallback } from "react";

const UploadZone = ({ onUpload, isAnalyzing }) => {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        console.log("UploadZone: File dropped", e.dataTransfer.files[0]);
        onUpload(e.dataTransfer.files[0]);
      }
    },
    [onUpload]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e) => {
    console.log("UploadZone: File input changed", e.target.files);
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      e.target.value = null;
    }
  };

  return (
    <div
      className="w-full max-w-2xl mx-auto mt-10 p-12 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group hover:border-[var(--accent-blue)]"
      style={{
        borderColor: "var(--border-primary)",
        backgroundColor: "var(--bg-secondary)",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById("file-upload").click()}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        disabled={isAnalyzing}
      />

      {isAnalyzing ? (
        <>
          <Loader2
            className="w-16 h-16 animate-spin"
            style={{ color: "var(--accent-blue)" }}
          />
          <p
            className="text-xl font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Analyzing System Architecture...
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Identifying components and relationships
          </p>
        </>
      ) : (
        <>
          <div
            className="p-4 rounded-full transition-colors group-hover:bg-[var(--accent-blue-glow)]"
            style={{ backgroundColor: "var(--interactive-bg)" }}
          >
            <FileUp
              className="w-12 h-12 group-hover:text-[var(--accent-blue)]"
              style={{ color: "var(--text-secondary)" }}
            />
          </div>
          <div className="text-center">
            <p
              className="text-xl font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Drop your system design here
            </p>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              or click to browse (JPG, PNG)
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadZone;
