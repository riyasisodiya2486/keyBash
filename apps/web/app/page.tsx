import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import RotatingWord from "@/components/ui/RotatingWord";

const stats = [
  { label: "Peak", value: "147 WPM" },
  { label: "Accuracy", value: "98.6%" },
  { label: "Wins", value: "124" },
];

const modes = [
  { label: "Solo", title: "Sharpen rhythm", accent: "bg-[#f5efe6] text-[#16120d]" },
  { label: "Race", title: "Enter the duel", accent: "bg-[#c98e4a] text-[#16120d]" },
  { label: "Ranked", title: "Climb faster", accent: "bg-white/[0.06] text-[#f5efe6]" },
];

const leaderboard = [
  { rank: "01", name: "Riya Sen", stat: "152" },
  { rank: "02", name: "Aaryan Das", stat: "149" },
  { rank: "03", name: "Mina Lee", stat: "145" },
];

const promptWords = ["focus", "speed", "rhythm", "burst", "finish", "glory"];

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.7rem] border border-white/8 bg-white/[0.04] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8f816f]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#f5efe6]">
        {value}
      </p>
    </div>
  );
}

function RaceLane({
  label,
  wpm,
  progress,
  tone,
}: {
  label: string;
  wpm: string;
  progress: string;
  tone: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/8 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
          {label}
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
          {progress}
        </p>
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f5efe6]">
        {wpm}
      </p>
      <div className="mt-5 h-2 rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: progress }} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1117] text-[#f5efe6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(201,142,74,0.2),_transparent_26%),radial-gradient(circle_at_88%_14%,_rgba(255,255,255,0.06),_transparent_18%),linear-gradient(180deg,_rgba(14,17,23,0.98),_rgba(8,10,14,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[6%] top-24 h-56 w-56 rounded-full bg-[#d7b384]/16 blur-3xl" />
      <div className="absolute right-[8%] top-24 h-72 w-72 rounded-full bg-[#c98e4a]/12 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/[0.05] to-transparent" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 lg:px-10">
        <section className="grid min-h-[calc(100vh-140px)] items-center gap-16 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.05] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#8f816f] shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
              <span className="h-2 w-2 rounded-full bg-[#c98e4a]" />
              Competitive typing arena
            </div>

            <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-[#f5efe6] sm:text-6xl lg:text-[6.6rem]">
              Enter the pressure.
              <span className="mt-2 block">
                Chase every <RotatingWord />
              </span>
            </h1>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-[#f5efe6] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.26em] text-[#16120d] transition hover:bg-[#fffaf2]"
              >
                Start solo run
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-[#c98e4a]/30 bg-[#c98e4a]/12 px-6 py-4 font-mono text-[11px] uppercase tracking-[0.26em] text-[#f5efe6] transition hover:bg-[#c98e4a]/18"
              >
                Join live race
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <MetricCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {modes.map((mode) => (
                <div
                  key={mode.label}
                  className="rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-4 shadow-[0_14px_35px_rgba(0,0,0,0.14)]"
                >
                  <span className={`inline-flex rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] ${mode.accent}`}>
                    {mode.label}
                  </span>
                  <p className="mt-6 text-xl font-medium tracking-[-0.04em] text-[#f5efe6]">
                    {mode.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="relative overflow-hidden rounded-[2.6rem] border border-white/8 bg-white/[0.05] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
              <div className="absolute inset-x-6 top-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8f816f]">
                    Live arena
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#f5efe6]">
                    You vs rival
                  </h2>
                </div>
                <div className="rounded-full border border-[#c98e4a]/20 bg-[#c98e4a]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d7b384]">
                  Match point
                </div>
              </div>

              <div className="mt-8 rounded-[1.8rem] border border-white/8 bg-[#0f141b] p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
                    Prompt
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
                    01:24
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {promptWords.map((word, index) => (
                    <span
                      key={word}
                      className={`rounded-xl px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] ${
                        index < 4
                          ? "bg-[#f5efe6] text-[#16120d]"
                          : "bg-white/[0.06] text-[#8f816f]"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <RaceLane
                  label="You"
                  wpm="132"
                  progress="78%"
                  tone="bg-[#f5efe6]"
                />
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c98e4a]/20 bg-[#c98e4a]/10 font-mono text-[11px] uppercase tracking-[0.22em] text-[#d7b384]">
                  VS
                </div>
                <RaceLane
                  label="Rival"
                  wpm="127"
                  progress="72%"
                  tone="bg-[#c98e4a]"
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MetricCard label="Accuracy" value="98.4%" />
                <MetricCard label="Combo" value="41" />
                <MetricCard label="Place" value="#08" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.4rem] border border-white/8 bg-white/[0.05] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.16)]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8f816f]">
                  Solo pressure
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#f5efe6]">
                  Train like a race even when you are alone.
                </h2>
              </div>
              <div className="hidden rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f] md:block">
                Focus mode
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.8rem] border border-white/8 bg-[#f5efe6] p-6 text-[#16120d]">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
                  Personal best
                </p>
                <p className="mt-6 text-6xl font-semibold tracking-[-0.07em]">
                  147
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em]">
                  WPM
                </p>
              </div>

              <div className="rounded-[1.8rem] border border-white/8 bg-white/[0.04] p-6">
                <div className="flex items-end gap-3">
                  {[28, 44, 36, 58, 54, 72, 68].map((height, index) => (
                    <div key={height} className="flex-1">
                      <div
                        className={`w-full rounded-full ${
                          index === 6 ? "bg-[#c98e4a]" : "bg-white/70"
                        }`}
                        style={{ height: `${height * 1.6}px` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f816f]">
                  <span>Consistency</span>
                  <span>7 runs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-white/8 bg-[#f5efe6] p-8 text-[#16120d] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8f816f]">
              Leaderboard
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Speed worth chasing.
            </h2>
            <div className="mt-8 space-y-3">
              {leaderboard.map((player, index) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between rounded-[1.5rem] border px-5 py-4 ${
                    index === 0
                      ? "border-[#c98e4a]/30 bg-[#16120d] text-[#f5efe6]"
                      : "border-black/8 bg-[#ebe4d8]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
                      {player.rank}
                    </span>
                    <span className="text-lg font-medium tracking-[-0.03em]">
                      {player.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#c98e4a]">
                    {player.stat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
