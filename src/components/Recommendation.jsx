import React from 'react';
import { Star, Info, Utensils } from 'lucide-react';

export default function Recommendation({ data }) {
  return (
    <div id="capture-rec" className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 shadow-lg relative overflow-hidden">
      {/* 裝飾用的小精靈光芒 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/50 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center mb-6">
        <div className="inline-block bg-white p-3 rounded-2xl shadow-sm mb-2">
          <Star className="text-amber-400 fill-amber-400" />
        </div>
        <h2 className="text-xl font-black text-emerald-900">精靈的悄悄話</h2>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
            <Utensils size={18} />
            適合誰吃？
          </div>
          <p className="text-slate-600 text-sm">{data.advice?.target || "正在分析中..."}</p>
        </div>

        <div className="bg-amber-100/50 p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-700 font-bold mb-1">
            <Info size={18} />
            小小提醒
          </div>
          <p className="text-slate-600 text-sm">{data.advice?.warning || "暫無特別建議"}</p>
        </div>

        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-md mt-6">
          <p className="text-xs opacity-80 mb-1">精靈建議食法：</p>
          <p className="font-bold">{data.advice?.action || "請參考包裝說明"}</p>
        </div>
      </div>
    </div>
  );
}