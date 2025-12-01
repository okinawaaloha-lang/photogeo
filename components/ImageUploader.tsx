import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string, mimeType: string, previewUrl: string) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルのみアップロード可能です。');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      const mimeType = file.type;
      
      setPreview(result);
      onImageSelect(base64Data, mimeType, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative group border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          }
          ${preview ? 'h-auto min-h-[300px]' : 'h-64'}
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isLoading}
        />

        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img 
              src={preview} 
              alt="アップロードされたプレビュー" 
              className="max-h-[500px] w-auto rounded-lg shadow-md object-contain"
            />
            {!isLoading && (
              <button
                onClick={clearImage}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            )}
            {isLoading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-blue-800 font-medium animate-pulse">場所を特定中...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
            <div className={`p-4 rounded-full bg-gray-100 mb-4 transition-transform group-hover:scale-110 duration-300`}>
              <Upload size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-600">画像をここにドラッグ＆ドロップ</p>
            <p className="text-sm text-gray-400 mt-2">またはクリックしてファイルを選択</p>
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <ImageIcon size={14} />
              <span>JPG, PNG, WEBP 対応</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};