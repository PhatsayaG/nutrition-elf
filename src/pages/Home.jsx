import React, { useState } from 'react';
import { model } from '@/api/geminiConfig.js';
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from 'lucide-react';
import { toast } from "sonner"; // 2. 引入通知組件
import ImageUploader from '@/components/nutrition/ImageUploader';
import LoadingAnimation from '@/components/nutrition/LoadingAnimation';
import ResultCard from '@/components/nutrition/ResultCard';

export default function Home() {
  const [images, setImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // 3. 輔助函式：將圖片檔案轉換為 Gemini API 格式
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
    if (images.length === 0) {
      toast.error("請先上傳圖片");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      // 4. 準備圖片數據 (取代 Base44 的 UploadFile)
      const imageParts = await Promise.all(
        images.map(img => fileToGenerativePart(img.file))
      );

      // 5. 調用您自己的 Gemini 模型 (保留原本精美的 Prompt)
      const prompt = `你是「營養小精靈」，一位風格幽默但專業的營養師。
請分析這些食品營養標示圖片，並提供以下資訊：

任務：
1. 辨識營養成分（熱量、脂肪、碳水化合物、糖、鈉等）
2. 識別食品添加物
3. 綜合判斷食品屬性（優質營養 vs. 熱量陷阱）

風格要求：
- 用通俗易懂的白話文
- 帶點幽默感，但不說教
- 針對一般大眾能秒懂的資訊

請直接輸出 JSON，不要有任何其他文字或 markdown 格式。`;

      const aiResult = await model.generateContent([prompt, ...imageParts]);
      const response = await aiResult.response;
      const text = response.text();
      
      // 6. 清理並解析 JSON 數據
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const parsedResult = JSON.parse(cleanJson);
      
      setResult(parsedResult);
      toast.success("小精靈辨識成功！");

      // 7. 移除原本的 AnalysisRecord.create (因為這是 Base44 的資料庫功能)
      // 若您未來需要存檔，可以改寫為串接您的 Firebase 或本地 LocalStorage

    } catch (error) {
      console.error('分析失敗:', error);
      toast.error("辨識過程出錯，請檢查 API Key 或圖片清晰度");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-lg mx-auto min-h-screen md:min-h-0 md:py-8">
        <div className="bg-white md:rounded-3xl md:shadow-xl min-h-screen md:min-h-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🧚</span>
              <h1 className="text-2xl font-bold">營養小精靈</h1>
            </div>
            <p className="text-emerald-100 text-sm">拍一拍，秒懂食品真相</p>
          </div>

          {/* 內容區 */}
          <div className="p-6 space-y-6">
            {!result ? (
              <>
                <ImageUploader
                  images={images}
                  setImages={setImages}
                  disabled={isAnalyzing}
                />

                {isAnalyzing && <LoadingAnimation />}

                {!isAnalyzing && images.length > 0 && (
                  <Button
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6 rounded-2xl text-lg font-semibold shadow-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    開始分析
                  </Button>
                )}

                {!isAnalyzing && images.length === 0 && (
                  <div className="bg-emerald-50 rounded-2xl p-4 space-y-2">
                    <h3 className="font-semibold text-emerald-700">📸 使用小提示</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 拍攝包裝正面可辨識產品名稱</li>
                      <li>• 拍攝營養標示表可獲得完整分析</li>
                      <li>• 成分表可幫助識別添加物</li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <ResultCard result={result} />
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50 py-4 rounded-2xl"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  分析其他食品
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}