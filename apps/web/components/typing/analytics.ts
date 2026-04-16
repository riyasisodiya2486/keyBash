"use client";

import type { HeatmapSummary, KeyCategory, KeyPressSample } from "./types";

export const keyboardRows = [
  [
    { key: "`", width: 1 },
    { key: "1", width: 1 },
    { key: "2", width: 1 },
    { key: "3", width: 1 },
    { key: "4", width: 1 },
    { key: "5", width: 1 },
    { key: "6", width: 1 },
    { key: "7", width: 1 },
    { key: "8", width: 1 },
    { key: "9", width: 1 },
    { key: "0", width: 1 },
    { key: "-", width: 1 },
    { key: "=", width: 1 },
  ],
  [
    { key: "q", width: 1 },
    { key: "w", width: 1 },
    { key: "e", width: 1 },
    { key: "r", width: 1 },
    { key: "t", width: 1 },
    { key: "y", width: 1 },
    { key: "u", width: 1 },
    { key: "i", width: 1 },
    { key: "o", width: 1 },
    { key: "p", width: 1 },
    { key: "[", width: 1 },
    { key: "]", width: 1 },
    { key: "\\", width: 1 },
  ],
  [
    { key: "a", width: 1.15 },
    { key: "s", width: 1 },
    { key: "d", width: 1 },
    { key: "f", width: 1 },
    { key: "g", width: 1 },
    { key: "h", width: 1 },
    { key: "j", width: 1 },
    { key: "k", width: 1 },
    { key: "l", width: 1 },
    { key: ";", width: 1 },
    { key: "'", width: 1 },
  ],
  [
    { key: "z", width: 1.25 },
    { key: "x", width: 1 },
    { key: "c", width: 1 },
    { key: "v", width: 1 },
    { key: "b", width: 1 },
    { key: "n", width: 1 },
    { key: "m", width: 1 },
    { key: ",", width: 1 },
    { key: ".", width: 1 },
    { key: "/", width: 1 },
  ],
  [{ key: "space", width: 8.6 }],
] as const;

export function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function calculateGrossWpm(typedChars: number, elapsedMinutes: number) {
  if (elapsedMinutes <= 0) {
    return 0;
  }

  return Math.round((typedChars / 5) / elapsedMinutes);
}

export function calculateNetWpm(correctChars: number, elapsedMinutes: number) {
  if (elapsedMinutes <= 0) {
    return 0;
  }

  return Math.round((correctChars / 5) / elapsedMinutes);
}

export function normalizeHeatmapKey(char: string) {
  if (char === " ") {
    return "space";
  }

  return char.toLowerCase();
}

export function getKeyCategory(char: string): KeyCategory {
  if (char === " ") {
    return "space";
  }

  if (/^[A-Z]$/.test(char)) {
    return "capital";
  }

  if (/^[a-z]$/.test(char)) {
    return "letter";
  }

  if (/^[0-9]$/.test(char)) {
    return "number";
  }

  return "symbol";
}

export function getHeatColor(averageLatencyMs: number | null, maxLatencyMs: number) {
  if (averageLatencyMs === null || maxLatencyMs <= 0) {
    return "rgba(143,129,111,0.16)";
  }

  const intensity = clampPercentage((averageLatencyMs / maxLatencyMs) * 100) / 100;
  const hue = 132 - (132 * intensity);
  const alpha = 0.28 + (0.48 * intensity);

  return `hsla(${hue}, 80%, 54%, ${alpha})`;
}

export function formatHeatmapLabel(key: string) {
  if (key === "space") {
    return "Space";
  }

  return key.length === 1 ? key.toUpperCase() : key;
}

export function formatCategoryLabel(category: KeyCategory) {
  switch (category) {
    case "capital":
      return "Capital letters";
    case "number":
      return "Numbers";
    case "symbol":
      return "Symbols";
    case "space":
      return "Spaces";
    default:
      return "Letters";
  }
}

export function buildHeatmapByKey(keyHistory: KeyPressSample[]) {
  const heatmapSummary = keyHistory.reduce<Record<string, { totalLatencyMs: number; count: number }>>((summary, sample) => {
    if (sample.latencyMs === null) {
      return summary;
    }

    const current = summary[sample.heatmapKey] ?? { totalLatencyMs: 0, count: 0 };
    current.totalLatencyMs += sample.latencyMs;
    current.count += 1;
    summary[sample.heatmapKey] = current;
    return summary;
  }, {});

  return Object.entries(heatmapSummary).reduce<Record<string, HeatmapSummary>>((summary, [key, value]) => {
    summary[key] = {
      count: value.count,
      averageLatencyMs: value.count > 0 ? Math.round(value.totalLatencyMs / value.count) : null,
    };
    return summary;
  }, {});
}

