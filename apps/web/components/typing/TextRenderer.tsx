"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type TextRendererProps = {
  text: string;
  activeIndex?: number;
};

export default function TextRenderer({
  text,
  activeIndex = 0,
}: TextRendererProps) {
  const chars = text.split("");
  const charsRef = useRef<Array<HTMLSpanElement | null>>([]);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const visibleChars = charsRef.current.filter(
      (node): node is HTMLSpanElement => node !== null,
    );

    const context = gsap.context(() => {
      gsap.fromTo(
        visibleChars,
        { y: 18, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.015,
          ease: "power3.out",
        },
      );

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.7,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    });

    return () => context.revert();
  }, []);

  return (
    <div className="relative rounded-[2rem] border border-white/10 bg-[#111823]/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(245,239,230,0.06),transparent_45%)]" />
      <p className="relative flex flex-wrap gap-y-3 text-[1.65rem] leading-[1.9] font-medium tracking-[-0.04em] text-[#f5efe6] sm:text-[2.1rem]">
        {chars.map((char, index) => {
          const isSpace = char === " ";
          const isActive = index === activeIndex;

          return (
            <span key={`${char}-${index}`} className="relative inline-flex items-center">
              {isActive ? (
                <span
                  ref={cursorRef}
                  aria-hidden="true"
                  className="mr-1 inline-block h-[1.35em] w-[3px] rounded-full bg-[#c98e4a] shadow-[0_0_18px_rgba(201,142,74,0.9)]"
                />
              ) : null}
              <span
                ref={(node) => {
                  charsRef.current[index] = node;
                }}
                className={`inline-block ${
                  isActive
                    ? "text-[#fffaf2]"
                    : "text-[#f5efe6]/78"
                } ${isSpace ? "w-[0.38em]" : ""}`}
              >
                {isSpace ? "\u00A0" : char}
              </span>
            </span>
          );
        })}
      </p>
    </div>
  );
}
