import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ImageUploader from './components/ImageUploader';
import NutritionCard from './components/NutritionCard';
import Recommendation from './components/Recommendation';
import { Sparkles, Download } from 'lucide-react';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [view, setView] = useState('card');

  const analyzeImages = async () => {
    setLoading(true);
    try {
      // 這裡的 /api/analyze 會自動對應到你寫的那個 api/analyze.js 檔案
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("分析失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    const id = view === 'card' ? 'capture-card' : 'capture-rec';
    const element = document.getElementById(id);
    html2canvas(element, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = `nutrition-elf.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 pb-20">
      <header className="flex items-center gap-2 mb-8 justify-center">
        <div className="bg-emerald-500 p-2 rounded-lg text-white shadow-lg"><Sparkles /></div>
        <h1 className="text-xl font-black text-emerald-800 tracking-tight text-center">NUTRITION ELF</h1>
      </header>

      {!result ? (
        <div className="space-y-6">
          <ImageUploader images={images} setImages={setImages} />
          <button 
            onClick={analyzeImages}
            disabled={images.length === 0 || loading}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl disabled:bg-gray-300"
          >
            {loading ? "小精靈正全速分析中..." : "開始智慧分析"}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex bg-white p-1 rounded-2xl shadow-inner border border-gray-100">
            <button onClick={() => setView('card')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${view === 'card' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400'}`}>數據卡片</button>
            <button onClick={() => setView('elf')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${view === 'elf' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400'}`}>精靈建議</button>
          </div>
          {view === 'card' ? <NutritionCard data={result} /> : <Recommendation data={result} />}
          <div className="flex gap-4">
            <button onClick={() => setResult(null)} className="flex-1 bg-white text-gray-500 py-4 rounded-2xl font-bold border border-gray-200">重新拍照</button>
            <button onClick={downloadImage} className="flex-1 bg-emerald-100 text-emerald-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Download size={18}/> 保存圖片
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;