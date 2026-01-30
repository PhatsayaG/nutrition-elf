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
      // --- 新增：自動縮圖邏輯 ---
      const compressImage = async (base64Str) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = base64Str;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200; // 縮小到寬度 1200px 即可，AI 看得清楚
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // 壓縮品質設為 0.7
          };
        });
      };

      // 對所有上傳的圖片進行壓縮
      const compressedImages = await Promise.all(images.map(img => compressImage(img)));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: compressedImages }), // 傳送縮小的圖片
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      console.error("錯誤細節:", err);
      alert(`分析失敗：${err.message || "伺服器超載"}`);
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