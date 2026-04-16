import Link from "next/link";

export default function MultiplayerPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d1117] text-[#f5efe6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(201,142,74,0.22),_transparent_26%),radial-gradient(circle_at_84%_16%,_rgba(255,255,255,0.08),_transparent_18%),linear-gradient(180deg,_rgba(14,17,23,0.98),_rgba(8,10,14,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12 text-center sm:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 shadow-[0_28px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#8f816f]">
            Multiplayer
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-5xl">
            Join the live typing arena.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#b8aa98] sm:text-base">
            Battle other players in real time with synced text, instant results, and a fast, immersive experience.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href="/practice"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#f5efe6] transition hover:border-[#c98e4a]/40 hover:bg-white/[0.08]"
            >
              Practice mode
            </Link>
            <Link
              href="/"
              className="rounded-full bg-[#c98e4a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#16120d] transition hover:bg-[#edb46b]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
