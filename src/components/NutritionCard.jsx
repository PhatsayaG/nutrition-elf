import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function NutritionCard({ data }) {
  // 防護機制：確保資料存在，如果不存在就給預設值
  const translations = Array.isArray(data?.translations) ? data.translations : [];
  const highlights = Array.isArray(data?.highlights) ? data.highlights : [];

  return (
    <div id="capture-card" className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-emerald-100">
      <div className="bg-emerald-600 p-6 text-white text-center">
        <h2 className="text-xl font-bold">{data?.productName || "分析產品"}</h2>
      </div>
      
      <div className="p-6 space-y-6">
        <div className={`flex items-center gap-3 p-4 rounded-2xl ${data?.verdict?.color === 'green' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
          <span className="font-bold text-lg">{data?.verdict?.title || "正在評估中"}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {highlights.map((item, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500">{item?.label}</p>
              <p className="text-lg font-bold text-slate-800">{item?.value}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold text-emerald-800 mb-2">💡 成分白話文</h3>
          <div className="space-y-2">
            {translations.length > 0 ? translations.map((item, idx) => (
              <div key={idx} className="text-sm border-l-2 border-emerald-200 pl-3 py-1">
                <span className="font-medium text-slate-700">{item?.origin}</span>
                <p className="text-gray-500 text-xs">{item?.explain}</p>
              </div>
            )) : <p className="text-xs text-gray-400">目前無成分分析資料</p>}
          </div>
        </div>
      </div>
    </div>
  );
}