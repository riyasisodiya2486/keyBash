"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

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
  const shellRef = useRef<HTMLDivElement | null>(null);
  const maxBurstWpm = burstSeries.reduce((highest, bucket) => Math.max(highest, bucket.bucketWpm), 0);
  const averageBurstLatency = burstSeries.reduce((total, bucket) => total + (bucket.averageLatencyMs ?? 0), 0);
  const burstLatencyCount = burstSeries.filter((bucket) => bucket.averageLatencyMs !== null).length;
  const averageLatencyLabel = burstLatencyCount > 0
    ? `${Math.round(averageBurstLatency / burstLatencyCount)}ms`
    : "--";
  const strongestBurst = burstSeries.reduce<BurstPoint | null>((best, bucket) => {
    if (!best || bucket.bucketWpm > best.bucketWpm) {
      return bucket;
    }

    return best;
  }, null);
  const firstBurst = burstSeries[0] ?? null;
  const lastBurst = burstSeries[burstSeries.length - 1] ?? null;
  const burstTrend = firstBurst && lastBurst
    ? lastBurst.bucketWpm - firstBurst.bucketWpm
    : 0;
  const timeTakenLabel = `${timeTakenSeconds.toFixed(1)}s`;
  const burstAreaPath = burstSeries.length > 0
    ? `M24,144 L${burstPolyline} L296,144 Z`
    : "";

  useEffect(() => {
    if (!shellRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { autoAlpha: 0, y: 28, filter: "blur(16px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
      );

      gsap.fromTo(
        "[data-result-card]",
        { autoAlpha: 0, y: 24, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.62,
          ease: "power3.out",
          stagger: 0.07,
          delay: 0.08,
        },
      );
    }, shellRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={shellRef} className="minimal-scrollbar flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto pr-1">
      <section className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div data-result-card className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,22,29,0.84),rgba(12,15,21,0.92))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6">
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
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">final wpm</p>
              <p className="mt-2 text-[2.8rem] font-semibold leading-none tracking-[-0.09em] text-[#f0ab3c] sm:text-[3.2rem] xl:text-[3.8rem]">
                {wpm}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">final accuracy</p>
              <p className="mt-2 text-[2.8rem] font-semibold leading-none tracking-[-0.09em] text-[#f0ab3c] sm:text-[3.2rem] xl:text-[3.8rem]">
                {accuracy}%
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">time taken</p>
              <p className="mt-2 text-[2.8rem] font-semibold leading-none tracking-[-0.09em] text-[#f0ab3c] sm:text-[3.2rem] xl:text-[3.8rem]">
                {timeTakenLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div data-result-card className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">raw</p>
            <p className="mt-2 text-[1.8rem] font-semibold tracking-[-0.06em] text-[#f5efe6] sm:text-[2rem]">{grossWpm}</p>
          </div>
          <div data-result-card className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">characters</p>
            <p className="mt-2 text-[1.8rem] font-semibold tracking-[-0.06em] text-[#f5efe6] sm:text-[2rem]">{correctChars}/{typedChars}</p>
          </div>
          <div data-result-card className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">test type</p>
            <p className="mt-2 text-[1.8rem] font-semibold tracking-[-0.06em] text-[#f5efe6] sm:text-[2rem]">{duration}s</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#8f816f]">
              {practiceMode === "code" ? "coding" : "words"}
            </p>
          </div>
          <div data-result-card className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#666256]">insight</p>
            <p className="mt-2 text-sm leading-6 text-[#d4cdc1]">
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

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]">
        <div data-result-card className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,22,29,0.78),rgba(10,13,18,0.94))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">burst metric</p>
              <h3 className="mt-2 text-[1.55rem] font-semibold leading-none tracking-[-0.06em] text-[#f5efe6] sm:text-[1.8rem] xl:text-[2rem]">
                speed over the run
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#a9a295]">
                Your speed dipped through the middle stretch, then snapped back with a late recovery burst.
              </p>
            </div>
            <div className="grid min-w-[11rem] grid-cols-2 gap-2">
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-right">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#666256]">best burst</p>
                <p className="mt-1 text-[1.9rem] font-semibold leading-none tracking-[-0.07em] text-[#f0ab3c]">
                  {strongestBurst?.bucketWpm ?? 0}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8f816f]">
                  {strongestBurst?.label ?? "0s"}
                </p>
              </div>
              <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-3 text-right">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#666256]">trend</p>
                <p className={`mt-1 text-[1.9rem] font-semibold leading-none tracking-[-0.07em] ${burstTrend >= 0 ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                  {burstTrend >= 0 ? "+" : ""}{burstTrend}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8f816f]">
                  last vs first
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[1.45rem] border border-white/6 bg-[linear-gradient(180deg,rgba(8,14,20,0.96),rgba(10,14,18,0.92))] p-4 sm:p-5">
            <div className="mb-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#666256]">average latency</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.04em] text-[#f5efe6]">{averageLatencyLabel}</p>
              </div>
              <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#666256]">slowdown source</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.04em] text-[#f5efe6]">
                  {strongestBurst?.slowdownSource ?? "mixed"}
                </p>
              </div>
              <div className="rounded-[1rem] border border-white/6 bg-white/[0.02] px-3 py-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#666256]">sample window</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.04em] text-[#f5efe6]">
                  {burstSeries.length} splits
                </p>
              </div>
            </div>

            <svg viewBox="0 0 320 168" className="h-[13rem] w-full sm:h-[15rem]">
              <defs>
                <linearGradient id="burstLinePremium" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f0ab3c" />
                  <stop offset="100%" stopColor="#f7c861" />
                </linearGradient>
                <linearGradient id="burstAreaPremium" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(240,171,60,0.28)" />
                  <stop offset="100%" stopColor="rgba(240,171,60,0)" />
                </linearGradient>
              </defs>
              <path d="M24 144 H296" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
              <path d="M24 109 H296" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 10" fill="none" />
              <path d="M24 74 H296" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 10" fill="none" />
              <path d="M24 39 H296" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 10" fill="none" />
              {burstAreaPath ? <path d={burstAreaPath} fill="url(#burstAreaPremium)" /> : null}
              {burstSeries.map((bucket, index) => {
                const x = burstSeries.length <= 1 ? 24 : 24 + ((index / (burstSeries.length - 1)) * 272);
                const normalized = maxBurstWpm > 0 ? bucket.bucketWpm / maxBurstWpm : 0;
                const y = 144 - (normalized * 104);

                return (
                  <g key={`burst-${bucket.index}`}>
                    <circle cx={x} cy={y} r="6" fill="rgba(245,239,230,0.95)" />
                    <circle cx={x} cy={y} r="3" fill="#f0ab3c" />
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
                  stroke="url(#burstLinePremium)"
                  strokeWidth="3.25"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : null}
            </svg>
          </div>
        </div>

        <div className="grid gap-3">
          <div data-result-card className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(15,20,26,0.9),rgba(10,13,18,0.94))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8f816f]">strain insight</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6]">
              {slowestCategory ? formatCategoryLabel(slowestCategory.category) : "Not enough data"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#bcb4a7]">
              {slowestCategory
                ? `${slowestCategory.averageLatencyMs}ms average hesitation in the slowest category.`
                : "Run a longer session to surface category-level friction."}
            </p>
          </div>

          <div data-result-card className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(14,18,24,0.92),rgba(9,12,17,0.94))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8f816f]">run balance</p>
            <div className="mt-4 grid gap-3">
              {burstSeries.slice(0, 3).map((bucket) => (
                <div key={`burst-card-${bucket.index}`} className="rounded-[1rem] border border-white/6 bg-white/[0.03] px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f816f]">{bucket.label}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#666256]">{bucket.slowdownSource}</p>
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-[1.7rem] font-semibold tracking-[-0.05em] text-[#f5efe6]">{bucket.bucketWpm} WPM</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f816f]">
                      {bucket.averageLatencyMs ?? "--"}{bucket.averageLatencyMs !== null ? "ms" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-result-card className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(17,22,29,0.78),rgba(10,13,18,0.94))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">strain map</p>
              <h3 className="mt-2 text-[1.55rem] font-semibold leading-none tracking-[-0.06em] text-[#f5efe6] sm:text-[1.8rem] xl:text-[2rem]">
                keyboard hesitation
              </h3>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666256]">read guide</p>
              <p className="mt-1 text-sm text-[#bcb4a7]">Green is fluid. Red is friction.</p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-white/6 bg-[#0d1218]/88 p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-300">
                fluid
              </span>
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-300">
                moderate
              </span>
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-red-300">
                friction
              </span>
            </div>
            <div className="space-y-2 overflow-hidden">
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
        </div>
      </section>
    </div>
  );
}
