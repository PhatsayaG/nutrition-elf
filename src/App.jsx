import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { model } from '@/api/geminiConfig.js';
import { Toaster } from "@/components/ui/sonner.jsx";
import Home from '@/pages/Home.jsx';
import { Button } from "@/components/ui/button.jsx";
import { Sparkles, Download, RotateCcw, LayoutDashboard, MessageSquare } from 'lucide-react';
import ImageUploader from './components/nutrition/ImageUploader';
import LoadingAnimation from './components/nutrition/LoadingAnimation';
import ResultCard from './components/nutrition/ResultCard'; // Base44 的漂亮結果卡片

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [view, setView] = useState('card'); // 保留你的視圖切換邏輯
  const captureRef = useRef(null); // 用於截圖下載的 Ref

  // --- 1. 保留你的自動縮圖邏輯 (優化效能與費用) ---
  const compressImage = async (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; 
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
        resolve(canvas.toDataURL('image/jpeg', 0.7)); 
      };
    });
  };

  // --- 2. 整合 Gemini SDK 辨識邏輯 (符合資安規則) ---
  const handleAnalyze = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setResult(null);

    try {
      // 壓縮圖片並轉換為 API 格式
      const processedImages = await Promise.all(
        images.map(async (img) => {
          const compressed = await compressImage(img.preview);
          return {
            inlineData: {
              data: compressed.split(',')[1],
              mimeType: 'image/jpeg'
            }
          };
        })
      );

      const prompt = `你是「營養小精靈」，一位幽默且專業的營養師。
      請分析圖片中的食品營養標示，並提供以下資訊：
      1. 辨識營養成分 (熱量、脂肪、碳水化合物、糖、鈉等)
      2. 識別食品添加物
      3. 綜合判斷食品屬性 (優質營養 vs. 熱量陷阱)
      請直接以繁體中文輸出 JSON 格式，不要包含 Markdown 標籤。`;

      const aiResult = await model.generateContent([prompt, ...processedImages]);
      const response = await aiResult.response;
      const text = response.text();
      
      const cleanJson = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(cleanJson));
      toast.success("小精靈辨識成功！");
    } catch (err) {
      console.error("辨識失敗:", err);
      toast.error(`分析失敗：${err.message || "API 呼叫出錯"}`);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. 保留你的保存圖片邏輯 ---
  const downloadImage = () => {
    if (!captureRef.current) return;
    html2canvas(captureRef.current, { scale: 2, useCORS: true }).then(canvas => {
      const link = document.createElement('a');
      link.download = `nutrition-report.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success("報告已成功保存！");
    });
  };

  return (
    <div className="max-w-2xl mx-auto min-h-screen p-4 pb-24 font-sans">
      <header className="flex flex-col items-center gap-2 mb-8">
        <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg animate-bounce">
          <Sparkles size={28} />
        </div>
        <h1 className="text-3xl font-black text-emerald-900 tracking-tighter">NUTRITION ELF</h1>
        <p className="text-emerald-600 font-medium">您的 AI 營養辨識專家</p>
      </header>

      {!result ? (
        <div className="space-y-6">
          <ImageUploader images={images} setImages={setImages} />
          <Button 
            onClick={handleAnalyze}
            disabled={images.length === 0 || loading}
            className="w-full h-16 rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-95 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? <LoadingAnimation /> : "開始智慧分析"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* 視圖切換開關 */}
          <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
            <button 
              onClick={() => setView('card')} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${view === 'card' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            >
              <LayoutDashboard size={18} /> 數據卡片
            </button>
            <button 
              onClick={() => setView('elf')} 
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${view === 'elf' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
            >
              <MessageSquare size={18} /> 精靈建議
            </button>
          </div>

          {/* 截圖範圍區域 */}
          <div ref={captureRef} className="bg-white rounded-3xl overflow-hidden">
             <ResultCard data={result} mode={view} />
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => {setResult(null); setImages([]);}} 
              className="flex-1 h-14 rounded-2xl font-bold border-2"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> 重新分析
            </Button>
            <Button 
              onClick={downloadImage} 
              className="flex-1 h-14 rounded-2xl font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            >
              <Download className="mr-2 h-4 w-4" /> 保存圖片
            </Button>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
}

export default App;