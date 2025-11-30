import React from 'react';
import { X, Info, Code2, Activity } from 'lucide-react';

const InfoPanel = ({ node, onClose }) => {
    if (!node) return null;

    return (
        <div className="absolute right-4 top-4 bottom-4 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out z-50 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Component Details
                </h2>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                <div className="mb-6">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">Name</label>
                    <h3 className="text-2xl font-bold text-white mb-1">{node.data.label}</h3>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {node.type.replace('Node', '')}
                    </span>
                </div>

                <div className="mb-6">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 block flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Description
                    </label>
                    <p className="text-gray-300 leading-relaxed text-sm">
                        {node.data.description}
                    </p>
                </div>

                <div>
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 block flex items-center gap-2">
                        <Code2 className="w-4 h-4" /> Technologies
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {node.data.tech.split(',').map((tech, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
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