export function getMaxHeatLatencyMs(heatmapByKey: Record<string, HeatmapSummary>) {
  return Object.values(heatmapByKey).reduce((highest, item) => {
    if (item.averageLatencyMs === null) {
      return highest;
    }

    return Math.max(highest, item.averageLatencyMs);
  }, 0);
}

export function getSlowestCategory(keyHistory: KeyPressSample[]) {
  const categorySummary = keyHistory.reduce<Record<KeyCategory, { latencyTotal: number; count: number }>>((summary, sample) => {
    if (sample.latencyMs === null) {
      return summary;
    }

    const current = summary[sample.category];
    current.latencyTotal += sample.latencyMs;
    current.count += 1;
    return summary;
  }, {
    letter: { latencyTotal: 0, count: 0 },
    capital: { latencyTotal: 0, count: 0 },
    number: { latencyTotal: 0, count: 0 },
    symbol: { latencyTotal: 0, count: 0 },
    space: { latencyTotal: 0, count: 0 },
  });

  return (Object.entries(categorySummary) as Array<[KeyCategory, { latencyTotal: number; count: number }]>)
    .map(([category, value]) => ({
      category,
      averageLatencyMs: value.count > 0 ? Math.round(value.latencyTotal / value.count) : 0,
      count: value.count,
    }))
    .filter((item) => item.count > 0)
    .sort((first, second) => second.averageLatencyMs - first.averageLatencyMs)[0] ?? null;
}

type BurstPoint = {
  index: number;
  typedChars: number;
  correctChars: number;
  latencyTotal: number;
  latencyCount: number;
  capitals: number;
  symbols: number;
  label: string;
  bucketWpm: number;
  averageLatencyMs: number | null;
  slowdownSource: "symbols" | "capitals" | "mixed";
};

export function buildBurstSeries(keyHistory: KeyPressSample[], elapsedMs: number, startTime: number | null) {
  const burstWindowMs = elapsedMs > 0 ? Math.max(1500, Math.round(elapsedMs / 6)) : 2000;
  const burstBucketCount = elapsedMs > 0 ? Math.max(1, Math.ceil(elapsedMs / burstWindowMs)) : 0;
  const burstBuckets = Array.from({ length: burstBucketCount }, (_, index) => ({
    index,
    typedChars: 0,
    correctChars: 0,
    latencyTotal: 0,
    latencyCount: 0,
    capitals: 0,
    symbols: 0,
  }));

  if (startTime !== null) {
    keyHistory.forEach((sample) => {
      const bucketIndex = Math.min(
        burstBuckets.length - 1,
        Math.max(0, Math.floor((sample.timestamp - startTime) / burstWindowMs)),
      );
      const bucket = burstBuckets[bucketIndex];

      if (!bucket) {
        return;
      }

      bucket.typedChars += 1;

      if (sample.correct) {
        bucket.correctChars += 1;
      }

      if (sample.latencyMs !== null) {
        bucket.latencyTotal += sample.latencyMs;
        bucket.latencyCount += 1;
      }

      if (sample.category === "capital") {
        bucket.capitals += 1;
      }

      if (sample.category === "symbol") {
        bucket.symbols += 1;
      }
    });
  }

  const burstSeries = burstBuckets.map<BurstPoint>((bucket) => {
    const bucketStart = bucket.index * burstWindowMs;
    const remainingDuration = Math.max(elapsedMs - bucketStart, 0);
    const bucketDurationMs = Math.min(burstWindowMs, remainingDuration || burstWindowMs);
    const bucketMinutes = bucketDurationMs / 60000;
    const bucketWpm = calculateNetWpm(bucket.correctChars, bucketMinutes);
    const averageLatencyMs = bucket.latencyCount > 0
      ? Math.round(bucket.latencyTotal / bucket.latencyCount)
      : null;

    return {
      ...bucket,
      label: `${(bucketStart / 1000).toFixed(0)}s`,
      bucketWpm,
      averageLatencyMs,
      slowdownSource: bucket.symbols > bucket.capitals
        ? "symbols"
        : bucket.capitals > bucket.symbols
          ? "capitals"
          : "mixed",
    };
  });

  const maxBurstWpm = burstSeries.reduce((highest, bucket) => Math.max(highest, bucket.bucketWpm), 0);
  const burstPolyline = burstSeries.map((bucket, index) => {
    const x = burstSeries.length <= 1 ? 24 : 24 + ((index / (burstSeries.length - 1)) * 272);
    const normalized = maxBurstWpm > 0 ? bucket.bucketWpm / maxBurstWpm : 0;
    const y = 144 - (normalized * 104);
    return `${x},${y}`;
  }).join(" ");

  return {
    burstWindowMs,
    burstSeries,
    burstPolyline,
    maxBurstWpm,
  };
}

