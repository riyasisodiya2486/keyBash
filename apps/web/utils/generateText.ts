"use client";

import type { Difficulty, PracticeMode } from "@/components/typing/types";

const wordSentences: Record<Difficulty, string[]> = {
  easy: [
    "Small habits make fast hands over time.",
    "Keep your pace smooth and stay relaxed.",
    "Clear focus turns each line into rhythm.",
    "Soft hands and steady eyes build speed.",
    "Type with calm control and trust the flow.",
    "Each clean word makes the next one easier.",
  ],
  medium: [
    "Consistent rhythm usually beats short bursts of panic typing.",
    "Measured focus helps accuracy stay strong under pressure.",
    "A balanced typing cadence creates smoother runs and cleaner stats.",
    "Precision grows when your hands move with deliberate timing.",
    "Strong sessions come from patience, control, and repeatable motion.",
    "Fast improvement appears when technique stays stable through the run.",
  ],
  hard: [
    "Sustained precision depends on composure, microtiming, and disciplined correction habits.",
    "High performance emerges when accuracy remains stable during accelerating passages.",
    "Responsive typing rewards intentional movement over fragmented bursts of rushed input.",
    "Elite consistency comes from controlled transitions between symbols, capitals, and spacing.",
    "Focused repetition transforms hesitation into fluent execution across demanding sequences.",
    "Complex prompts reveal whether technique can endure pressure without collapsing accuracy.",
  ],
};

const codeSentences: Record<Difficulty, string[]> = {
  easy: [
    "const pace = session.words / session.minutes;",
    "if (ready) startPractice();",
    "const theme = 'ember';",
    "for (const key of keys) focus(key);",
    "let accuracy = correct / typed;",
    "type Mode = 'words' | 'code';",
  ],
  medium: [
    "const nextUser = profile?.name ?? 'guest';",
    "const visibleRows = rows.filter((row) => row.active).slice(0, limit);",
    "setRun((current) => ({ ...current, streak: current.streak + 1 }));",
    "function formatWpm(value: number) { return `${Math.round(value)} wpm`; }",
    "const summary = samples.map((sample) => sample.latencyMs ?? 0).join(', ');",
    "const labels = entries.sort((a, b) => a.rank - b.rank).map((item) => item.label);",
  ],
  hard: [
    "const payload = await fetch('/api/runs').then((response) => response.json());",
    "export function calculateAccuracy(correct: number, typed: number): number { return typed ? Math.round((correct / typed) * 100) : 100; }",
    "const grouped = snippets.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.language]: (acc[item.language] ?? 0) + 1 }), {});",
    "try { await saveRun(stats); } catch (error) { console.error('save failed', error); }",
    "const snapshot = sessions.filter((item) => item.complete).map((item) => ({ id: item.id, wpm: item.wpm }));",
    "const value = queue.find((entry) => entry.id === targetId)?.status ?? 'idle';",
  ],
};

function pickRandomItems<T>(items: T[], count: number) {
  const pool = [...items];
  const selection: T[] = [];

  while (selection.length < count && pool.length > 0) {
    const nextIndex = Math.floor(Math.random() * pool.length);
    const [nextItem] = pool.splice(nextIndex, 1);

    if (nextItem !== undefined) {
      selection.push(nextItem);
    }
  }

  return selection;
}

export function generateText(mode: PracticeMode, difficulty: Difficulty) {
  if (mode === "code") {
    return pickRandomItems(codeSentences[difficulty], 3).join(" ");
  }

  return pickRandomItems(wordSentences[difficulty], 4).join(" ");
}
