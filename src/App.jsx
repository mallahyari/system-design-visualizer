import React, { useState, useEffect, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import UploadZone from './components/UploadZone';
import SystemDiagram from './components/SystemDiagram';
import InfoPanel from './components/InfoPanel';
import MermaidDisplay from './components/MermaidDisplay';
import { generateMermaidFromImage, convertMermaidToFlow } from './services/analysisService';
import { ArrowLeft, Layout, ArrowRight, Code, Image as ImageIcon, Activity, ArrowDown } from 'lucide-react';

function App() {
  const [graphData, setGraphData] = useState(null);
  const [mermaidCode, setMermaidCode] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const interactiveSectionRef = useRef(null);

  const handleUpload = async (file) => {
    console.log("App: handleUpload called with file:", file);

    // Create a local URL for the uploaded image to display it
    const objectUrl = URL.createObjectURL(file);
    setUploadedImageUrl(objectUrl);

    setIsAnalyzing(true);
    try {
      console.log("App: calling generateMermaidFromImage...");
      const code = await generateMermaidFromImage(file);
      console.log("App: generateMermaidFromImage returned:", code);
      setMermaidCode(code);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConvertToInteractive = async () => {
    if (!mermaidCode) return;
    setIsConverting(true);
    try {
      console.log("App: calling convertMermaidToFlow...");
      const data = await convertMermaidToFlow(mermaidCode);
      console.log("App: convertMermaidToFlow returned:", data);
      setGraphData(data);

      // Scroll to interactive section after a short delay to allow render
      setTimeout(() => {
        interactiveSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setGraphData(null);
    setMermaidCode(null);
    setUploadedImageUrl(null);
    setSelectedNode(null);
  };

  // Clean up object URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (uploadedImageUrl) {
        URL.revokeObjectURL(uploadedImageUrl);
      }
    };
  }, [uploadedImageUrl]);

  const showDashboard = uploadedImageUrl || mermaidCode || graphData;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
              System Design Visualizer
            </h1>
          </div>

          {showDashboard && (
            <button
              onClick={handleReset}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/20"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Upload New Design
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {!showDashboard ? (
          <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                Bring your architecture to life
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
                Upload a system design image and let our AI convert it into an interactive,
                explorable diagram with detailed component information.
              </p>
            </div>
            <UploadZone onUpload={handleUpload} isAnalyzing={isAnalyzing} />
          </div>
        ) : (
          <div className="flex flex-col p-6 gap-6 max-w-[1920px] mx-auto">

            {/* Row 1: Source Materials */}
            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">

              {/* Top Left: Original Image (35%) */}
              <div className="lg:w-[35%] flex flex-col rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 bg-slate-900/50 flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Original Design</h3>
                </div>
                <div className="flex-1 p-6 overflow-auto flex items-center justify-center bg-black/20">
                  {uploadedImageUrl ? (
                    <img
                      src={uploadedImageUrl}
                      alt="Original System Design"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50 border border-white/10"
                    />
                  ) : (
                    <div className="text-slate-500 text-sm">No image loaded</div>
                  )}
                </div>
              </div>

              {/* Top Right: Mermaid Diagram (65%) */}
              <div className="lg:w-[65%] flex flex-col rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Code className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mermaid Definition</h3>
                  </div>
                  {mermaidCode && !graphData && (
                    <button
                      onClick={handleConvertToInteractive}
                      disabled={isConverting}
                      className="group flex items-center gap-2 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConverting ? 'Converting...' : 'Convert to Interactive'}
                      <ArrowDown className="w-3 h-3 transition-transform group-hover:translate-y-0.5" />
                    </button>
                  )}
                </div>
                <div className="flex-1 p-4 overflow-hidden bg-slate-950 relative">
                  {mermaidCode ? (
                    <MermaidDisplay chart={mermaidCode} />
                  ) : isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 animate-pulse">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Generating Mermaid diagram...</span>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 text-sm">
                      Waiting for analysis...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Interactive Diagram (Full Width) */}
            <div ref={interactiveSectionRef} className="h-[800px] flex flex-col rounded-xl border border-white/5 bg-slate-900/30 backdrop-blur-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interactive Visualization</h3>
                </div>
              </div>

              <div className="flex-1 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 bg-slate-950">
                {graphData ? (
                  <>
                    <ReactFlowProvider>
                      <SystemDiagram
                        initialNodes={graphData.nodes}
                        initialEdges={graphData.edges}
                        onNodeClick={setSelectedNode}
                      />
                    </ReactFlowProvider>
                    <InfoPanel
                      node={selectedNode}
                      onClose={() => setSelectedNode(null)}
                    />
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                    {mermaidCode ? (
                      <div className="max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-16 h-16 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 shadow-xl">
                          <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-200">Ready to Visualize</h3>
                        <p className="text-slate-400">
                          Review the Mermaid diagram above. When you're ready, click "Convert to Interactive" to generate the explorable graph.
                        </p>
                        <button
                          onClick={handleConvertToInteractive}
                          disabled={isConverting}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50"
                        >
                          {isConverting ? 'Converting...' : 'Convert to Interactive'}
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 opacity-50">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <p>Upload an image to start the analysis.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
