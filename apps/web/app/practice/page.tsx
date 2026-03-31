import TypingBox from "@/components/typing/TypingBox";

export default function PracticePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d1117] text-[#f5efe6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(201,142,74,0.24),_transparent_24%),radial-gradient(circle_at_88%_14%,_rgba(142,168,255,0.18),_transparent_20%),radial-gradient(circle_at_50%_100%,_rgba(255,255,255,0.06),_transparent_30%),linear-gradient(180deg,_rgba(13,17,23,0.98),_rgba(6,9,14,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[8%] top-24 h-64 w-64 rounded-full bg-[#c98e4a]/10 blur-3xl" />
      <div className="absolute right-[10%] top-20 h-72 w-72 rounded-full bg-[#8ea8ff]/12 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.05] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-10">
        <TypingBox />
      </div>
    </main>
  );
}
