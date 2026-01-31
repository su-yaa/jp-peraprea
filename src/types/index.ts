export interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export interface Chunk {
  id: number;
  text: string;
  meaning: string;
  width: string;
}

export interface QuizData {
  id: string;
  categoryId: string;
  krPrompt: string;
  chunks: Chunk[];
  correctAnswer: string; // "一緒に 映画を 見に行く？"
}

export interface KanaData {
  id: number;
  sound: string; // "아"
  correctChar: string; // "あ"
  options: string[]; // ["あ", "い", "う", "え"]
}

export interface WordPicData {
  id: number;
  imageUrl: string;
  krWord: string;
  answer: string;
  options: string[];
}
