import React, { useState } from 'react';
import { model } from '@/api/geminiConfig.js'; 
import { Button } from "@/components/ui/Button.jsx";
import { Sparkles, RotateCcw } from 'lucide-react';
import { toast } from "sonner";
import ImageUploader from '@/components/nutrition/ImageUploader.jsx';
import LoadingAnimation from '@/components/nutrition/LoadingAnimation.jsx';
import ResultCard from '@/components/nutrition/ResultCard.jsx';

export default function Home() {
  const [images, setImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // 轉換圖片為 Base64
  const fileToGenerativePart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({
        inlineData: { data: reader.result.split(',')[1], mimeType: file.type }
      });
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    // 偵錯第一步：確認函式有沒有被觸發
    console.log("Button Clicked: Start Analysis"); 
    
    if (images.length === 0) {
      toast.error("請上傳食品照片");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      console.log("Step 1: Processing images...");
      const imageParts = await Promise.all(
        images.map(img => fileToGenerativePart(img.file))
      );

      console.log("Step 2: Calling Gemini API...");
      const prompt = `你是營養小精靈，請分析圖片並回傳 JSON。`;

      // 偵錯第二步：確認 model 是否存在
      if (!model) throw new Error("Gemini Model is not initialized. Check your config.");

      const aiResult = await model.generateContent([prompt, ...imageParts]);
      const response = await aiResult.response;
      const text = response.text();
      
      console.log("Step 3: AI Raw Response:", text);

      const cleanJson = text.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(cleanJson));
      toast.success("分析成功！🧚");

    } catch (error) {
      // 這是最重要的除錯資訊
      console.error('CRITICAL ERROR:', error); 
      toast.error(`分析出錯: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    // 全平台 RWD 容器：電腦版背景淡灰色，手機版滿版
    <div className="min-h-screen bg-slate-100 sm:py-10 flex justify-center items-start">
      
      {/* 主要容器：電腦版限制寬度並置中，手機版 w-full */}
      <div className="w-full max-w-2xl bg-white min-h-screen sm:min-h-0 sm:rounded-3xl sm:shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Header - 針對電腦版增加高度感 */}
        <header className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-12 text-white text-center shadow-inner">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-5xl drop-shadow-md">🧚</span>
            <h1 className="text-3xl font-black tracking-tighter">營養小精靈</h1>
          </div>
          <p className="text-emerald-50 font-medium opacity-90">專為數位游牧者設計的健康顧問</p>
        </header>

        {/* 內容區 - 電腦版增加內距 (p-10), 手機版維持 (p-6) */}
        <main className="p-6 sm:p-10 space-y-8 flex-1">
          {!result ? (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              
              {/* 上傳區：在電腦版會自動撐開 */}
              <div className="bg-white rounded-2xl">
                <ImageUploader
                  images={images}
                  setImages={setImages}
                  disabled={isAnalyzing}
                />
              </div>

              {isAnalyzing && (
                <div className="flex flex-col items-center py-12">
                  <LoadingAnimation />
                  <p className="text-emerald-600 font-bold mt-6 animate-pulse text-lg">正在讀取營養標示...</p>
                </div>
              )}

              {!isAnalyzing && images.length > 0 && (
                <Button
                  onClick={handleAnalyze}
                  className="w-full h-20 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-2xl font-black shadow-xl hover:shadow-emerald-200 transition-all active:scale-95"
                >
                  <Sparkles className="w-7 h-7 mr-3" />
                  開始分析
                </Button>
              )}

              {/* 指南區：電腦版雙欄顯示，手機版單欄 */}
              {!isAnalyzing && images.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-emerald-800 font-bold text-sm">📸 拍照要領</p>
                    <p className="text-emerald-700/70 text-xs mt-1">光線充足、對焦清晰、正對文字</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <p className="text-teal-800 font-bold text-sm">🥗 分析重點</p>
                    <p className="text-teal-700/70 text-xs mt-1">熱量、添加物、升糖指數評估</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-8 duration-500">
              {/* 結果顯示：在電腦版會更寬敞 */}
              <ResultCard result={result} />
              
              <Button
                onClick={() => { setImages([]); setResult(null); }}
                variant="outline"
                className="w-full mt-8 border-slate-200 text-slate-400 py-6 rounded-2xl font-bold hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                重新開始
              </Button>
            </div>
          )}
        </main>

        <footer className="py-8 text-center border-t border-slate-50">
          <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.2em]">
            Nutrition Elf • Built for Global Citizens
          </p>
        </footer>
      </div>
    </div>
  );
}