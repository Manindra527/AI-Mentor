export type SessionType = "concept" | "practice" | "revision" | "mock" | "analysis";
export type Mood = "focused" | "distracted" | "tired" | "motivated" | "frustrated" | "stressed";
export type StressReason = "topic-difficult" | "too-many-questions" | "time-pressure" | "didnt-understand" | "personal-distraction";

export interface TimeBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  subject: string;
  topic?: string;
  sessionType: SessionType;
  completed: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  sessionType: SessionType;
  subject: string;
  topic: string;
  duration: number;
  mood: Mood;
  stressReason?: StressReason;
  notes?: string;
  questionsAttempted?: number;
  correctAnswers?: number;
  hardness?: "easy" | "medium" | "hard" | "mixed";
  mistakes?: string;
}

export interface Doubt {
  id: string;
  question: string;
  answer?: string;
  subject?: string;
  topic?: string;
  date: string;
  imageUrl?: string;
}

export interface MockScore {
  id: string;
  date: string;
  test: string;
  score: number;
}

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  concept: "Concept",
  practice: "Practice",
  revision: "Revision",
  mock: "Mock Test",
  analysis: "Analysis",
};

export const SESSION_TYPE_COLORS: Record<SessionType, string> = {
  concept: "bg-blue-100 text-blue-700",
  practice: "bg-primary/10 text-primary",
  revision: "bg-purple-100 text-purple-700",
  mock: "bg-success/10 text-success",
  analysis: "bg-warning/10 text-warning",
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  focused: "🎯",
  distracted: "😵‍💫",
  tired: "😴",
  motivated: "🔥",
  frustrated: "😤",
  stressed: "😰",
};

export const SUBJECTS = [
  "Quantitative Aptitude",
  "Logical Reasoning",
  "English",
  "Data Interpretation",
  "General Knowledge",
];
