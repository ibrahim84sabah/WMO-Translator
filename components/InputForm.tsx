import React, { useState } from 'react';
import { Search, ArrowRightLeft } from 'lucide-react';

interface InputFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-32 py-4 bg-white text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all shadow-lg shadow-slate-200/50 text-lg"
          placeholder="e.g., +TSRA or Heavy Rain"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
          >
            {isLoading ? 'Decoding...' : 'Translate'}
            {!isLoading && <ArrowRightLeft size={16} />}
          </button>
        </div>
      </form>
      <div className="mt-3 flex gap-2 justify-center text-xs text-slate-500">
        <span className="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">Try: <strong>FG</strong> (Fog)</span>
        <span className="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">Try: <strong>+SHSN</strong> (Heavy Snow Showers)</span>
        <span className="px-2 py-1 bg-white rounded border border-slate-200 shadow-sm">Try: <strong>Volcanic Ash</strong></span>
      </div>
    </div>
  );
};