import React, { useRef } from 'react';
import { Button } from "@/components/ui/Button.jsx";
import { Badge } from "@/components/ui/Badge.jsx";
import { Share2, Download, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from "sonner";

const verdictConfig = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badge: 'bg-green-500',
    icon: CheckCircle,
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badge: 'bg-yellow-500',
    icon: Info,
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-500',
    icon: AlertTriangle,
  },
};

// 增加 mode prop 來對接您舊有的「數據卡片」與「精靈建議」切換
export default function ResultCard({ result, mode = 'card' }) {
  const cardRef = useRef(null);
  const config = verdictConfig[result.verdict?.color] || verdictConfig.yellow;
  const VerdictIcon = config.icon;

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 確保截圖清晰度
        useCORS: true,
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], `${result.productName || '營養分析'}.png`, { type: 'image/png' });

      // 優先使用 Web Share API (手機端體驗最好)
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: '營養小精靈分析結果',
          text: `${result.productName} - ${result.verdict?.title}`,
          files: [file],
        });
      } else {
        // 降級為下載 (您原本的功能)
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${result.productName || '營養分析'}.png`;
        link.href = url;
        link.click();
        toast.success("已儲存分析圖片！");
      }
    } catch (err) {
      console.error('分享/下載失敗:', err);
      toast.error("操作失敗，請重試");
    }
  };

  return (
    <div className="space-y-4">
      {/* 可分享的卡片區域 */}
      <div
        ref={cardRef}
        className={`rounded-3xl border-2 ${config.border} ${config.bg} p-5 space-y-4 shadow-sm`}
      >
        {/* Header：產品名稱與評級 (無論什麼模式都顯示) */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">AI 營養分析報告</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{result.productName}</h2>
          </div>
          <Badge className={`${config.badge} text-white px-3 py-1`}>
            <VerdictIcon className="w-3 h-3 mr-1" />
            {result.verdict?.color === 'green' ? '健康' : result.verdict?.color === 'red' ? '注意' : '普通'}
          </Badge>
        </div>

        {/* 真相揭露：幽默短評 (核心視覺) */}
        <div className={`p-4 rounded-2xl bg-white/80 border ${config.border} shadow-inner`}>
          <p className={`text-lg font-bold ${config.text} text-center italic`}>
            「{result.verdict?.title}」
          </p>
        </div>

        {/* 模式切換內容：數據卡片模式 */}
        {mode === 'card' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 重點數據 */}
            {result.highlights && (
              <div className="grid grid-cols-2 gap-3">
                {result.highlights.map((item, index) => (
                  <div key={index} className={`p-3 rounded-xl ${item.type === 'good' ? 'bg-green-100/70' : 'bg-red-100/70'}`}>
                    <div className="flex items-center gap-1 mb-1">
                      {item.type === 'good' ? <CheckCircle className="w-3 h-3 text-green-600" /> : <AlertTriangle className="w-3 h-3 text-red-600" />}
                      <span className="text-xs text-gray-600 font-semibold">{item.label}</span>
                    </div>
                    <p className={`font-black text-lg ${item.type === 'good' ? 'text-green-700' : 'text-red-700'}`}>{item.value}</p>
                    <p className="text-[10px] text-gray-500 leading-tight mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 成分翻譯機 */}
            {result.translations && (
              <div className="bg-white/70 rounded-2xl p-4 space-y-2 border border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">🔍 成分翻譯機</h3>
                <div className="space-y-3">
                  {result.translations.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 line-through text-xs">{item.origin}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-bold text-emerald-700">{item.simplified}</span>
                      </div>
                      <p className="text-xs text-gray-500 ml-4">{item.explain}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 模式切換內容：精靈建議模式 */}
        {mode === 'elf' && (
          <div className="animate-in slide-in-from-right-4 duration-300">
            {result.advice && (
              <div className="bg-emerald-100/70 rounded-2xl p-5 space-y-4 border border-emerald-200">
                <h3 className="font-bold text-emerald-800 text-base flex items-center gap-2">🧚 小精靈悄悄話</h3>
                <div className="space-y-3">
                  {result.advice.target && (
                    <div className="flex gap-2">
                      <span className="shrink-0">✅</span>
                      <p className="text-sm text-green-800"><span className="font-bold">適合：</span>{result.advice.target}</p>
                    </div>
                  )}
                  {result.advice.warning && (
                    <div className="flex gap-2">
                      <span className="shrink-0">⚠️</span>
                      <p className="text-sm text-red-700"><span className="font-bold">注意：</span>{result.advice.warning}</p>
                    </div>
                  )}
                  {result.advice.action && (
                    <div className="flex gap-2 pt-2 border-t border-emerald-200/50">
                      <span className="shrink-0">💡</span>
                      <p className="text-sm text-emerald-900 font-medium">{result.advice.action}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 浮水印 */}
        <div className="text-center pt-2 border-t border-dashed border-gray-200">
          <span className="text-[10px] text-gray-400 tracking-widest font-medium uppercase">
            Powered by Nutrition Elf AI 🧚
          </span>
        </div>
      </div>

      {/* 分享按鈕 */}
      <Button
        onClick={handleShare}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-7 rounded-2xl text-lg font-bold shadow-lg shadow-emerald-100"
      >
        <Download className="w-5 h-5 mr-2" />
        儲存分析小卡
      </Button>
    </div>
  );
}