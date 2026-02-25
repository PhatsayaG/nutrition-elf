import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, ImagePlus, X } from 'lucide-react';

export default function ImageUploader({ images, setImages, disabled }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // 1. 植入您原創的壓縮邏輯：自動縮圖至 1200px 並維持 0.7 品質
  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200; // 您原本設定的理想寬度
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

          // 將 Canvas 轉回 Blob 格式供後續 API 使用
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve({
              file: compressedFile,
              preview: canvas.toDataURL('image/jpeg', 0.7) // 壓縮品質 0.7
            });
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    // 2. 異步處理所有圖片，確保每一張都經過壓縮
    const processedImages = await Promise.all(
      files.map(file => compressImage(file))
    );

    setImages(prev => [...prev, ...processedImages]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* 上傳區域：維持 Base44 的漂亮樣式 */}
      <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 bg-emerald-50/50 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <ImagePlus className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">上傳食品包裝照片</p>
            <p className="text-sm text-gray-500">支援正面包裝 + 背面成分表</p>
          </div>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              選擇照片
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled}
            >
              <Camera className="w-4 h-4 mr-2" />
              拍攝
            </Button>
          </div>
        </div>
        
        {/* Input 設定保持不變 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* 預覽圖片 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-200">
              <img
                src={img.preview}
                alt={`預覽 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}