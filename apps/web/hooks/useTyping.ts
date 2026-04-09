"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { generateText } from "@/utils/generateText";
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
} from "@/components/typing/analytics";
import type {
  Difficulty,
  KeyPressSample,
  PracticeMode,
  TypingDuration,
} from "@/components/typing/types";

type UseTypingOptions = {
  defaultPracticeMode?: PracticeMode;
  defaultDifficulty?: Difficulty;
  defaultDuration?: TypingDuration;
};

export function useTyping({
  defaultPracticeMode = "words",
  defaultDifficulty = "easy",
  defaultDuration = 30,
}: UseTypingOptions = {}) {
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(defaultPracticeMode);
  const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty);
  const [duration, setDuration] = useState<TypingDuration>(defaultDuration);
  const [prompt, setPrompt] = useState(() => generateText(defaultPracticeMode, defaultDifficulty));
  const [typedText, setTypedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [keyHistory, setKeyHistory] = useState<KeyPressSample[]>([]);

  const ghostInputRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);

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

  const focusInput = useCallback(() => {
    ghostInputRef.current?.focus();
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetSession = useCallback((
    nextPrompt = generateText(practiceMode, difficulty),
    nextTimeLeft = duration,
  ) => {
    clearTimer();

    setPrompt(nextPrompt);
    setTypedText("");
    setTimeLeft(nextTimeLeft);
    setHasStarted(false);
    setIsComplete(false);
    setStartTime(null);
    setElapsedMs(0);
    setKeyHistory([]);
    lastKeyTimeRef.current = null;
    focusInput();
  }, [clearTimer, difficulty, duration, focusInput, practiceMode]);

  const completeRun = useCallback((completedAt = startTime, explicitElapsedMs?: number) => {
    clearTimer();

    if (explicitElapsedMs !== undefined) {
      const boundedElapsedMs = Math.max(explicitElapsedMs, 0);
      setElapsedMs(boundedElapsedMs);
      setTimeLeft(Math.max(duration - Math.ceil(boundedElapsedMs / 1000), 0));
    } else if (startTime !== null && completedAt !== null) {
      const boundedElapsedMs = Math.max(completedAt - startTime, 0);
      setElapsedMs(boundedElapsedMs);
      setTimeLeft(Math.max(duration - Math.ceil(boundedElapsedMs / 1000), 0));
    }

    setIsComplete(true);
  }, [clearTimer, duration, startTime]);

  const handleReset = useCallback(() => {
    resetSession();
  }, [resetSession]);

  const handlePracticeModeChange = useCallback((nextMode: PracticeMode) => {
    setPracticeMode(nextMode);
    resetSession(generateText(nextMode, difficulty));
  }, [difficulty, resetSession]);

  const handleDifficultyChange = useCallback((nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty);
    resetSession(generateText(practiceMode, nextDifficulty));
  }, [practiceMode, resetSession]);

  const handleDurationChange = useCallback((nextDuration: TypingDuration) => {
    setDuration(nextDuration);
    resetSession(generateText(practiceMode, difficulty), nextDuration);
  }, [difficulty, practiceMode, resetSession]);

  const handleKeyDown = useCallback((
    event: KeyboardEvent<HTMLInputElement>,
    onCharacterInput?: (isCorrect: boolean, charIndex: number) => void,
  ) => {
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
      focusInput();
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
    const isCorrect = typedChar === expectedChar;

    onCharacterInput?.(isCorrect, currentIndex);

    setKeyHistory((current) => [...current, {
      expectedChar,
      typedChar,
      correct: isCorrect,
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
  }, [
    completeRun,
    currentIndex,
    focusInput,
    handleReset,
    hasStarted,
    isComplete,
    prompt,
    promptChars,
    typedText,
  ]);

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
        clearTimer();
        setElapsedMs(duration * 1000);
        setTimeLeft(0);
        setIsComplete(true);
      }
    }, 100);

    return clearTimer;
  }, [clearTimer, duration, hasStarted, isComplete, startTime]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const handleWindowKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      resetSession();
    };

    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isComplete, resetSession]);

  return {
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
    keyHistory,
    maxHeatLatencyMs,
    practiceMode,
    progress,
    prompt,
    promptChars,
    resetSession,
    slowestCategory,
    startTime,
    timeLeft,
    typedChars,
    typedText,
    wpm,
  };
}
