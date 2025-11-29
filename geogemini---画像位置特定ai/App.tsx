import React, { useState } from 'react';
import { Map, ScanSearch, Sparkles } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { analyzeImageLocation } from './services/geminiService';
import { AnalysisState } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    error: null,
  });

  const handleImageSelect = async (base64: string, mimeType: string) => {
    setAnalysis({ isLoading: true, data: null, error: null });

    try {
      const result = await analyzeImageLocation(base64, mimeType);
      setAnalysis({
        isLoading: false,
        data: result,
        error: null,
      });
    } catch (error: any) {
      setAnalysis({
        isLoading: false,
        data: null,
        error: error.message || '予期せぬエラーが発生しました。',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg text-white">
              <ScanSearch size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              GeoGemini
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:flex items-center gap-1">
            提供技術: <span className="text-slate-800">Google Gemini 2.5</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            その写真、<br className="sm:hidden"/>どこで撮りましたか？
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            AIが画像を視覚的に分析し、撮影場所を特定します。<br/>
            ランドマーク、風景、街並みから世界中の場所を見つけ出しましょう。
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-8">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-green-100 text-green-600 rounded-full"><Sparkles size={14} /></span>
              <span>高精度AI解析</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 bg-blue-100 text-blue-600 rounded-full"><Map size={14} /></span>
              <span>位置情報特定</span>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <ImageUploader 
          onImageSelect={handleImageSelect} 
          isLoading={analysis.isLoading} 
        />

        {/* Results Section */}
        <div className="mt-12 transition-all duration-500">
          {analysis.error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-center gap-3 animate-pulse">
               <span className="font-semibold">エラー:</span> {analysis.error}
            </div>
          )}

          {analysis.data && !analysis.isLoading && (
            <ResultCard data={analysis.data} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm py-8 border-t border-slate-200 mt-auto">
        <p>&copy; {new Date().getFullYear()} GeoGemini. AIによる推測のため、情報は必ずしも正確ではありません。</p>
      </footer>
    </div>
  );
};

export default App;