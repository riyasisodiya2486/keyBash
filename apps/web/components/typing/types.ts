"use client";

export const difficultyOptions = ["easy", "medium", "hard"] as const;
export const practiceModes = ["words", "code"] as const;
export const durationOptions = [15, 30, 60] as const;

export type Difficulty = (typeof difficultyOptions)[number];
export type PracticeMode = (typeof practiceModes)[number];
export type TypingDuration = (typeof durationOptions)[number];
export type KeyCategory = "letter" | "capital" | "number" | "symbol" | "space";

export type KeyPressSample = {
  expectedChar: string;
  typedChar: string;
  correct: boolean;
  timestamp: number;
  latencyMs: number | null;
  heatmapKey: string;
  category: KeyCategory;
};

export type HeatmapSummary = {
  count: number;
  averageLatencyMs: number | null;
};
