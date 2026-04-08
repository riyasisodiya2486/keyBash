import TypingBox from "@/components/typing/TypingBox";

export default function PracticePage() {
  return (
    <main className="relative h-dvh overflow-hidden bg-[#06080c] text-[#f5efe6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,_rgba(201,142,74,0.2),_transparent_24%),radial-gradient(circle_at_88%_14%,_rgba(125,211,252,0.08),_transparent_18%),radial-gradient(circle_at_50%_100%,_rgba(255,255,255,0.04),_transparent_30%),linear-gradient(180deg,_rgba(8,10,14,1),_rgba(3,5,8,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[6%] top-20 h-72 w-72 rounded-full bg-[#c98e4a]/10 blur-3xl" />
      <div className="absolute right-[8%] top-16 h-80 w-80 rounded-full bg-[#7dd3fc]/10 blur-3xl" />
      <div className="absolute bottom-[-6rem] left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-[#c98e4a]/8 blur-3xl" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.05] to-transparent" />

      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-[1440px] items-center justify-center px-3 py-3 sm:px-5 sm:py-4 lg:px-8 lg:py-6">
        <TypingBox />
      </div>
    </main>
  );
}
