"use client";

import { useEffect, useState } from "react";

const words = ["keystroke", "race", "session", "match"];

export default function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block h-[1em] min-w-[8ch] overflow-hidden align-baseline text-[#d7b384]">
      {words.map((word, wordPosition) => (
        <span
          key={word}
          className={`absolute left-0 top-0 block whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            wordPosition === index
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
