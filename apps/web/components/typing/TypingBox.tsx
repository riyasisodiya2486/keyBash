"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import gsap from "gsap";

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

const durationOptions = [15, 30, 60] as const;
const difficultyOptions = ["easy", "medium", "hard"] as const;
const practiceModes = ["words", "code"] as const;

type Difficulty = (typeof difficultyOptions)[number];
type PracticeMode = (typeof practiceModes)[number];

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, value));
}

function calculateGrossWpm(typedChars: number, elapsedMinutes: number) {
  if (elapsedMinutes <= 0) {
    return 0;
  }

  return Math.round((typedChars / 5) / elapsedMinutes);
}

function calculateNetWpm(correctChars: number, elapsedMinutes: number) {
  if (elapsedMinutes <= 0) {
    return 0;
  }

  return Math.round((correctChars / 5) / elapsedMinutes);
}

function buildPrompt(level: Difficulty, mode: PracticeMode) {
  if (mode === "code") {
    const source = codePools[level];
    return source.join(" ");
  }

  const source = wordPools[level];
  const words: string[] = [];

  for (let index = 0; index < 32; index += 1) {
    words.push(source[index % source.length]);
  }

  return words.join(" ");
}

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

  const shellRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  const ghostInputRef = useRef<HTMLInputElement | null>(null);
  const orbsRef = useRef<Array<HTMLDivElement | null>>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    }

    if (currentIndex >= promptChars) {
      completeRun();
      return;
    }

    const nextText = `${typedText}${event.key}`.slice(0, promptChars);
    const nextIndex = nextText.length;

    setTypedText(nextText);

    if (nextIndex >= promptChars) {
      completeRun(event.timeStamp);
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

      <div className="relative z-10 flex h-[calc(100%-5.5rem)] flex-col items-center justify-center px-2 py-4 sm:h-[calc(100%-6rem)] sm:px-4 sm:py-5">
        <div
          ref={timerRef}
          className="font-mono text-[3.5rem] font-semibold tracking-[-0.08em] text-[#f0ab3c] drop-shadow-[0_0_18px_rgba(240,171,60,0.35)] sm:text-[4.5rem] lg:text-[5.15rem]"
        >
          {timeLeft}
        </div>

        <div
          ref={textRef}
          className="mt-7 w-full max-w-6xl rounded-[1.8rem] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.01))] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:mt-8 sm:px-6 sm:py-6 lg:px-8"
        >
          <p
            className={`flex flex-wrap gap-y-3 tracking-[-0.05em] ${
              practiceMode === "code"
                ? "font-mono text-[1.05rem] leading-[1.9] sm:text-[1.2rem] sm:leading-[2] lg:text-[1.4rem] lg:leading-[2.1]"
                : "text-[1.45rem] leading-[1.7] sm:text-[1.8rem] sm:leading-[1.8] lg:text-[2.2rem] lg:leading-[1.85]"
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
          className="mt-6 font-mono text-[0.78rem] uppercase tracking-[0.24em] text-[#666256] sm:mt-8 sm:text-[0.9rem]"
        >
          {isComplete ? "run complete. tap reset to go again." : "start typing to begin..."}
        </p>

        <div className="mt-6 grid w-full max-w-5xl gap-3 sm:mt-7 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
              WPM
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-3xl">
              {wpm}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#666256]">
              Net speed from correct chars
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
              Accuracy
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-3xl">
              {accuracy}%
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#666256]">
              {correctChars} correct / {typedChars} typed
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
              Raw WPM
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-3xl">
              {grossWpm}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#666256]">
              Speed before error penalty
            </p>
          </div>
          <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
              Progress
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-3xl">
              {progress}%
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#666256]">
              {incorrectChars} incorrect chars
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
