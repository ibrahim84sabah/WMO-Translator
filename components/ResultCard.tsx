import React from 'react';
import { WeatherTranslation } from '../types';
import { CloudRain, ExternalLink, Info, CheckCircle2, Languages, Hash } from 'lucide-react';

interface ResultCardProps {
  data: WeatherTranslation | null;
  loading: boolean;
  error: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 bg-white rounded-2xl border border-slate-200 animate-pulse flex flex-col items-center justify-center min-h-[200px] shadow-sm">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500">Consulting WMO tables & Gemini...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-red-50 rounded-2xl border border-red-200 text-red-700 text-center">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
          <CloudRain size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Translation Result</h2>
          <p className="text-sm text-slate-500">Based on WMO 49-2 Standards</p>
        </div>
        {data.groundingUrls.length > 0 && (
           <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-green-100 border border-green-200 rounded-full text-green-700 text-xs font-medium">
             <CheckCircle2 size={12} />
             <span>Verified with Search</span>
           </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 grid gap-6 md:grid-cols-2">
        {/* Code Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WMO Code (Alpha)</label>
            <div className="text-4xl font-mono font-bold text-blue-600 tracking-tight">
              {data.code}
            </div>
          </div>
          
          {data.wmoCodeNumber && data.wmoCodeNumber !== 'N/A' && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Hash size={12} />
                <span>Synoptic Code</span>
              </label>
              <div className="text-xl font-mono text-slate-700">
                {data.wmoCodeNumber}
              </div>
            </div>
          )}
        </div>

        {/* Name Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Condition Name</label>
          <div className="flex flex-col">
            <div className="text-2xl font-semibold text-slate-900 leading-tight">
              {data.name}
            </div>
            {data.nameAr && (
              <div className="text-xl text-blue-600 font-medium mt-1" style={{ fontFamily: 'Cairo, sans-serif' }} dir="rtl">
                {data.nameAr}
              </div>
            )}
          </div>
        </div>

        {/* Description Section - Full Width */}
        <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
          {/* English Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Info size={16} />
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Technical Description (EN)</label>
            </div>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {data.description}
            </p>
          </div>

          {/* Arabic Description */}
          {data.descriptionAr && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 justify-end">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Technical Description (AR)</label>
                <Languages size={16} />
              </div>
              <p 
                className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 text-right"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                dir="rtl"
              >
                {data.descriptionAr}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sources Footer */}
      {data.groundingUrls.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500 mb-2 font-medium uppercase">Sources & References</p>
          <ul className="space-y-1">
            {data.groundingUrls.map((url, idx) => (
              <li key={idx}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors truncate max-w-full"
                >
                  <ExternalLink size={10} />
                  <span className="truncate">{url}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};