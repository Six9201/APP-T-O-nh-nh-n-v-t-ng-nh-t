
import React from 'react';
import type { Character, Background, AspectRatio } from '../types';
import { ImageUploader } from './ImageUploader';

interface ControlPanelProps {
  characters: Character[];
  setCharacters: React.Dispatch<React.SetStateAction<Character[]>>;
  background: Background;
  setBackground: React.Dispatch<React.SetStateAction<Background>>;
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  onImageUpload: (id: number | 'background', file: File) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  characters,
  setCharacters,
  background,
  setBackground,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onImageUpload,
  onGenerate,
  isLoading,
}) => {
  const handleCharacterSelect = (id: number) => {
    setCharacters(prev =>
      prev.map(char =>
        char.id === id ? { ...char, selected: !char.selected } : char
      )
    );
  };

  const handleUseBackgroundToggle = () => {
    setBackground(prev => ({...prev, use: !prev.use }));
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-6 h-full shadow-lg">
      <div>
        <h2 className="text-xl font-semibold mb-3 text-white">1. Ảnh nhân vật tham chiếu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {characters.map(char => (
            <div key={char.id} className="flex flex-col gap-2">
              <ImageUploader
                label={`Nhân vật ${char.id}`}
                onImageUpload={(file) => onImageUpload(char.id, file)}
                imagePreviewUrl={char.previewUrl}
              />
               <label className="flex items-center justify-center text-sm cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={char.selected}
                  onChange={() => handleCharacterSelect(char.id)}
                  className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600"
                  disabled={!char.file}
                />
                <span className={`ml-2 ${char.file ? 'text-gray-300' : 'text-gray-500'}`}>Chọn</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3 text-white">2. Bối cảnh tham chiếu</h2>
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="w-full md:w-1/2">
            <ImageUploader
                label="Tải ảnh nền"
                onImageUpload={(file) => onImageUpload('background', file)}
                imagePreviewUrl={background.previewUrl}
              />
          </div>
          <div className="w-full md:w-1/2 mt-2 md:mt-8">
            <label className="flex items-center text-sm cursor-pointer p-3 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={background.use}
                onChange={handleUseBackgroundToggle}
                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-600"
                disabled={!background.file}
              />
              <span className={`ml-3 text-base ${background.file ? 'text-gray-200' : 'text-gray-500'}`}>Sử dụng bối cảnh này</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3 text-white">3. Câu lệnh</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Mô tả hành động, bối cảnh, hoặc bố cục bạn muốn..."
          className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-gray-200 placeholder-gray-400 resize-none"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3 text-white">4. Tỉ lệ khung hình</h2>
        <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setAspectRatio('16:9')}
            aria-pressed={aspectRatio === '16:9'}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              aspectRatio === '16:9'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            16:9 (Ngang)
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            aria-pressed={aspectRatio === '9:16'}
            className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              aspectRatio === '9:16'
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            9:16 (Dọc)
          </button>
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : 'Tạo ảnh'}
        </button>
      </div>
    </div>
  );
};