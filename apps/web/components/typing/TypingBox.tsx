"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import gsap from "gsap";

import {
  buildBurstSeries,
  buildHeatmapByKey,
  calculateGrossWpm,
  calculateNetWpm,
  clampPercentage,
  getKeyCategory,
  getMaxHeatLatencyMs,
  getSlowestCategory,
  normalizeHeatmapKey,
} from "./analytics";
import { buildPrompt } from "./config";
import TypingResultsView from "./TypingResultsView";
import TypingStatsGrid from "./TypingStatsGrid";
import {
  difficultyOptions,
  durationOptions,
  practiceModes,
} from "./types";
import type {
  Difficulty,
  KeyPressSample,
  PracticeMode,
} from "./types";

export default function TypingBox() {
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("words");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [duration, setDuration] = useState<15 | 30 | 60>(30);
  const [prompt, setPrompt] = useState(() => buildPrompt("easy", "words"));
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [keyHistory, setKeyHistory] = useState<KeyPressSample[]>([]);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  const ghostInputRef = useRef<HTMLInputElement | null>(null);
  const orbsRef = useRef<Array<HTMLDivElement | null>>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        topBarRef.current,
        { autoAlpha: 0, y: -28, filter: "blur(14px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
      );

      gsap.fromTo(
        timerRef.current,
        { autoAlpha: 0, scale: 0.88, y: 30, filter: "blur(20px)" },
        { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power3.out", delay: 0.18 },
      );

      gsap.fromTo(
        textRef.current,
        { autoAlpha: 0, y: 36, filter: "blur(18px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.05, ease: "power3.out", delay: 0.3 },
      );

      gsap.fromTo(
        hintRef.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 },
      );

      orbsRef.current.forEach((orb, index) => {
        if (!orb) {
          return;
        }

        gsap.to(orb, {
          x: index % 2 === 0 ? 36 : -28,
          y: index % 2 === 0 ? 24 : -20,
          scale: index === 1 ? 1.12 : 0.94,
          duration: 5.5 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, shellRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!hasStarted || isComplete || startTime === null) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const nextElapsedMs = performance.now() - startTime;
      const remainingSeconds = Math.max(
        duration - Math.floor(nextElapsedMs / 1000),
        0,
      );

      setElapsedMs(nextElapsedMs);
      setTimeLeft(remainingSeconds);

      if (remainingSeconds === 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsComplete(true);
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [duration, hasStarted, isComplete, startTime]);

  useEffect(() => {
    if (!timerRef.current) {
      return;
    }

    gsap.fromTo(
      timerRef.current,
      { scale: 1.08, textShadow: "0 0 22px rgba(201,142,74,0.4)" },
      { scale: 1, textShadow: "0 0 0 rgba(201,142,74,0)", duration: 0.45, ease: "power2.out" },
    );
  }, [timeLeft]);

  useEffect(() => {
    ghostInputRef.current?.focus();
  }, []);

  const currentIndex = typedText.length;
  const typedChars = typedText.length;
  const promptChars = prompt.length;
  const correctChars = typedText.split("").filter((char, index) => char === prompt[index]).length;
  const incorrectChars = typedChars - correctChars;
  const elapsedMinutes = elapsedMs > 0 ? elapsedMs / 60000 : 0;
  const accuracy = typedChars > 0
    ? Math.round(clampPercentage((correctChars / typedChars) * 100))
    : 100;
  const grossWpm = calculateGrossWpm(typedChars, elapsedMinutes);
  const wpm = calculateNetWpm(correctChars, elapsedMinutes);
  const progress = promptChars > 0
    ? Math.round(clampPercentage((typedChars / promptChars) * 100))
    : 0;
  const heatmapByKey = buildHeatmapByKey(keyHistory);
  const maxHeatLatencyMs = getMaxHeatLatencyMs(heatmapByKey);
  const slowestCategory = getSlowestCategory(keyHistory);
  const { burstSeries, burstPolyline } = buildBurstSeries(keyHistory, elapsedMs, startTime);

  const resetSession = (nextPrompt = buildPrompt(difficulty, practiceMode), nextTimeLeft = duration) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setPrompt(nextPrompt);
    setTypedText("");
    setTimeLeft(nextTimeLeft);
    setHasStarted(false);
    setIsComplete(false);
    setStartTime(null);
    setElapsedMs(0);
    setKeyHistory([]);
    lastKeyTimeRef.current = null;
    ghostInputRef.current?.focus();
  };

  const handleReset = () => {
    resetSession();
  };

  const handlePracticeModeChange = (nextMode: PracticeMode) => {
    setPracticeMode(nextMode);
    resetSession(buildPrompt(difficulty, nextMode));
  };

  const handleDifficultyChange = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty);
    resetSession(buildPrompt(nextDifficulty, practiceMode));
  };

  const handleDurationChange = (nextDuration: 15 | 30 | 60) => {
    setDuration(nextDuration);
    resetSession(buildPrompt(difficulty, practiceMode), nextDuration);
  };

  const completeRun = (completedAt = startTime) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (startTime !== null && completedAt !== null) {
      setElapsedMs(completedAt - startTime);
      setTimeLeft((current) => Math.max(current, 0));
    }

    setIsComplete(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleReset();
      return;
    }

    if (isComplete) {
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      ghostInputRef.current?.focus();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();

      if (typedText.length === 0) {
        return;
      }

      setTypedText((current) => current.slice(0, -1));
      return;
    }

    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    event.preventDefault();

    if (!hasStarted) {
      const nextStartTime = event.timeStamp;
      setHasStarted(true);
      setStartTime(nextStartTime);
      setElapsedMs(0);
      lastKeyTimeRef.current = nextStartTime;
    }

    if (currentIndex >= promptChars) {
      completeRun(event.timeStamp);
      return;
    }

    const currentTimestamp = event.timeStamp;
    const expectedChar = prompt[currentIndex] ?? "";
    const latencyMs = lastKeyTimeRef.current === null
      ? null
      : Math.max(Math.round(currentTimestamp - lastKeyTimeRef.current), 0);
    const nextText = `${typedText}${event.key}`.slice(0, promptChars);
    const nextIndex = nextText.length;
    const typedChar = event.key;

    setKeyHistory((current) => [...current, {
      expectedChar,
      typedChar,
      correct: typedChar === expectedChar,
      timestamp: currentTimestamp,
      latencyMs,
      heatmapKey: normalizeHeatmapKey(typedChar),
      category: getKeyCategory(typedChar),
    }]);
    lastKeyTimeRef.current = currentTimestamp;

    setTypedText(nextText);

    if (nextIndex >= promptChars) {
      completeRun(currentTimestamp);
    }
  };

  return (
    <section
      ref={shellRef}
      className="relative isolate h-[calc(100dvh-1rem)] w-full overflow-hidden rounded-[2.3rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,23,29,0.94),rgba(8,10,14,0.98))] px-4 py-4 shadow-[0_40px_140px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:h-[calc(100dvh-2rem)] sm:px-5 sm:py-5 lg:px-6"
      onClick={() => ghostInputRef.current?.focus()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_22%,rgba(201,142,74,0.16),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(255,255,255,0.05),transparent_18%),linear-gradient(to_right,rgba(245,239,230,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.03)_1px,transparent_1px)] bg-[size:auto,auto,72px_72px,72px_72px]" />
      <div
        ref={(node) => {
          orbsRef.current[0] = node;
        }}
        className="absolute left-[4%] top-20 h-52 w-52 rounded-full bg-[#c98e4a]/10 blur-3xl"
      />
      <div
        ref={(node) => {
          orbsRef.current[1] = node;
        }}
        className="absolute right-[10%] top-12 h-64 w-64 rounded-full bg-[#f5efe6]/6 blur-3xl"
      />
      <div
        ref={(node) => {
          orbsRef.current[2] = node;
        }}
        className="absolute bottom-8 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-[#c98e4a]/8 blur-3xl"
      />

      <input
        ref={ghostInputRef}
        value={typedText}
        onKeyDown={handleKeyDown}
        onChange={() => {}}
        className="pointer-events-none absolute opacity-0"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Typing input"
      />

      <div ref={topBarRef} className="relative z-10 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div className="min-w-0 max-w-full overflow-x-auto rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-3 whitespace-nowrap">
            <div className="flex items-center gap-3 pr-2">
            <span className="h-3 w-3 rounded-full bg-[#c98e4a]" />
            <span className="text-lg font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-xl">
              KeyBash
            </span>
            </div>
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            {practiceModes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handlePracticeModeChange(option)}
                className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] whitespace-nowrap transition ${
                  practiceMode === option
                    ? "bg-[#f0ab3c] text-[#16120d] shadow-[0_0_24px_rgba(240,171,60,0.22)]"
                    : "text-[#8f816f] hover:text-[#f5efe6]"
                }`}
              >
                {option === "code" ? "Coding practice" : "Word practice"}
              </button>
            ))}
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            {difficultyOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleDifficultyChange(option)}
                className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] whitespace-nowrap transition ${
                  difficulty === option
                    ? "bg-[#f0ab3c] text-[#16120d] shadow-[0_0_24px_rgba(240,171,60,0.22)]"
                    : "text-[#8f816f] hover:text-[#f5efe6]"
                }`}
              >
                {option}
              </button>
            ))}
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            {durationOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleDurationChange(option)}
                className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] whitespace-nowrap transition ${
                  duration === option
                    ? "bg-[#f0ab3c] text-[#16120d] shadow-[0_0_24px_rgba(240,171,60,0.22)]"
                    : "text-[#8f816f] hover:text-[#f5efe6]"
                }`}
              >
                {option}s
              </button>
            ))}
            <div className="hidden h-6 w-px bg-white/10 sm:block" />
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] whitespace-nowrap text-[#8f816f] transition hover:text-[#f5efe6]"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 xl:pl-3">
          <div className="min-w-[9.75rem] rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
            {isComplete ? "Run complete" : hasStarted ? "Live run" : "Idle"}
          </div>
          <a
            href="/sign-in"
            className="rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] whitespace-nowrap text-[#8f816f] transition hover:text-[#f5efe6]"
          >
            Sign in
          </a>
        </div>
      </div>

      <div className="relative z-10 h-[calc(100%-5.5rem)] px-2 py-4 sm:h-[calc(100%-6rem)] sm:px-4 sm:py-5">
        {isComplete ? (
          <TypingResultsView
            wpm={wpm}
            accuracy={accuracy}
            grossWpm={grossWpm}
            correctChars={correctChars}
            typedChars={typedChars}
            incorrectChars={incorrectChars}
            duration={duration}
            practiceMode={practiceMode}
            heatmapByKey={heatmapByKey}
            maxHeatLatencyMs={maxHeatLatencyMs}
            burstSeries={burstSeries}
            burstPolyline={burstPolyline}
            slowestCategory={slowestCategory}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-start overflow-hidden pt-1 sm:pt-2">
            <div
              ref={timerRef}
              className="font-mono text-[2.9rem] font-semibold tracking-[-0.08em] text-[#f0ab3c] drop-shadow-[0_0_18px_rgba(240,171,60,0.35)] sm:text-[3.7rem] lg:text-[4.25rem]"
            >
              {timeLeft}
            </div>

            <div
              ref={textRef}
              className="mt-5 w-full max-w-[82rem] rounded-[1.6rem] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:mt-6 sm:px-5 sm:py-5 lg:px-6"
            >
              <p
                className={`flex flex-wrap gap-y-3 tracking-[-0.05em] ${
                  practiceMode === "code"
                    ? "font-mono text-[0.95rem] leading-[1.75] sm:text-[1.08rem] sm:leading-[1.85] lg:text-[1.22rem] lg:leading-[1.95]"
                    : "text-[1.2rem] leading-[1.55] sm:text-[1.45rem] sm:leading-[1.65] lg:text-[1.85rem] lg:leading-[1.72]"
                }`}
              >
                {prompt.split("").map((char, index) => {
                  const typedChar = typedText[index];
                  const isCurrent = index === currentIndex && !isComplete;
                  let tone = "text-[#6b7280]";

                  if (typedChar !== undefined) {
                    tone = typedChar === char ? "text-[#4ade80]" : "text-[#f87171]";
                  }

                  return (
                    <span key={`${char}-${index}`} className="relative inline-flex items-center">
                      {isCurrent ? (
                        <span
                          aria-hidden="true"
                          className="mr-1 inline-block h-[1.1em] w-[3px] rounded-full bg-[#c98e4a] shadow-[0_0_18px_rgba(201,142,74,0.85)]"
                        />
                      ) : null}
                      <span className={`${tone} ${char === " " ? "w-[0.38em]" : ""}`}>
                        {char === " " ? "\u00A0" : char}
                      </span>
                    </span>
                  );
                })}
              </p>
            </div>

            <p
              ref={hintRef}
              className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[#666256] sm:mt-6 sm:text-[0.82rem]"
            >
              start typing to begin...
            </p>

            <TypingStatsGrid
              wpm={wpm}
              accuracy={accuracy}
              correctChars={correctChars}
              typedChars={typedChars}
              grossWpm={grossWpm}
              progress={progress}
              incorrectChars={incorrectChars}
            />
          </div>
        )}
      </div>
    </section>
  );
}
