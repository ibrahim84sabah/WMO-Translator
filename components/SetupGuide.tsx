import React from 'react';
import { X, Key, Server, ShieldCheck, ExternalLink, Copy } from 'lucide-react';

interface SetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="text-yellow-400" size={24} />
            Setup Guide: API Key
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 text-slate-300">
          
          {/* Step 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-sm">1</span>
              <h3>Generate Key</h3>
            </div>
            <div className="ml-11 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <p className="mb-3 text-sm">You need a free API key from Google AI Studio.</p>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Create API Key <ExternalLink size={14} />
              </a>
            </div>
          </section>

          {/* Step 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-sm">2</span>
              <h3>Add to Vercel</h3>
            </div>
            <div className="ml-11 space-y-3">
              <p className="text-sm">Go to your Vercel Project Settings &gt; <strong>Environment Variables</strong>.</p>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Key:</span>
                  <span className="text-green-400 font-bold select-all">VITE_API_KEY</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2">
                  <span className="text-slate-500">Value:</span>
                  <span className="text-blue-300 truncate max-w-[200px]">AIzaSyB...</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">Note: You may need to redeploy for changes to take effect.</p>
            </div>
          </section>

          {/* Step 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-white font-semibold">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-sm">3</span>
              <h3>Fix "Invalid Key" Errors</h3>
            </div>
            <div className="ml-11 bg-red-950/20 p-4 rounded-xl border border-red-900/30">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-red-400 shrink-0 mt-1" size={20} />
                <div className="space-y-2 text-sm">
                  <p>
                    If you see <strong>Error 400 (API Key Invalid)</strong>, Google is blocking the request because it comes from Vercel.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-400 hover:underline">Google Cloud Console</a>.</li>
                    <li>Edit your API Key.</li>
                    <li>Under <strong>Application restrictions</strong>, select <strong>Websites (HTTP referrers)</strong>.</li>
                    <li>Add your Vercel domain: <code className="bg-black/30 px-1 rounded">https://your-app.vercel.app/*</code></li>
                  </ol>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};