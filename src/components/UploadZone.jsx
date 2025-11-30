import React, { useCallback } from 'react';
import { Upload, FileUp, Loader2 } from 'lucide-react';

const UploadZone = ({ onUpload, isAnalyzing }) => {
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            console.log("UploadZone: File dropped", e.dataTransfer.files[0]);
            onUpload(e.dataTransfer.files[0]);
        }
    }, [onUpload]);

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
            className="w-full max-w-2xl mx-auto mt-10 p-12 border-2 border-dashed border-gray-600 rounded-xl bg-gray-800/50 hover:bg-gray-800 hover:border-blue-500 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload').click()}
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
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    <p className="text-xl font-medium text-gray-300">Analyzing System Architecture...</p>
                    <p className="text-sm text-gray-500">Identifying components and relationships</p>
                </>
            ) : (
                <>
                    <div className="p-4 rounded-full bg-gray-700 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                        <FileUp className="w-12 h-12 text-gray-400 group-hover:text-blue-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-medium text-white mb-2">
                            Drop your system design here
                        </p>
                        <p className="text-sm text-gray-400">
                            or click to browse (JPG, PNG)
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default UploadZone;
