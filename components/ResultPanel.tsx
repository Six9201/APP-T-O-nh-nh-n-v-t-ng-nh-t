
import React, { useState } from 'react';
import { DownloadIcon, ViewIcon, CloseIcon } from './icons';

interface ResultPanelProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ generatedImage, isLoading, error }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `xuan-sau-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
          <p className="mt-4 text-lg font-semibold text-gray-300">AI đang vẽ, vui lòng chờ...</p>
          <p className="text-sm text-gray-400">Quá trình này có thể mất một vài phút.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center bg-red-900/20 border border-red-500/50 rounded-lg p-6">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-lg font-semibold text-red-300">Lỗi!</p>
          <p className="text-sm text-gray-300 mt-1">{error}</p>
        </div>
      );
    }

    if (generatedImage) {
      return (
        <div className="w-full h-full relative group">
          <img src={generatedImage} alt="Generated result" className="w-full h-full object-contain rounded-lg" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 rounded-lg">
            <button onClick={() => setShowPreview(true)} className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors" title="Xem trước">
              <ViewIcon />
            </button>
            <button onClick={handleDownload} className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors" title="Tải xuống">
              <DownloadIcon />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-4 text-lg font-semibold text-gray-500">Kết quả sẽ được hiển thị ở đây</p>
        <p className="text-sm text-gray-600">Điền thông tin và nhấn "Tạo ảnh" để bắt đầu.</p>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-lg p-4 flex items-center justify-center min-h-[400px] lg:min-h-0 h-full">
        {renderContent()}
      </div>

      {showPreview && generatedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 text-white p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors">
            <CloseIcon />
          </button>
          <img src={generatedImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
};
