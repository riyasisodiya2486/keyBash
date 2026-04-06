"use client";

import {
  formatCategoryLabel,
  formatHeatmapLabel,
  getHeatColor,
  keyboardRows,
} from "./analytics";
import type { HeatmapSummary, KeyCategory } from "./types";

type BurstPoint = {
  index: number;
  label: string;
  bucketWpm: number;
  averageLatencyMs: number | null;
  slowdownSource: "symbols" | "capitals" | "mixed";
};

type TypingAnalysisProps = {
  heatmapByKey: Record<string, HeatmapSummary>;
  maxHeatLatencyMs: number;
  burstSeries: BurstPoint[];
  burstPolyline: string;
  slowestCategory: {
    category: KeyCategory;
    averageLatencyMs: number;
  } | null;
};

export default function TypingAnalysis({
  heatmapByKey,
  maxHeatLatencyMs,
  burstSeries,
  burstPolyline,
  slowestCategory,
}: TypingAnalysisProps) {
  const maxBurstWpm = burstSeries.reduce((highest, bucket) => Math.max(highest, bucket.bucketWpm), 0);

  return (
    <div className="mt-7 grid w-full max-w-6xl gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
      <section className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-5 sm:py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
              Strain Map
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-2xl">
              Keyboard hesitation heatmap
            </h3>
          </div>
          <p className="max-w-[18rem] text-right font-mono text-[10px] uppercase tracking-[0.22em] text-[#666256]">
            Red keys mean longer hesitation. Green keys were hit more instantly.
          </p>
        </div>

        <div className="mt-5 space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex gap-2">
              {row.map((item) => {
                const summary = heatmapByKey[item.key];
                const fill = getHeatColor(summary?.averageLatencyMs ?? null, maxHeatLatencyMs);

                return (
                  <div
                    key={item.key}
                    className="rounded-[1rem] border border-white/8 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    style={{
                      flex: item.width,
                      background: `linear-gradient(180deg, ${fill}, rgba(255,255,255,0.04))`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f5efe6]">
                        {formatHeatmapLabel(item.key)}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666256]">
                        {summary?.averageLatencyMs ?? "--"}{summary?.averageLatencyMs !== null ? "ms" : ""}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8f816f]">
                      {summary?.count ?? 0} hits
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-white/8 bg-white/[0.03] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-5 sm:py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
          Burst Metric
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-2xl">
          Speed bursts through the run
        </h3>

        <div className="mt-5 rounded-[1.35rem] border border-white/6 bg-[#0f141b]/70 p-3">
          <svg viewBox="0 0 320 168" className="h-44 w-full">
            <defs>
              <linearGradient id="burstLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#f0ab3c" />
              </linearGradient>
            </defs>
            <path
              d="M24 144 H296"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M24 40 H296"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="4 6"
              fill="none"
            />
            {burstSeries.map((bucket, index) => {
              const x = burstSeries.length <= 1 ? 24 : 24 + ((index / (burstSeries.length - 1)) * 272);
              const normalized = maxBurstWpm > 0 ? bucket.bucketWpm / maxBurstWpm : 0;
              const y = 144 - (normalized * 104);

              return (
                <g key={`burst-${bucket.index}`}>
                  <circle cx={x} cy={y} r="4.5" fill="#f5efe6" />
                  <circle cx={x} cy={y} r="2.5" fill={bucket.slowdownSource === "symbols" ? "#f87171" : bucket.slowdownSource === "capitals" ? "#f0ab3c" : "#4ade80"} />
                  <text x={x} y="160" textAnchor="middle" className="fill-[#666256] text-[8px] font-mono uppercase tracking-[0.2em]">
                    {bucket.label}
                  </text>
                </g>
              );
            })}
            {burstPolyline ? (
              <polyline
                points={burstPolyline}
                fill="none"
                stroke="url(#burstLine)"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : null}
          </svg>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {burstSeries.map((bucket) => (
            <div key={`burst-card-${bucket.index}`} className="rounded-[1.2rem] border border-white/6 bg-[#0f141b]/65 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8f816f]">
                  {bucket.label}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#666256]">
                  {bucket.averageLatencyMs ?? "--"}{bucket.averageLatencyMs !== null ? "ms" : ""}
                </p>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6]">
                {bucket.bucketWpm} WPM
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#666256]">
                Slowdown: {bucket.slowdownSource}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[1.2rem] border border-white/6 bg-[#0f141b]/65 px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
            Run insight
          </p>
          <p className="mt-2 text-sm leading-6 text-[#c8c0b5] sm:text-[0.95rem]">
            {slowestCategory
              ? `${formatCategoryLabel(slowestCategory.category)} caused the heaviest hesitation at an average of ${slowestCategory.averageLatencyMs}ms per hit.`
              : "Need a longer run to surface reliable hesitation patterns."}
          </p>
        </div>
      </section>
    </div>
  );
}
