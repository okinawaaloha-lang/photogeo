import React from 'react';
import { MapPin, Info, Compass, CheckCircle2, Globe2 } from 'lucide-react';
import { LocationData } from '../types';

interface ResultCardProps {
  data: LocationData;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const mapUrl = data.coordinates 
    ? `https://www.google.com/maps/search/?api=1&query=${data.coordinates.latitude},${data.coordinates.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.placeName} ${data.city} ${data.country}`)}`;

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
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <MapPin size={18} />
              Googleマップで開く
            </a>

            {data.coordinates && (
              <div className="mt-6 pt-6 border-t border-gray-200">
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
        </div>
      </div>
    </div>
  );
};