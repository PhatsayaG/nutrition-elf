import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const loadingMessages = [
  "正在尋找隱藏的熱量地雷...",
  "解碼神秘的化學成分中...",
  "小精靈正在研究營養標示...",
  "翻譯那些看不懂的添加物...",
  "計算你的健康指數中...",
  "正在揭露食品真相...",
];

export default function LoadingAnimation() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* AI 晶片旋轉動畫 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Cpu className="w-10 h-10 text-white" />
        </div>
        {/* 光暈效果 */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 bg-emerald-400 rounded-2xl -z-10 blur-xl"
        />
      </motion.div>

      {/* 趣味提示語 */}
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-emerald-700 font-medium text-center"
      >
        {loadingMessages[messageIndex]}
      </motion.p>

      {/* 進度條 */}
      <div className="w-48 h-2 bg-emerald-100 rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/2 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
        />
      </div>
    </div>
  );
}