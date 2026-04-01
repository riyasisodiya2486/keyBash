import type { ReactNode } from "react";
import Link from "next/link";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M21.805 12.23c0-.72-.064-1.412-.184-2.077H12v3.93h5.5a4.703 4.703 0 0 1-2.042 3.087v2.564h3.305c1.935-1.781 3.042-4.408 3.042-7.504Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.075-.915 6.763-2.478l-3.305-2.564c-.915.612-2.085.973-3.458.973-2.656 0-4.905-1.793-5.71-4.203H2.874v2.645A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.29 13.728A5.99 5.99 0 0 1 5.97 12c0-.6.109-1.18.32-1.728V7.627H2.874A10 10 0 0 0 2 12c0 1.61.385 3.135 1.074 4.373l3.216-2.645Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.07c1.5 0 2.847.516 3.909 1.526l2.931-2.931C17.07 3.016 14.755 2 12 2A10 10 0 0 0 3.074 7.627l3.216 2.645C7.095 7.862 9.344 6.07 12 6.07Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.59 2 12.252c0 4.53 2.865 8.374 6.839 9.73.5.095.682-.223.682-.495 0-.244-.009-.89-.014-1.747-2.782.62-3.369-1.393-3.369-1.393-.454-1.186-1.11-1.501-1.11-1.501-.908-.636.068-.623.068-.623 1.004.072 1.532 1.057 1.532 1.057.892 1.57 2.341 1.117 2.91.854.09-.664.35-1.117.636-1.374-2.221-.259-4.555-1.14-4.555-5.075 0-1.121.39-2.037 1.03-2.755-.103-.26-.446-1.304.098-2.718 0 0 .84-.277 2.75 1.052A9.303 9.303 0 0 1 12 6.838a9.27 9.27 0 0 1 2.504.35c1.909-1.329 2.748-1.052 2.748-1.052.546 1.414.203 2.458.1 2.718.64.718 1.028 1.634 1.028 2.755 0 3.945-2.338 4.813-4.566 5.067.36.319.68.947.68 1.909 0 1.378-.012 2.49-.012 2.828 0 .275.18.595.688.494A10.258 10.258 0 0 0 22 12.252C22 6.59 17.523 2 12 2Z" />
    </svg>
  );
}

function SocialButton({
  icon,
  label,
  description,
}: {
  icon: ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-between rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#c98e4a]/40 hover:bg-white/[0.08]"
    >
      <span className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#f5efe6] text-[#16120d] shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
          {icon}
        </span>
        <span>
          <span className="block font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
            Continue with
          </span>
          <span className="mt-1 block text-lg font-semibold tracking-[-0.04em] text-[#f5efe6]">
            {label}
          </span>
        </span>
      </span>
      <span className="text-sm text-[#b8aa98] transition group-hover:text-[#f5efe6]">
        {description}
      </span>
    </button>
  );
}

function FormField({
  label,
  type,
  placeholder,
  className = "",
}: {
  label: string;
  type: string;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2.5 w-full rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#f5efe6] outline-none transition placeholder:text-[#6f655a] focus:border-[#c98e4a]/50 focus:bg-white/[0.06]"
      />
    </label>
  );
}

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d1117] text-[#f5efe6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_rgba(201,142,74,0.22),_transparent_26%),radial-gradient(circle_at_84%_16%,_rgba(255,255,255,0.08),_transparent_18%),linear-gradient(180deg,_rgba(14,17,23,0.98),_rgba(8,10,14,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,239,230,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,239,230,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      <div className="absolute left-[8%] top-28 h-64 w-64 rounded-full bg-[#d7b384]/18 blur-3xl" />
      <div className="absolute right-[10%] top-20 h-72 w-72 rounded-full bg-[#c98e4a]/14 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-10">
        <div className="grid w-full gap-6 xl:grid-cols-[0.88fr_1.12fr]">
          <section className="flex flex-col justify-between rounded-[2.3rem] border border-white/8 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:p-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#b8aa98] transition hover:bg-white/[0.08] hover:text-[#f5efe6]"
              >
                Back home
              </Link>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#c98e4a]/20 bg-[#c98e4a]/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-[#d7b384]">
                <span className="h-2 w-2 rounded-full bg-[#c98e4a]" />
                Player access
              </div>

              <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#f5efe6] sm:text-5xl">
                Sign in and get back to the arena.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#b8aa98] sm:text-base">
                Clean, fast access for players who want to practice, race, and
                track their progress without friction.
              </p>
            </div>

          </section>

          <section className="relative overflow-hidden rounded-[2.3rem] border border-white/8 bg-[linear-gradient(180deg,rgba(245,239,230,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:p-8">
            <div className="absolute inset-x-8 top-24 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            <div className="absolute right-8 top-8 rounded-full border border-[#c98e4a]/20 bg-[#c98e4a]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d7b384]">
              New season
            </div>

            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8f816f]">
                Welcome back
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-[#f5efe6] sm:text-3xl">
                Pick your sign-in method
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#b8aa98] sm:text-base">
                Social auth only for now. These buttons are design-ready and can
                be connected to real authentication later.
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <SocialButton icon={<GoogleIcon />} label="Google" description="Fast sync" />
              <SocialButton icon={<GitHubIcon />} label="GitHub" description="Dev mode" />
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f816f]">
                Or use your details
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form className="mt-6 rounded-[1.5rem] border border-white/8 bg-[#0f141b] p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  className="md:col-span-1"
                />
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  className="md:col-span-1"
                />
              </div>
              <FormField
                className="mt-4"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />

              <button
                type="submit"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#f5efe6] px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-[#16120d] transition hover:bg-[#fffaf2]"
              >
                Sign in manually
              </button>
            </form>

            <div className="mt-4 rounded-[1.5rem] border border-white/8 bg-[#0f141b] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#8f816f]">
                    Account note
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[#b8aa98]">
                    No backend auth is connected yet. This page is currently UI
                    only, exactly as requested.
                  </p>
                </div>
                <div className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#8f816f]">
                  UI only
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
