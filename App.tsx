import React, { useState } from 'react';
import { Plane, BookOpen, Github } from 'lucide-react';
import { translateWeather } from './services/gemini';
import { WeatherTranslation, HistoryItem } from './types';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { BackgroundLogo } from './components/BackgroundLogo';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherTranslation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const translation = await translateWeather(query);
      setResult(translation);
      
      // Add to history
      setHistory(prev => {
        const newItem: HistoryItem = { ...translation, id: Date.now().toString(), timestamp: Date.now() };
        return [newItem, ...prev].slice(0, 5); // Keep last 5
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 selection:bg-imos-green/20 relative">
      {/* Background decoration with Logo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-imos-green/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-imos-blue/10 rounded-full blur-[120px]"></div>
        
        {/* Central Logo Watermark */}
        <div className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] absolute opacity-[0.05] transform scale-125">
          <BackgroundLogo />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        
        {/* Header */}
        <header className="relative text-center mb-12 space-y-4">
          <div className="inline-flex flex-col items-center justify-center gap-4 mb-4">
            <div className="p-0 bg-transparent shadow-2xl overflow-hidden rounded-full ring-12 ring-emerald-500/5">
              <img 
                src="https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/ar/b/bb/Logo_of_the_Iraq_Meteorological_Organization_and_Seismology.png" 
                alt="Iraq Meteorological Organization Logo" 
                className="w-44 h-44 md:w-64 md:h-64 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('logo.png')) {
                    target.src = '/logo.png';
                  } else {
                    target.src = 'https://www.agromet.gov.iq/images/logo.png';
                  }
                }}
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            WMO Weather <span className="text-imos-green">Decoder</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-slate-600 leading-relaxed">
            Met Service Professional Tool for translating aviation weather codes (METAR/TAF).
            Developed for the Iraq Meteorological Organization & Seismology.
          </p>
        </header>

        {/* Main Interface */}
        <main className="space-y-8">
          <InputForm onSearch={handleSearch} isLoading={loading} />
          
          <ResultCard data={result} loading={loading} error={error} />
        </main>

        {/* History Section */}
        {history.length > 0 && (
          <section className="max-w-2xl mx-auto mt-16">
            <div className="flex items-center gap-2 mb-4 text-slate-500 px-2">
              <BookOpen size={18} />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Recent Lookups</h3>
            </div>
            <div className="grid gap-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleHistoryClick(item)}
                  className="w-full text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-imos-green/50 rounded-xl p-4 transition-all group flex items-center justify-between shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-imos-blue font-bold bg-slate-50 px-2 py-1 rounded self-start border border-slate-200">
                      {item.code}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-medium group-hover:text-imos-green transition-colors">
                        {item.name}
                      </span>
                      {item.nameAr && (
                        <span className="text-sm text-slate-500 font-medium mt-0.5" style={{ fontFamily: 'Cairo, sans-serif' }} dir="rtl">
                          {item.nameAr}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 group-hover:text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Iraq Meteorological Organization & Seismology (IMOS)</p>
          <p className="mt-1 opacity-70">WMO-No. 306, Code table 4678 & WMO 49-2 Compliant</p>
          <div className="mt-4 flex justify-center gap-4 items-center">
            <a href="https://codes.wmo.int/49-2/_AerodromePresentOrForecastWeather" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">
              WMO Reference
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;