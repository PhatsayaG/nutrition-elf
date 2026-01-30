import React from 'react';
import { Camera, X } from 'lucide-react';

export default function ImageUploader({ images, setImages }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-dashed border-emerald-200">
      <div className="flex flex-wrap gap-2 mb-4">
        {images.map((img, index) => (
          <div key={index} className="relative w-20 h-20">
            <img src={img} className="w-full h-full object-cover rounded-lg" />
            <button onClick={() => setImages(images.filter((_, i) => i !== index))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
          </div>
        ))}
        <label className="w-20 h-20 flex flex-col items-center justify-center bg-emerald-50 rounded-lg cursor-pointer text-emerald-600 border border-emerald-200">
          <Camera size={24} />
          <span className="text-[10px] mt-1">拍照/選圖</span>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>
      <p className="text-xs text-gray-400">支援上傳正反面照片，AI 將合併分析</p>
    </div>
  );
}