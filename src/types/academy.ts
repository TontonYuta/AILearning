export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface QuizOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  type: 'concept' | 'scenario' | 'pitfall';
  label: string;
  question: string;
  options: QuizOption[];
}

export interface PaperCitation {
  title: string;
  authors: string;
  venue: string;
  link?: string;
  type: 'paper' | 'repo' | 'standard';
}

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  notes: string;
}

export interface Chapter {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  lessonIds: number[];
}

export interface Lesson {
  id: number;
  chapterId: number;
  chapterTitle: string;
  lessonNumber: string; // e.g. "1.1", "1.2"
  globalIndex: number;  // 1 -> 24
  title: string;
  subtitle: string;
  level: 'Nền tảng' | 'Cơ bản' | 'Trung cấp' | 'Nâng cao' | 'Production';
  conceptBadge: string;
  citation: PaperCitation;
  bridgeFromPrevious: string; // Cầu nối: Tại sao bài trước dẫn đến bài này?
  analogy: string;            // Ẩn dụ thực tế giúp người mới hiểu trực quan
  coreConcept: string;        // Lý thuyết bản chất từng bước
  codeExample?: CodeExample;
  pitfalls: string;           // Cạm bẫy thường gặp & giải pháp
  previewNext: string;        // Lời dẫn liền mạch sang bài kế tiếp
  quizzes: QuizQuestion[];    // 3 câu hỏi trắc nghiệm đa tầng
}

export interface UserProgress {
  currentLessonId: number;
  completedLessons: number[];
  // Record<lessonId, Record<questionId, selectedOptionId>>
  quizAnswers: Record<number, Record<string, string>>;
  score: number;
}
