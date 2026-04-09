"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTyping } from "@/hooks/useTyping";

import TypingResultsView from "./TypingResultsView";
import TypingStatsGrid from "./TypingStatsGrid";
import {
  difficultyOptions,
  durationOptions,
  practiceModes,
} from "./types";

export default function TypingBox() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<HTMLDivElement | null>(null);
  const promptPanelRef = useRef<HTMLDivElement | null>(null);
  const feedbackFlashRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const hintRef = useRef<HTMLParagraphElement | null>(null);
  const liveContentRef = useRef<HTMLDivElement | null>(null);
  const orbsRef = useRef<Array<HTMLDivElement | null>>([]);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const {
    accuracy,
    burstPolyline,
    burstSeries,
    correctChars,
    currentIndex,
    difficulty,
    duration,
    elapsedMs,
    ghostInputRef,
    grossWpm,
    handleDifficultyChange,
    handleDurationChange,
    handleKeyDown,
    handlePracticeModeChange,
    handleReset,
    hasStarted,
    heatmapByKey,
    incorrectChars,
    isComplete,
    maxHeatLatencyMs,
    practiceMode,
    progress,
    prompt,
    slowestCategory,
    timeLeft,
    typedChars,
    typedText,
    wpm,
  } = useTyping();

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
        promptPanelRef.current,
        { autoAlpha: 0, y: 36, filter: "blur(18px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.05, ease: "power3.out", delay: 0.3 },
      );

      gsap.fromTo(
        hintRef.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 },
      );

      gsap.fromTo(
        liveContentRef.current,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.24 },
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
    if (!cursorRef.current || isComplete) {
      return;
    }

    const tween = gsap.fromTo(
      cursorRef.current,
      { autoAlpha: 1, scaleY: 1 },
      {
        autoAlpha: 0.18,
        scaleY: 0.82,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      },
    );

    return () => tween.kill();
  }, [typedText.length, isComplete]);

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
    charRefs.current = [];
  }, [prompt]);

  const triggerKeyFeedback = (isCorrect: boolean, charIndex: number) => {
    const flashNode = feedbackFlashRef.current;
    const panelNode = promptPanelRef.current;
    const charNode = charRefs.current[charIndex];
    const tone = isCorrect
      ? {
          overlay: "rgba(74, 222, 128, 0.24)",
          edge: "rgba(74, 222, 128, 0.34)",
          glow: "0 0 0 1px rgba(74, 222, 128, 0.2), 0 28px 80px rgba(22, 163, 74, 0.12)",
          x: 0,
        }
      : {
          overlay: "rgba(248, 113, 113, 0.22)",
          edge: "rgba(248, 113, 113, 0.32)",
          glow: "0 0 0 1px rgba(248, 113, 113, 0.2), 0 28px 80px rgba(239, 68, 68, 0.12)",
          x: 6,
        };

    if (flashNode) {
      gsap.killTweensOf(flashNode);
      gsap.fromTo(
        flashNode,
        { autoAlpha: 0, background: `radial-gradient(circle at 50% 50%, ${tone.overlay}, transparent 72%)` },
        { autoAlpha: 1, duration: 0.1, ease: "power1.out" },
      );
      gsap.to(flashNode, {
        autoAlpha: 0,
        duration: isCorrect ? 0.45 : 0.6,
        ease: "power2.out",
        delay: 0.02,
      });
    }

    if (panelNode) {
      gsap.killTweensOf(panelNode);
      gsap.fromTo(
        panelNode,
        {
          borderColor: tone.edge,
          boxShadow: tone.glow,
        },
        {
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0), inset 0 1px 0 rgba(255,255,255,0.04)",
          duration: 0.75,
          ease: "power3.out",
        },
      );
    }

    if (charNode) {
      gsap.killTweensOf(charNode);
      gsap.fromTo(
        charNode,
        {
          scale: isCorrect ? 0.9 : 1,
          y: isCorrect ? 6 : 0,
          x: 0,
          transformOrigin: "50% 70%",
        },
        {
          scale: 1,
          y: 0,
          x: tone.x,
          duration: isCorrect ? 0.22 : 0.08,
          ease: isCorrect ? "back.out(3)" : "power1.out",
          yoyo: !isCorrect,
          repeat: isCorrect ? 0 : 1,
        },
      );
    }
  };

  return (
    <section
      ref={shellRef}
      className="relative isolate mx-auto flex h-full max-h-full min-h-0 w-full min-w-0 max-w-full lg:max-w-[1240px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,20,27,0.96),rgba(6,8,12,0.98))] px-4 py-4 shadow-[0_48px_160px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-[2.4rem] sm:px-5 sm:py-5 lg:px-6 lg:py-6"
      onClick={() => ghostInputRef.current?.focus()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_22%,rgba(201,142,74,0.14),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(125,211,252,0.08),transparent_18%),linear-gradient(to_right,rgba(245,239,230,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.03)_1px,transparent_1px)] bg-[size:auto,auto,72px_72px,72px_72px]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.05] to-transparent" />
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
        className="absolute right-[10%] top-12 h-64 w-64 rounded-full bg-[#7dd3fc]/10 blur-3xl"
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
        onKeyDown={(event) => handleKeyDown(event, triggerKeyFeedback)}
        onChange={() => {}}
        className="pointer-events-none absolute opacity-0"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Typing input"
      />

      <div ref={topBarRef} className="relative z-10 min-w-0 grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
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

        <div className="flex min-w-0 flex-wrap items-center justify-end gap-3 xl:pl-3">
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

      <div className="relative z-10 min-h-0 min-w-0 flex-1 px-1 py-3 sm:px-2 sm:py-4">
        {isComplete ? (
          <TypingResultsView
            wpm={wpm}
            accuracy={accuracy}
            timeTakenSeconds={elapsedMs / 1000}
            grossWpm={grossWpm}
            correctChars={correctChars}
            typedChars={typedChars}
            incorrectChars={incorrectChars}
            duration={duration}
            practiceMode={practiceMode}
            onRestart={handleReset}
            heatmapByKey={heatmapByKey}
            maxHeatLatencyMs={maxHeatLatencyMs}
            burstSeries={burstSeries}
            burstPolyline={burstPolyline}
            slowestCategory={slowestCategory}
          />
        ) : (
          <div
            ref={liveContentRef}
            className="minimal-scrollbar flex h-full w-full min-w-0 flex-col items-center justify-center overflow-y-auto overflow-x-hidden pb-4 pt-3 sm:pb-6 sm:pt-5"
          >
            <div
              ref={timerRef}
              className="font-mono text-[3rem] font-semibold tracking-[-0.08em] text-[#f0ab3c] drop-shadow-[0_0_18px_rgba(240,171,60,0.35)] sm:text-[4rem] lg:text-[4.8rem]"
            >
              {timeLeft}
            </div>

            <div
              ref={promptPanelRef}
              className="relative mt-6 w-full min-w-0 max-w-[72rem] overflow-hidden rounded-[1.8rem] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012))] px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:mt-7 sm:px-7 sm:py-7 lg:px-10 lg:py-9"
            >
              <div
                ref={feedbackFlashRef}
                className="pointer-events-none absolute inset-0 opacity-0"
                aria-hidden="true"
              />
              <p
                ref={textRef}
                className={`flex flex-wrap gap-y-3 tracking-[-0.05em] ${
                  practiceMode === "code"
                    ? "font-mono text-[0.95rem] leading-[1.82] sm:text-[1.08rem] sm:leading-[1.9] lg:text-[1.2rem] lg:leading-[2]"
                    : "text-[1.28rem] leading-[1.7] sm:text-[1.55rem] sm:leading-[1.76] lg:text-[1.95rem] lg:leading-[1.8]"
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
                    <span
                      key={`${char}-${index}`}
                      ref={(node) => {
                        charRefs.current[index] = node;
                      }}
                      className="relative inline-flex items-center"
                    >
                      {isCurrent ? (
                        <span
                          ref={cursorRef}
                          aria-hidden="true"
                          className="mr-1 inline-block h-[1.08em] w-[3px] rounded-full bg-[#f0ab3c] shadow-[0_0_18px_rgba(240,171,60,0.8)]"
                        />
                      ) : null}
                      <span className={`transition-colors duration-150 ${tone} ${char === " " ? "w-[0.38em]" : ""}`}>
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
              {hasStarted ? "stay loose. every key updates live." : "start typing to begin..."}
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
