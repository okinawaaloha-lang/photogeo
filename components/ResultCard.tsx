import React from 'react';
import { MapPin, Info, Compass, CheckCircle2, Globe2, ShoppingBag, ExternalLink } from 'lucide-react';
import { LocationData } from '../types';

interface ResultCardProps {
  data: LocationData;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const mapUrl = data.coordinates 
    ? `https://www.google.com/maps/search/?api=1&query=${data.coordinates.latitude},${data.coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.placeName} ${data.city} ${data.country}`)}`;

  // Amazon Affiliate Link Construction
  const associateTag = 'simplemind0f-22';
  const amazonUrl = `https://www.amazon.co.jp/s?k=${encodeURIComponent(data.recommendation.keywords)}&tag=${associateTag}`;

  const getConfidenceColor = (conf: string) => {
    switch (conf) {
      case '高': return 'bg-green-100 text-green-700 border-green-200';
      case '中': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case '低': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="inline-block" /> {data.placeName}
            </h2>
            <p className="text-blue-100 text-lg flex items-center gap-2">
              <Globe2 size={18} /> {data.city}, {data.country}
            </p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getConfidenceColor(data.confidence)} shadow-sm backdrop-blur-md bg-opacity-90`}>
             確信度: {data.confidence}
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Description */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-3 flex items-center gap-2">
              <Info className="text-blue-500" size={20} />
              場所の概要
            </h3>
            <p className="text-gray-600 leading-relaxed text-justify">
              {data.description}
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-3 flex items-center gap-2">
              <Compass className="text-indigo-500" size={20} />
              特定の手がかり
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">アクション</h4>
            
            <a 
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-2"
            >
              <MapPin size={18} />
              Googleマップで開く
            </a>

            {data.coordinates && (
              <div className="mt-4 mb-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">座標データ</p>
                <div className="font-mono text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                  <div className="flex justify-between">
                    <span>緯度:</span>
                    <span>{data.coordinates.latitude.toFixed(5)}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>経度:</span>
                    <span>{data.coordinates.longitude.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Amazon Recommendation */}
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <ShoppingBag size={80} className="text-orange-500" />
            </div>
            
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2 relative z-10">
              <ShoppingBag size={18} />
              おすすめアイテム
            </h4>
            
            <div className="relative z-10">
              <p className="font-bold text-gray-800 mb-1">
                {data.recommendation.title}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {data.recommendation.reason}
              </p>
              
              <a 
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#FF8C00] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Amazonで見る <ExternalLink size={14} />
              </a>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Amazonアソシエイト・プログラムを利用しています
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};