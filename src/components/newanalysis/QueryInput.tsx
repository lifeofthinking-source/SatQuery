import React, { useRef } from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';

interface QueryInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const EXAMPLE_QUESTIONS = [
  { short: 'What changed here?', full: 'What land use and land cover changes occurred across this region between the two acquisition dates?' },
  { short: 'Where did urban growth occur?', full: 'Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?' },
  { short: 'Has vegetation decreased?', full: 'Has dense canopy vegetation decreased in the observed area, and is crown degradation detected?' },
  { short: 'Where has new construction appeared?', full: 'Has new construction appeared in this area, where did it occur, and what is the spatial extent of the change?' },
  { short: 'Does SAR support the detected change?', full: 'Does Sentinel-1 C-SAR backscatter increase corroborate the optical built-up candidate polygons or indicate bare soil clearing?' },
];

export const QueryInput: React.FC<QueryInputProps> = ({ value, onChange, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExampleClick = (full: string) => {
    onChange(full);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="space-y-3">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={6}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Ask a question about this satellite imagery…"
          aria-label="Analysis question"
          className="w-full px-4 py-3 text-sm border border-slate-300 rounded bg-white text-slate-900 placeholder-slate-400
            resize-none leading-relaxed
            focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        />
        <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-mono select-none">
          {value.length} chars
        </div>
      </div>

      {/* Default query hint */}
      {!value && (
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded px-3 py-2">
          <MessageSquare className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
          <p className="text-[11px] text-blue-800">
            <strong>Example:</strong> "Has the built-up area increased between these two dates, where did the change occur, and does the available SAR evidence support it?"
          </p>
        </div>
      )}

      {/* Example questions */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Try an Example
        </p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_QUESTIONS.map(q => (
            <button
              key={q.short}
              type="button"
              onClick={() => handleExampleClick(q.full)}
              disabled={disabled}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded border text-[11px] font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed
                ${value === q.full
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-900 hover:bg-blue-50'
                }`}
            >
              <ChevronRight className="w-3 h-3 opacity-60" />
              {q.short}
            </button>
          ))}
        </div>
      </div>

      {/* Responsibility box */}
      <div className="border border-slate-200 rounded bg-slate-50">
        <div className="grid grid-cols-2 divide-x divide-slate-200">
          {/* User provides */}
          <div className="px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              You Provide
            </p>
            <ul className="space-y-1">
              {['Imagery', 'Question'].map(item => (
                <li key={item} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* SatQuery handles */}
          <div className="px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              SatQuery Handles
            </p>
            <ul className="space-y-1">
              {['Evidence planning', 'Model selection', 'GIS operations', 'Verification'].map(item => (
                <li key={item} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 px-3 py-1.5">
          <p className="text-[10px] text-slate-400 italic">
            Model and tool selection is handled automatically by SatQuery's evidence-adaptive orchestration.
          </p>
        </div>
      </div>
    </div>
  );
};
