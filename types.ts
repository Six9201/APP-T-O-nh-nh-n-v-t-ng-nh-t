
export interface Character {
  id: number;
  file: File | null;
  base64: string | null;
  previewUrl: string | null;
  mimeType: string | null;
  selected: boolean;
}

export interface Background {
  file: File | null;
  base64: string | null;
  previewUrl: string | null;
  mimeType: string | null;
  use: boolean;
}

export interface ImagePart {
    base64: string;
    mimeType: string;
}

export type AspectRatio = '9:16' | '16:9';

export interface HistoryItem {
  id: number;
  imageUrl: string;
  prompt: string;
  aspectRatio: AspectRatio;
}
