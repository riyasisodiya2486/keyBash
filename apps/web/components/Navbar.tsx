
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([brandRef.current, actionsRef.current], {
        autoAlpha: 0,
        y: -24,
      });

      gsap.fromTo(
        navRef.current,
        { autoAlpha: 0, y: -32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        },
      );

      gsap.to([brandRef.current, actionsRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.12,
      });

      if (ctaRef.current) {
        gsap.to(ctaRef.current, {
          y: -4,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <header className="relative z-20 px-4 pt-4 sm:px-6 lg:px-10">
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-full border border-white/8 bg-[rgba(16,19,25,0.72)] px-5 py-3 text-[#f5efe6] shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-2xl sm:px-7"
      >
        <div
          ref={brandRef}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/8 bg-[#f5efe6] text-[11px] font-medium uppercase tracking-[0.3em] text-[#16120d]">
            KB
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold uppercase tracking-[0.18em] text-[#f5efe6]">
              KeyBash
            </span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#8f816f]">
              Competitive typing lab
            </span>
          </div>
        </div>

        <div
          ref={actionsRef}
          className="ml-auto flex shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] p-1.5"
        >
          <Link
            href="#"
            className="hidden h-11 items-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.24em] text-[#b8aa98] transition hover:bg-white/[0.06] hover:text-[#f5efe6] sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            ref={ctaRef}
            href="#"
            className="inline-flex h-11 items-center gap-3 rounded-full bg-[#f5efe6] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#16120d] transition duration-300 hover:scale-[1.02] hover:bg-[#fffaf2]"
          >
            Start typing
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c98e4a] text-[10px] text-[#16120d]">
              Go
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
