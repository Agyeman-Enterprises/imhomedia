"use client";

import { useState, useEffect } from "react";

const STREAM_URL = "https://stream.radio.co/s2317d93eb/listen";

function WaveformBars() {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] rounded-full bg-gradient-to-t from-red-500 to-purple-500"
          style={{ animationDelay: `${i * 0.15}s`, height: "12px" }}
        />
      ))}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="animate-pulse-glow inline-flex items-center gap-2 rounded-full bg-red-600/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      Live 24/7
    </span>
  );
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const togglePlay = () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const a = new Audio(STREAM_URL);
      a.play();
      setAudio(a);
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-purple-900/20 blur-[120px]"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-red-900/15 blur-[100px]"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />
        <div className="absolute top-1/3 left-1/2 h-[50vh] w-[50vw] -translate-x-1/2 rounded-full bg-violet-800/10 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-red-600">
            <span className="text-lg font-black">IM</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            IMHO<span className="text-purple-400"> Media</span>
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
          <a href="#listen" className="transition hover:text-white">Listen</a>
          <a href="#about" className="transition hover:text-white">About</a>
          <a href="#genres" className="transition hover:text-white">Genres</a>
          <a href="/submit" className="transition hover:text-white">Submit Your Track</a>
          <a href="https://wavcraft.vercel.app" target="_blank" className="transition hover:text-white">WavCraft</a>
        </div>
        <button
          onClick={togglePlay}
          className="rounded-full bg-gradient-to-r from-purple-600 to-red-600 px-5 py-2 text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
        >
          {isPlaying ? "Pause" : "Listen Now"}
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <LiveBadge />

        <h1 className="mt-8 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl">
          <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Welcome to
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
            IMHO Radio
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
          <span className="font-semibold text-white/90">Unfiltered. Unbothered. Unapologetically Us.</span>
          <br />
          Where the signal cuts through the noise. From sharp-witted podcasts to
          genre-bending music to our own 24/7 stream — curated for minds that
          question, rebel, and remix.
        </p>

        {/* Play Button */}
        <button
          onClick={togglePlay}
          id="listen"
          className="group mt-10 flex items-center gap-4 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-red-600 px-8 py-4 text-lg font-bold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition group-hover:bg-white/25">
            {isPlaying ? (
              <svg className="h-6 w-6" fill="white" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="h-6 w-6 ml-0.5" fill="white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
          {isPlaying ? "Now Playing" : "Start Listening"}
          {isPlaying && <WaveformBars />}
        </button>

        <p className="mt-4 text-sm text-white/30">
          Mixed Heritage Beats — 24/7 AI-Generated Fusion
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="h-6 w-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-black md:text-4xl">
                The World&apos;s First{" "}
                <span className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                  All-AI Music Station
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/60">
                Every single track on IMHO Radio was composed, arranged, and
                produced by artificial intelligence. No session musicians. No
                sampling. No apologies.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-white/60">
                Built with{" "}
                <a
                  href="https://wavcraft.vercel.app"
                  target="_blank"
                  className="font-semibold text-purple-400 underline decoration-purple-400/30 underline-offset-4 transition hover:text-purple-300"
                >
                  WavCraft
                </a>
                , our open-source AI music engine that lets anyone create
                professional-quality audio from a text prompt.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "300+", label: "AI Tracks", icon: "disc" },
                { value: "24/7", label: "Streaming", icon: "radio" },
                { value: "9", label: "Genre Fusions", icon: "layers" },
                { value: "0", label: "Human Musicians", icon: "user" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 text-center backdrop-blur-sm transition hover:border-purple-500/20 hover:bg-white/[0.06]"
                >
                  <div className="text-3xl font-black bg-gradient-to-br from-purple-400 to-red-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section id="genres" className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black md:text-4xl">
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
              Mixed Heritage Beats
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
            Our AI doesn&apos;t respect genre boundaries. It mashes up decades of
            musical DNA into something that shouldn&apos;t work — but does.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
          {[
            { name: "Soul / R&B", pct: "35%", color: "from-purple-500 to-pink-500" },
            { name: "Jazz", pct: "15%", color: "from-blue-500 to-cyan-500" },
            { name: "Reggae", pct: "12%", color: "from-green-500 to-emerald-500" },
            { name: "Latin", pct: "10%", color: "from-orange-500 to-yellow-500" },
            { name: "Hip-Hop", pct: "10%", color: "from-red-500 to-orange-500" },
            { name: "Pop", pct: "8%", color: "from-pink-500 to-rose-500" },
            { name: "Classical Fusion", pct: "5%", color: "from-indigo-500 to-purple-500" },
            { name: "Gospel", pct: "3%", color: "from-amber-500 to-yellow-500" },
            { name: "Workout", pct: "2%", color: "from-red-600 to-red-500" },
          ].map((genre) => (
            <div
              key={genre.name}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] px-5 py-3 transition hover:border-white/10 hover:bg-white/[0.06]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${genre.color} opacity-0 transition group-hover:opacity-10`}
              />
              <span className="relative font-semibold">{genre.name}</span>
              <span className="relative ml-2 text-sm text-white/40">{genre.pct}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/30">
          Inspired by Marvin Gaye, Bob Marley, Dave Brubeck, Fela Kuti, and 50+
          albums of eclectic human genius — remixed by AI.
        </p>
      </section>

      {/* BYOM Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-orange-500/10 bg-gradient-to-br from-orange-900/15 via-transparent to-red-900/15 p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-black md:text-4xl">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Bring Your Own Music
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/50">
              IMHO Radio isn&apos;t just AI. It&apos;s YOUR music too. Upload your track,
              we&apos;ll play it if it slaps. Indie artists, bedroom producers, game
              composers — we&apos;re YOUR platform.
            </p>
            <a
              href="/submit"
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-8 py-3 font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
            >
              Submit Your Track
            </a>
          </div>
        </div>
      </section>

      {/* WavCraft CTA Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-purple-900/20 via-transparent to-red-900/20 p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-black md:text-4xl">
              Make Your Own Music
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/50">
              WavCraft is the AI music engine behind IMHO Radio. Type a prompt,
              get a track. It&apos;s that simple. Built for indie game devs, content
              creators, and anyone who thinks music should be free.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://wavcraft.vercel.app"
                target="_blank"
                className="rounded-full bg-gradient-to-r from-purple-600 to-red-600 px-8 py-3 font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                Try WavCraft Free
              </a>
              <a
                href="https://github.com/Agyeman-Enterprises/wavcraft"
                target="_blank"
                className="rounded-full border border-white/10 px-8 py-3 font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
              >
                View Source
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-red-600 text-sm font-black">
              IM
            </div>
            <span className="font-bold">
              IMHO Media
            </span>
            <span className="text-sm text-white/30">
              &apos;S Truth. Just Saying!
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="/submit" className="transition hover:text-white">
              Submit a Track
            </a>
            <span className="text-white/10">|</span>
            <a href="https://wavcraft.vercel.app" target="_blank" className="transition hover:text-white">
              WavCraft
            </a>
            <span className="text-white/10">|</span>
            <span>Powered by <a href="https://wavcraft.vercel.app" target="_blank" className="text-purple-400 hover:text-purple-300">WavCraft AI</a> (beta). Zero human musicians. Zero apologies.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
