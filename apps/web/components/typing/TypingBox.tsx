"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import TextRenderer from "@/components/typing/TextRenderer";

const text = "The quick brown fox jumps over the lazy dog";

const stats = [
  { label: "WPM", value: "0" },
  { label: "Accuracy", value: "100%" },
  { label: "Mode", value: "Practice" },
];

export default function TypingBox() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<Array<HTMLDivElement | null>>([]);
  const orbLeftRef = useRef<HTMLDivElement | null>(null);
  const orbRightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const statsNodes = statsRef.current.filter(
      (node): node is HTMLDivElement => node !== null,
    );

    const context = gsap.context(() => {
      gsap.set([heroRef.current, badgeRef.current, cardRef.current], {
        opacity: 0,
      });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          heroRef.current,
          { y: 36, opacity: 0, filter: "blur(16px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 },
        )
        .fromTo(
          badgeRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.55",
        )
        .fromTo(
          cardRef.current,
          { y: 48, opacity: 0, rotateX: -8 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1 },
          "-=0.45",
        )
        .fromTo(
          statsNodes,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          "-=0.55",
        );

      gsap.to(orbLeftRef.current, {
        x: 26,
        y: 18,
        scale: 1.08,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(orbRightRef.current, {
        x: -22,
        y: -16,
        scale: 0.94,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, shellRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={shellRef}
      className="relative isolate overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] px-5 py-8 shadow-[0_30px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:px-8 sm:py-10 lg:px-10"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,transparent_65%,rgba(201,142,74,0.08))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.05)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
      <div
        ref={orbLeftRef}
        className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-[#d7b384]/18 blur-3xl"
      />
      <div
        ref={orbRightRef}
        className="absolute -right-12 bottom-4 h-56 w-56 rounded-full bg-[#6f88ff]/14 blur-3xl"
      />

      <div ref={badgeRef} className="relative z-10">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0f151d]/80 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#b4a18a]">
          <span className="h-2 w-2 rounded-full bg-[#c98e4a]" />
          Typing chamber
        </div>
      </div>

      <div
        ref={heroRef}
        className="relative z-10 mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8f816f]">
            Practice interface
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.07em] text-[#f5efe6] sm:text-6xl lg:text-[5.5rem]">
            Type inside a
            <span className="block bg-[linear-gradient(120deg,#f5efe6_0%,#d7b384_42%,#8ea8ff_100%)] bg-clip-text text-transparent">
              cinematic focus lane.
            </span>
          </h1>
        </div>

        <div className="max-w-md rounded-[1.7rem] border border-white/8 bg-[#0d1117]/80 p-5 text-sm leading-7 text-[#c4b7a7] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          Static UI only for now: rendered text, fake cursor, and a ready-made stats bar
          so we can wire logic in later without redoing layout or motion.
        </div>
      </div>

      <div
        ref={cardRef}
        className="relative z-10 mt-10 rounded-[2.2rem] border border-white/10 bg-[#0b1016]/90 p-4 shadow-[0_20px_90px_rgba(0,0,0,0.35)] sm:p-5"
        style={{ transformPerspective: "1200px" }}
      >
        <div className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8f816f]">
                Prompt
              </p>
              <p className="mt-2 text-sm text-[#c4b7a7]">
                Warm up with a classic pangram before we plug in timing and keystroke
                tracking.
              </p>
            </div>
            <div className="inline-flex items-center rounded-full border border-[#c98e4a]/20 bg-[#c98e4a]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#ddb98f]">
              UI Preview
            </div>
          </div>

          <div className="mt-6">
            <TextRenderer text={text} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                ref={(node) => {
                  statsRef.current[index] = node;
                }}
                className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
