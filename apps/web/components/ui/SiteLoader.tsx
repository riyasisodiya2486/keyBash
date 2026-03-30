"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SiteLoader() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const topPanelRef = useRef<HTMLDivElement | null>(null);
  const bottomPanelRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const progressValue = useRef({ value: 0 });
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(copyRef.current, { autoAlpha: 0, y: 24 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setHidden(true),
      });

      timeline
        .to(copyRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
        })
        .to(
          progressValue.current,
          {
            value: 100,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => setProgress(Math.round(progressValue.current.value)),
          },
          0.1,
        )
        .to(
          lineRef.current,
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0.1,
        )
        .to(copyRef.current, {
          autoAlpha: 0,
          y: -18,
          duration: 0.32,
          delay: 0.18,
        })
        .to(
          topPanelRef.current,
          {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "-=0.06",
        )
        .to(
          bottomPanelRef.current,
          {
            yPercent: 100,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "<",
        )
        .to(
          overlayRef.current,
          {
            autoAlpha: 0,
            duration: 0.2,
          },
          "-=0.18",
        );
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  if (hidden) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-transparent"
    >
      <div
        ref={topPanelRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0d1117]"
      />
      <div
        ref={bottomPanelRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0d1117]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

      <div
        ref={copyRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#f5efe6]"
      >
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-[#8f816f]">
          Loading experience
        </div>
        <div className="mt-8 text-5xl font-semibold tracking-[0.24em] sm:text-6xl">
          KEYBASH
        </div>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.42em] text-[#8f816f]">
          Competitive typing lab
        </div>

        <div className="mt-10 w-full max-w-sm">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
            <span>Preparing</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-3 h-px bg-white/10">
            <div
              ref={lineRef}
              className="h-px bg-[#d7b384]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
