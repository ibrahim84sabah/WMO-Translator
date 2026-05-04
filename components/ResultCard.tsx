import React from 'react';
import { WeatherTranslation } from '../types';
import { CloudRain, ExternalLink, Info, CheckCircle2, Languages, Hash, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ResultCardProps {
  data: WeatherTranslation | null;
  loading: boolean;
  error: string | null;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 bg-white rounded-2xl border border-slate-200 animate-pulse flex flex-col items-center justify-center min-h-[200px] shadow-sm">
        <div className="w-12 h-12 border-4 border-imos-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500">Consulting WMO tables & Gemini...</p>
      </div>
    );
  }

  if (error) {
    const isKeyError = error.toLowerCase().includes("api key") || error.includes("400") || error.includes("403");

    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-red-50 rounded-2xl border border-red-200 text-red-900 text-center shadow-lg">
        <div className="flex flex-col items-center gap-2 mb-2">
          {isKeyError ? <ShieldAlert className="text-red-600" size={32} /> : <AlertTriangle className="text-red-600" size={32} />}
          <p className="font-bold text-lg text-red-700">Analysis Failed</p>
        </div>
        <div className="opacity-90 max-w-md mx-auto break-words text-sm font-mono bg-white p-3 rounded border border-red-100 mt-2 mb-4">
          {error}
        </div>
        
        {isKeyError && (
          <div className="text-left text-xs text-red-800 bg-red-100/50 p-4 rounded-lg border border-red-200/50">
            <p className="font-bold text-red-900 mb-2 border-b border-red-200/50 pb-1">Troubleshooting "API Key Invalid":</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Check your Google AI Studio project settings.</li>
              <li>Verify that the Gemini API is enabled for your project.</li>
              <li>Ensure the GEMINI_API_KEY environment variable is correctly set.</li>
            </ol>
          </div>
        )}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-black/5 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center gap-3">
        <div className="p-3 bg-imos-green/10 rounded-lg text-imos-green border border-imos-green/20">
          <CloudRain size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-none mb-1">Translation Result</h2>
          <p className="text-sm text-slate-500">Based on WMO 49-2 Standards</p>
        </div>
        {data.groundingUrls.length > 0 && (
           <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-imos-blue/10 border border-imos-blue/20 rounded-full text-imos-blue text-xs font-medium">
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
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">WMO Code (Alpha)</label>
            <div className="text-4xl font-mono font-bold text-imos-green tracking-tight">
              {data.code}
            </div>
          </div>
          
          {data.wmoCodeNumber && data.wmoCodeNumber !== 'N/A' && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Hash size={12} />
                <span>Synoptic Code</span>
              </label>
              <div className="text-xl font-mono text-imos-blue">
                {data.wmoCodeNumber}
              </div>
            </div>
          )}
        </div>

        {/* Name Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Condition Name</label>
          <div className="flex flex-col">
            <div className="text-2xl font-semibold text-slate-900 leading-tight">
              {data.name}
            </div>
            {data.nameAr && (
              <div className="text-xl text-imos-green font-medium mt-1" style={{ fontFamily: 'Cairo, sans-serif' }} dir="rtl">
                {data.nameAr}
              </div>
            )}
          </div>
        </div>

        {/* Description Section - Full Width */}
        <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
          {/* English Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500">
              <Info size={16} />
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Technical Description (EN)</label>
            </div>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              {data.description}
            </p>
          </div>

          {/* Arabic Description */}
          {data.descriptionAr && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-500 justify-end">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">الوصف التقني (AR)</label>
                <Languages size={16} />
              </div>
              <p 
                className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 text-right"
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
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase">Sources & References</p>
          <ul className="space-y-1">
            {data.groundingUrls.map((url, idx) => (
              <li key={idx}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-imos-blue hover:text-imos-green transition-colors truncate max-w-full"
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
