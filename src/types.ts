import { Type } from "@google/genai";

export interface User {
  id: number;
  email: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  is_premium: boolean;
  isLoggedIn?: boolean;
  questions_this_hour?: number;
  last_question_time?: number;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  type: 'quiz' | 'coding' | 'study';
}

export interface LeaderboardEntry {
  name: string;
  xp: number;
  level: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Note {
  id: number;
  user_email: string;
  title: string;
  content: string;
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export const STUDY_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    goal: { type: Type.STRING },
    dailyTasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          task: { type: Type.STRING },
          duration: { type: Type.STRING },
          priority: { type: Type.STRING }
        }
      }
    },
    weeklyMilestone: { type: Type.STRING }
  },
  required: ["goal", "dailyTasks", "weeklyMilestone"]
};
