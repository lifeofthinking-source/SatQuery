import React, { useRef } from 'react';
import {
  Satellite,
  UploadCloud,
  Database,
  FileImage,
} from 'lucide-react';

interface SatelliteUploadProps {
  /** Called when the user uploads a file */
  onFileUpload: (file: File) => void;
  /** Called when the user clicks "Use Demo Dataset" */
  onLoadDemo: () => void;
  /** Whether the component is in a loading/busy state */
  loading?: boolean;
}

const SUPPORTED_FORMATS = ['GeoTIFF', 'PNG', 'JPG'];
const SUPPORTED_DATA = ['Optical', 'SAR'];

export const SatelliteUpload: React.FC<SatelliteUploadProps> = ({
  onFileUpload,
  onLoadDemo,
  loading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload satellite image – drag and drop or click to select"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className={`relative flex flex-col items-center justify-center gap-3 rounded
          border-2 border-dashed py-10 px-6 cursor-pointer transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
          ${isDragging
            ? 'border-blue-600 bg-blue-50'
            : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40'
          }`}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <Satellite className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-slate-700">Upload Satellite Image</p>
          <p className="text-xs text-slate-500">Drag and drop imagery here or select a file</p>
        </div>

        {/* Format tags */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Formats:</span>
            <div className="flex gap-1">
              {SUPPORTED_FORMATS.map(f => (
                <span
                  key={f}
                  className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-mono"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Data:</span>
            <div className="flex gap-1">
              {SUPPORTED_DATA.map(d => (
                <span
                  key={d}
                  className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-mono"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="absolute inset-0 rounded bg-white/70 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".tif,.tiff,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50
            text-slate-700 text-xs font-semibold rounded transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Upload Image
        </button>

        <button
          type="button"
          onClick={onLoadDemo}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-blue-800 bg-blue-900 hover:bg-blue-800
            text-white text-xs font-semibold rounded transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Database className="w-3.5 h-3.5" />
          Use Demo Dataset
        </button>
      </div>

      <p className="text-[11px] text-slate-400 flex items-center gap-1">
        <FileImage className="w-3 h-3" />
        Maximum file size: 500 MB · GeoTIFF with embedded projection preferred.
      </p>
    </div>
  );
};
