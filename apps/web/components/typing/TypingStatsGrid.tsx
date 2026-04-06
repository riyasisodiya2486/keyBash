"use client";

type TypingStatsGridProps = {
  wpm: number;
  accuracy: number;
  correctChars: number;
  typedChars: number;
  grossWpm: number;
  progress: number;
  incorrectChars: number;
};

export default function TypingStatsGrid({
  wpm,
  accuracy,
  correctChars,
  typedChars,
  grossWpm,
  progress,
  incorrectChars,
}: TypingStatsGridProps) {
  return (
    <div className="mt-5 grid w-full max-w-5xl gap-2.5 sm:mt-6 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
          WPM
        </p>
        <p className="mt-1.5 text-xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-[1.7rem]">
          {wpm}
        </p>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#666256]">
          Net speed from correct chars
        </p>
      </div>
      <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
          Accuracy
        </p>
        <p className="mt-1.5 text-xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-[1.7rem]">
          {accuracy}%
        </p>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#666256]">
          {correctChars} correct / {typedChars} typed
        </p>
      </div>
      <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
          Raw WPM
        </p>
        <p className="mt-1.5 text-xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-[1.7rem]">
          {grossWpm}
        </p>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#666256]">
          Speed before error penalty
        </p>
      </div>
      <div className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
          Progress
        </p>
        <p className="mt-1.5 text-xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-[1.7rem]">
          {progress}%
        </p>
        <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#666256]">
          {incorrectChars} incorrect chars
        </p>
      </div>
    </div>
  );
}
