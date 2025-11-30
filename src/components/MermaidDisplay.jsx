import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check } from 'lucide-react';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
    },
});

const MermaidDisplay = ({ chart }) => {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (containerRef.current && chart) {
            mermaid.render(`mermaid-${Date.now()}`, chart).then(({ svg }) => {
                containerRef.current.innerHTML = svg;
            });
        }
    }, [chart]);

    const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 3));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
    const handleReset = () => setScale(1);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(chart);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="w-full h-full relative bg-slate-950 rounded-lg overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-lg border border-white/10 shadow-xl">
                <button
                    onClick={handleZoomOut}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-500 w-8 text-center">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={handleZoomIn}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                    onClick={handleReset}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Reset Zoom"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button
                    onClick={handleCopy}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title="Copy Mermaid Code"
                >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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
