
import React from 'react';
import type { HistoryItem } from '../types';
import { TrashIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: number) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onDelete }) => {
  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Ngăn không cho sự kiện click lan ra item cha
    onDelete(id);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 flex flex-col gap-4 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Lịch sử tạo ảnh</h2>
      {history.length === 0 ? (
        <div className="flex items-center justify-center text-center text-gray-500 py-8">
          <p>Chưa có lịch sử nào.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {history.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item)}
              className="flex items-center gap-4 p-2 rounded-md bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer group"
            >
              <img
                src={item.imageUrl}
                alt="History thumbnail"
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-grow overflow-hidden">
                <p className="text-sm text-gray-300 truncate" title={item.prompt}>
                  {item.prompt}
                </p>
                <span className="text-xs text-gray-400 bg-gray-600 px-2 py-0.5 rounded-full">
                  {item.aspectRatio}
                </span>
              </div>
              <button
                onClick={(e) => handleDeleteClick(e, item.id)}
                className="ml-auto p-2 rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                title="Xóa"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
