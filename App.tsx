
import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { ResultPanel } from './components/ResultPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { generateConsistentCharacterImage } from './services/geminiService';
import type { Character, Background, ImagePart, AspectRatio, HistoryItem } from './types';
import { fileToData } from './utils/fileUtils';

const initialCharacters: Character[] = [
  { id: 1, file: null, base64: null, previewUrl: null, mimeType: null, selected: false },
  { id: 2, file: null, base64: null, previewUrl: null, mimeType: null, selected: false },
  { id: 3, file: null, base64: null, previewUrl: null, mimeType: null, selected: false },
  { id: 4, file: null, base64: null, previewUrl: null, mimeType: null, selected: false },
];

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [background, setBackground] = useState<Background>({ file: null, base64: null, previewUrl: null, mimeType: null, use: false });
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('xuan-sau-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('xuan-sau-history', JSON.stringify(history));
  }, [history]);


  const handleImageUpload = useCallback(async (id: number | 'background', file: File) => {
    try {
      const { base64, mimeType, dataUrl } = await fileToData(file);
      if (id === 'background') {
        setBackground(prev => ({ ...prev, file, base64, mimeType, previewUrl: dataUrl }));
      } else {
        setCharacters(prev => prev.map(char =>
          char.id === id ? { ...char, file, base64, mimeType, previewUrl: dataUrl } : char
        ));
      }
    } catch (err) {
      setError('Không thể xử lý tệp hình ảnh.');
    }
  }, []);

  const handleGenerate = async () => {
    setError(null);
    setGeneratedImage(null);
  
    const selectedChars = characters.filter(c => c.selected && c.base64 && c.mimeType);
    const useBackground = background.use && background.base64 && background.mimeType;
  
    if (!prompt.trim()) {
      setError('Vui lòng nhập câu lệnh mô tả.');
      return;
    }
  
    let baseImage: ImagePart | null = null;
    let referenceImages: ImagePart[] = [];
  
    if (useBackground) {
      baseImage = { base64: background.base64!, mimeType: background.mimeType! };
      referenceImages = selectedChars.map(c => ({ base64: c.base64!, mimeType: c.mimeType! }));
    } else if (selectedChars.length > 0) {
      const [firstChar, ...restChars] = selectedChars;
      baseImage = { base64: firstChar.base64!, mimeType: firstChar.mimeType! };
      referenceImages = restChars.map(c => ({ base64: c.base64!, mimeType: c.mimeType! }));
    } else {
      setError('Vui lòng chọn ít nhất một nhân vật hoặc sử dụng bối cảnh.');
      return;
    }
  
    const fullPrompt = `${prompt.trim()}. Create the image with an aspect ratio of ${aspectRatio}.`;

    setIsLoading(true);
    try {
      const result = await generateConsistentCharacterImage(fullPrompt, baseImage, referenceImages);
      setGeneratedImage(result);
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        imageUrl: result,
        prompt: prompt.trim(), // Save original prompt
        aspectRatio: aspectRatio,
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    } catch (err: any) {
      setError(`Đã xảy ra lỗi: ${err.message || 'Vui lòng thử lại.'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setGeneratedImage(item.imageUrl);
    setPrompt(item.prompt);
    setAspectRatio(item.aspectRatio);
    setError(null);
  };

  const handleDeleteHistoryItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-7xl mb-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Xuân Sáu</h1>
        <p className="mt-2 text-lg text-purple-300">Tạo ảnh nhân vật hoạt hình đồng nhất</p>
      </header>
      <main className="w-full max-w-7xl flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <ControlPanel
            characters={characters}
            setCharacters={setCharacters}
            background={background}
            setBackground={setBackground}
            prompt={prompt}
            setPrompt={setPrompt}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onImageUpload={handleImageUpload}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <HistoryPanel 
            history={history}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteHistoryItem}
          />
        </div>
        <ResultPanel
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
