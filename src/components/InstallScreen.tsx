import { useEffect, useState } from 'react';
import { Shield, Sparkles, Film, ChevronRight } from 'lucide-react';
import { fetchShowcaseShows } from '@/lib/api';
import type { Show } from '@/lib/types';

interface InstallScreenProps {
  /** already signed in — go straight to the app */
  hasSession: boolean;
  onEnter: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function InstallScreen({
  hasSession,
  onEnter,
  onSignIn,
  onSignUp,
}: InstallScreenProps) {
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    let active = true;
    fetchShowcaseShows(8)
      .then((data) => {
        if (active) setShows(data);
      })
      .catch(() => {
        if (active) setShows([]);
      });
    return () => {
      active = false;
    };
  }, []);

  // Use one of the fetched posters/banners as a soft blurred backdrop —
  // this is content the admin uploaded themselves, never a third-party image.
  const backdrop = shows.find((s) => s.banner_url)?.banner_url ?? shows[0]?.poster_url ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F] text-white flex flex-col">
      {/* Backdrop from your own catalog, heavily blurred + darkened */}
      {backdrop && (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 blur-2xl scale-110"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 20% 10%, rgba(76,201,80,0.16) 0%, rgba(10,10,15,0) 45%), radial-gradient(circle at 80% 90%, rgba(76,201,80,0.08) 0%, rgba(10,10,15,0) 45%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/60 to-[#0A0A0F]" />

      <div className="relative z-10 flex flex-1 flex-col items-center px-6 py-10 sm:py-14">
        {/* Logo mark */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <img
            src="/assets/images/logo-transparent.png"
            alt="NINT ANIME"
            className="h-24 w-24 sm:h-28 sm:w-28 drop-shadow-[0_0_25px_rgba(76,201,80,0.45)]"
          />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/50">
            Stream · Discover · Obsess
          </p>
        </div>

        {/* Hero copy */}
        <div className="max-w-xl text-center">
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            Thousands of episodes.
            <br />
            <span className="bg-gradient-to-r from-[#7CFC7C] to-[#3FA34D] bg-clip-text text-transparent">
              One universe of stories.
            </span>
          </h2>
        </div>

        {/* Movie/show poster grid — pulled live from the catalog */}
        {shows.length > 0 && (
          <div className="mt-6 grid w-full max-w-2xl grid-cols-4 gap-2.5 sm:gap-3">
            {shows.slice(0, 8).map((show) => (
              <div
                key={show.id}
                className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#14141C]"
              >
                {show.poster_url ? (
                  <img
                    src={show.poster_url}
                    alt={show.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Film className="h-6 w-6 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1.5">
                  <p className="truncate text-[10px] font-semibold text-white">{show.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feature pills */}
        <div className="mt-6 grid w-full max-w-lg grid-cols-3 gap-3">
          {[
            { icon: Film, label: 'Movies & series' },
            { icon: Shield, label: 'Ad-free' },
            { icon: Sparkles, label: 'Originals' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <Icon className="h-5 w-5 text-[#4CC950]" />
              <span className="text-xs font-medium text-white/70">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-8 w-full max-w-sm">
          {hasSession ? (
            <button
              onClick={onEnter}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4CC950] to-[#2E9E38] px-6 py-4 text-base font-semibold text-white shadow-[0_10px_30px_rgba(76,201,80,0.35)] transition hover:shadow-[0_14px_40px_rgba(76,201,80,0.5)] active:scale-[0.98]"
            >
              Enter NINT ANIME
              <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={onSignUp}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4CC950] to-[#2E9E38] px-6 py-4 text-base font-semibold text-white shadow-[0_10px_30px_rgba(76,201,80,0.35)] transition hover:shadow-[0_14px_40px_rgba(76,201,80,0.5)] active:scale-[0.98]"
              >
                Create Account
                <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
              <button
                onClick={onSignIn}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-4 text-base font-semibold text-white transition hover:bg-white/[0.08] active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          )}
          <p className="mt-4 text-center text-xs text-white/40">
            By entering you agree to our Terms &amp; Privacy Policy
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/5 px-6 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-white/40">
          <span>© 2026 NINT ANIME</span>
          <div className="flex items-center gap-5">
            <span className="cursor-pointer transition hover:text-white/70">Help</span>
            <span className="cursor-pointer transition hover:text-white/70">Privacy</span>
            <span className="cursor-pointer transition hover:text-white/70">Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
