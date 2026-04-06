"use client";

import type { Difficulty, PracticeMode } from "./types";

const wordPools = {
  easy: [
    "can",
    "that",
    "this",
    "us",
    "think",
    "just",
    "see",
    "look",
    "their",
    "but",
    "do",
    "any",
    "in",
    "now",
    "know",
    "into",
    "day",
    "know",
    "who",
    "when",
    "these",
    "how",
    "so",
    "there",
    "say",
    "want",
    "or",
    "other",
    "type",
    "light",
    "flow",
    "soft",
    "clean",
    "focus",
    "move",
    "train",
  ],
  medium: [
    "velocity",
    "signal",
    "pressure",
    "rapid",
    "balance",
    "kinetic",
    "session",
    "arcade",
    "control",
    "clarity",
    "glimmer",
    "cadence",
    "pattern",
    "timing",
    "motion",
    "finish",
    "linear",
    "vector",
    "reactive",
    "throttle",
    "monitor",
    "practice",
    "dynamic",
    "elevate",
    "stamina",
    "measure",
    "highlight",
    "rebound",
  ],
  hard: [
    "oscillation",
    "synchrony",
    "microtiming",
    "architecture",
    "counterforce",
    "interference",
    "progressively",
    "transmission",
    "responsiveness",
    "fragmentation",
    "parallelism",
    "recalibrate",
    "compounding",
    "displacement",
    "uninterrupted",
    "orchestration",
    "performance",
    "dimensionality",
    "acceleration",
    "instrumentation",
  ],
} as const;

const codePools = {
  easy: [
    "const score = 42;",
    "let speed = wordsTyped / minutes;",
    "if (ready) return startTest();",
    "for (const key of keys) focus(key);",
    "const theme = 'ember';",
    "type Mode = 'words' | 'code';",
  ],
  medium: [
    "const result = entries.filter((item) => item.active).map((item) => item.label);",
    "function formatWpm(value: number) { return `${Math.round(value)} wpm`; }",
    "const nextUser = profile?.name ?? 'guest';",
    "setSession((current) => ({ ...current, streak: current.streak + 1 }));",
    "const visibleRows = rows.slice(0, limit).sort((a, b) => a.rank - b.rank);",
  ],
  hard: [
    "const payload = await fetch('/api/runs').then((response) => response.json());",
    "export function calculateAccuracy(correct: number, typed: number): number { return typed ? Math.round((correct / typed) * 100) : 100; }",
    "const grouped = snippets.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.language]: (acc[item.language] ?? 0) + 1 }), {});",
    "try { await saveRun(stats); } catch (error) { console.error('save failed', error); }",
  ],
} as const;

export function buildPrompt(level: Difficulty, mode: PracticeMode) {
  if (mode === "code") {
    return codePools[level].join(" ");
  }

  const source = wordPools[level];
  const words: string[] = [];

  for (let index = 0; index < 32; index += 1) {
    words.push(source[index % source.length]);
  }

  return words.join(" ");
}

