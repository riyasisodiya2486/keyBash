"use client";

import {
  formatCategoryLabel,
  formatHeatmapLabel,
  getHeatColor,
  keyboardRows,
} from "./analytics";
import type { HeatmapSummary, KeyCategory, PracticeMode } from "./types";

type BurstPoint = {
  index: number;
  label: string;
  bucketWpm: number;
  averageLatencyMs: number | null;
  slowdownSource: "symbols" | "capitals" | "mixed";
};

type TypingResultsViewProps = {
  wpm: number;
  accuracy: number;
  timeTakenSeconds: number;
  grossWpm: number;
  correctChars: number;
  typedChars: number;
  incorrectChars: number;
  duration: number;
  practiceMode: PracticeMode;
  onRestart: () => void;
  heatmapByKey: Record<string, HeatmapSummary>;
  maxHeatLatencyMs: number;
  burstSeries: BurstPoint[];
  burstPolyline: string;
  slowestCategory: {
    category: KeyCategory;
    averageLatencyMs: number;
  } | null;
};

export default function TypingResultsView({
  wpm,
  accuracy,
  timeTakenSeconds,
  grossWpm,
  correctChars,
  typedChars,
  incorrectChars,
  duration,
  practiceMode,
  onRestart,
  heatmapByKey,
  maxHeatLatencyMs,
  burstSeries,
  burstPolyline,
  slowestCategory,
}: TypingResultsViewProps) {
  const maxBurstWpm = burstSeries.reduce((highest, bucket) => Math.max(highest, bucket.bucketWpm), 0);
  const strongestBurst = burstSeries.reduce<BurstPoint | null>((best, bucket) => {
    if (!best || bucket.bucketWpm > best.bucketWpm) {
      return bucket;
    }

    return best;
  }, null);
  const timeTakenLabel = `${timeTakenSeconds.toFixed(1)}s`;

  return (
    <div className="minimal-scrollbar flex h-full min-h-0 w-full flex-col gap-4 overflow-y-auto pr-1">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.65fr)]">
        <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,22,29,0.84),rgba(12,15,21,0.92))] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#7d7468]">results</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#bcb4a7]">
                Final WPM, final accuracy, and the total time from this run.
              </p>
            </div>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full bg-[#f0ab3c] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#16120d] transition hover:bg-[#f7c861]"
            >
              Restart test
            </button>
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">final wpm</p>
              <p className="mt-2 text-[4.4rem] font-semibold leading-none tracking-[-0.09em] text-[#f0ab3c]">
                {wpm}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">final accuracy</p>
              <p className="mt-2 text-[4.4rem] font-semibold leading-none tracking-[-0.09em] text-[#f0ab3c]">
                {accuracy}%
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">time taken</p>
              <p className="mt-2 text-[4.4rem] font-semibold leading-none tracking-[-0.09em] text-[#f0ab3c]">
                {timeTakenLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">raw</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#f5efe6]">{grossWpm}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">characters</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#f5efe6]">{correctChars}/{typedChars}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">test type</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#f5efe6]">{duration}s</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8f816f]">
              {practiceMode === "code" ? "coding" : "words"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">insight</p>
            <p className="mt-3 text-sm leading-6 text-[#d4cdc1]">
              {slowestCategory
                ? `${formatCategoryLabel(slowestCategory.category)} caused the most hesitation.`
                : "Need a longer run for a stable strain pattern."}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f816f]">
              {incorrectChars} incorrect chars
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,22,29,0.78),rgba(10,13,18,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">burst metric</p>
              <h3 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[#f5efe6]">
                speed over the run
              </h3>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#666256]">best burst</p>
              <p className="mt-2 text-4xl font-semibold leading-none tracking-[-0.07em] text-[#f0ab3c]">
                {strongestBurst?.bucketWpm ?? 0}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f816f]">
                {strongestBurst?.label ?? "0s"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-white/6 bg-[#0d1218]/88 p-4">
            <svg viewBox="0 0 320 168" className="h-[16rem] w-full">
              <defs>
                <linearGradient id="burstLineCompact" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f0ab3c" />
                  <stop offset="100%" stopColor="#f7c861" />
                </linearGradient>
              </defs>
              <path d="M24 144 H296" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
              <path d="M24 40 H296" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 8" fill="none" />
              {burstSeries.map((bucket, index) => {
                const x = burstSeries.length <= 1 ? 24 : 24 + ((index / (burstSeries.length - 1)) * 272);
                const normalized = maxBurstWpm > 0 ? bucket.bucketWpm / maxBurstWpm : 0;
                const y = 144 - (normalized * 104);

                return (
                  <g key={`burst-${bucket.index}`}>
                    <circle cx={x} cy={y} r="5" fill="#f5efe6" opacity="0.95" />
                    <circle cx={x} cy={y} r="2.5" fill="#f0ab3c" />
                    <text x={x} y="160" textAnchor="middle" className="fill-[#666256] text-[8px] font-mono uppercase tracking-[0.18em]">
                      {bucket.label}
                    </text>
                  </g>
                );
              })}
              {burstPolyline ? (
                <polyline
                  points={burstPolyline}
                  fill="none"
                  stroke="url(#burstLineCompact)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : null}
            </svg>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,22,29,0.78),rgba(10,13,18,0.94))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">strain map</p>
              <h3 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[#f5efe6]">
                keyboard hesitation
              </h3>
            </div>
            <p className="max-w-[14rem] text-right font-mono text-[10px] uppercase tracking-[0.2em] text-[#666256]">
              green is fluid. red is friction.
            </p>
          </div>

          <div className="mt-5 space-y-2 overflow-hidden">
            {keyboardRows.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-1.5">
                {row.map((item) => {
                  const summary = heatmapByKey[item.key];
                  const fill = getHeatColor(summary?.averageLatencyMs ?? null, maxHeatLatencyMs);

                  return (
                    <div
                      key={item.key}
                      className="min-w-0 rounded-[0.85rem] border border-white/8 px-2 py-2"
                      style={{
                        flex: item.width,
                        background: `linear-gradient(180deg, ${fill}, rgba(255,255,255,0.02))`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate font-mono text-[8px] uppercase tracking-[0.1em] text-[#f5efe6]">
                          {formatHeatmapLabel(item.key)}
                        </span>
                        <span className="shrink-0 font-mono text-[7px] uppercase tracking-[0.08em] text-[#8f816f]">
                          {summary?.averageLatencyMs ?? "--"}{summary?.averageLatencyMs !== null ? "ms" : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {burstSeries.slice(0, 3).map((bucket) => (
            <div key={`burst-card-${bucket.index}`} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8f816f]">{bucket.label}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666256]">{bucket.slowdownSource}</p>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#f5efe6]">{bucket.bucketWpm} WPM</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f816f]">
                {bucket.averageLatencyMs ?? "--"}{bucket.averageLatencyMs !== null ? "ms avg latency" : ""}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
