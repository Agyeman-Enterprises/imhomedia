"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const STREAM_URL = "https://stream.radio.co/s2317d93eb/listen";

function WaveformBars() {
  return (
    <div className="flex items-end gap-[3px] h-8">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] rounded-full bg-gradient-to-t from-[#c9a84c] to-[#dc2626]"
          style={{ animationDelay: `${i * 0.15}s`, height: "12px" }}
        />
      ))}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="animate-pulse-glow inline-flex items-center gap-2 rounded-full bg-[#c9a84c]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black">
      <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
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
      const a = audio || new Audio(STREAM_URL);
      a.onerror = () => {
        setIsPlaying(false);
        setAudio(null);
      };
      a.play()
        .then(() => {
          setAudio(a);
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
          setAudio(null);
        });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background — Jungkir-inspired red blobs + dark navy */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-red-900/15 blur-[120px]"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-[#c9a84c]/8 blur-[100px]"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />
        <div className="absolute top-1/3 left-1/2 h-[50vh] w-[50vw] -translate-x-1/2 rounded-full bg-red-800/8 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-3">
          <Image
            src="/imho-logo-nav.jpg"
            alt="IMHO Media"
            width={44}
            height={26}
            className="rounded"
          />
          <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-raleway)]">
            IMHO<span className="text-[#c9a84c]"> Media</span>
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
          <a href="#listen" className="transition hover:text-[#c9a84c]">Listen</a>
          <a href="#about" className="transition hover:text-[#c9a84c]">About</a>
          <a href="#genres" className="transition hover:text-[#c9a84c]">Genres</a>
          <a href="/submit" className="transition hover:text-[#c9a84c]">Submit Your Track</a>
          <a href="https://wavcraft.vercel.app" target="_blank" className="transition hover:text-[#c9a84c]">WavCraft</a>
        </div>
        <button
          onClick={togglePlay}
          className="rounded-full bg-gradient-to-r from-[#c9a84c] to-[#dc2626] px-5 py-2 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#c9a84c]/25"
        >
          {isPlaying ? "Pause" : "Listen Now"}
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
        <LiveBadge />

        {/* Logo */}
        <div className="mt-8 relative">
          <div className="absolute inset-0 rounded-full bg-[#c9a84c]/10 blur-[60px] scale-150" />
          <Image
            src="/imho-logo-hero.jpg"
            alt="IMHO Media — S'Truth. Just Saying!"
            width={400}
            height={240}
            priority
            className="relative rounded-xl shadow-2xl shadow-[#c9a84c]/20"
          />
        </div>

        <h1 className="mt-8 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl lg:text-8xl font-[family-name:var(--font-raleway)]">
          <span className="bg-gradient-to-r from-[#e8d5a8] via-white to-[#e8d5a8] bg-clip-text text-transparent">
            Welcome to
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#c9a84c] via-[#dc2626] to-[#c9a84c] bg-clip-text text-transparent">
            IMHO Radio
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
          <span className="font-semibold text-[#e8d5a8]">S&apos;Truth. Just Saying!</span>
          <br />
          Where the signal cuts through the noise. From sharp-witted podcasts to
          genre-bending music to our own 24/7 stream — curated for minds that
          question, rebel, and remix.
        </p>

        {/* Play Button */}
        <button
          onClick={togglePlay}
          id="listen"
          className="group mt-10 flex items-center gap-4 rounded-full bg-gradient-to-r from-[#c9a84c] via-[#dc2626] to-[#c9a84c] px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#c9a84c]/30"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-sm transition group-hover:bg-black/30">
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

        <p className="mt-4 text-sm text-[#c9a84c]/50">
          Mixed Heritage Beats — 24/7 AI-Generated Fusion
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="h-6 w-6 text-[#c9a84c]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-black md:text-4xl font-[family-name:var(--font-raleway)]">
                The World&apos;s First{" "}
                <span className="bg-gradient-to-r from-[#c9a84c] to-[#dc2626] bg-clip-text text-transparent">
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
                  className="font-semibold text-[#c9a84c] underline decoration-[#c9a84c]/30 underline-offset-4 transition hover:text-[#e8d5a8]"
                >
                  WavCraft
                </a>
                , our open-source AI music engine that lets anyone create
                professional-quality audio from a text prompt.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "300+", label: "AI Tracks" },
                { value: "24/7", label: "Streaming" },
                { value: "9", label: "Genre Fusions" },
                { value: "0", label: "Human Musicians" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#c9a84c]/10 bg-white/[0.03] p-6 text-center backdrop-blur-sm transition hover:border-[#c9a84c]/30 hover:bg-white/[0.06]"
                >
                  <div className="text-3xl font-black bg-gradient-to-br from-[#c9a84c] to-[#dc2626] bg-clip-text text-transparent">
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
          <h2 className="text-3xl font-black md:text-4xl font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-[#c9a84c] via-[#dc2626] to-[#c9a84c] bg-clip-text text-transparent">
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
            { name: "Soul / R&B", pct: "35%", color: "from-[#c9a84c] to-[#dc2626]" },
            { name: "Jazz", pct: "15%", color: "from-blue-400 to-cyan-400" },
            { name: "Reggae", pct: "12%", color: "from-green-500 to-emerald-400" },
            { name: "Latin", pct: "10%", color: "from-[#c9a84c] to-orange-400" },
            { name: "Hip-Hop", pct: "10%", color: "from-[#dc2626] to-orange-500" },
            { name: "Pop", pct: "8%", color: "from-pink-500 to-rose-400" },
            { name: "Classical Fusion", pct: "5%", color: "from-[#e8d5a8] to-[#c9a84c]" },
            { name: "Gospel", pct: "3%", color: "from-amber-400 to-[#c9a84c]" },
            { name: "Workout", pct: "2%", color: "from-[#dc2626] to-red-500" },
          ].map((genre) => (
            <div
              key={genre.name}
              className="group relative overflow-hidden rounded-xl border border-[#c9a84c]/10 bg-white/[0.03] px-5 py-3 transition hover:border-[#c9a84c]/30 hover:bg-white/[0.06]"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${genre.color} opacity-0 transition group-hover:opacity-10`}
              />
              <span className="relative font-semibold">{genre.name}</span>
              <span className="relative ml-2 text-sm text-[#c9a84c]/60">{genre.pct}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/30">
          Inspired by Marvin Gaye, Bob Marley, Dave Brubeck, Fela Kuti, and 50+
          albums of eclectic human genius — remixed by AI.
        </p>
      </section>

      {/* Now Playing / Featured Section — Jungkir-inspired cards */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black md:text-4xl font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-white to-[#e8d5a8] bg-clip-text text-transparent">
              Hit Play and Explore
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/50">
            A world of limitless audio delights, streaming around the clock.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Soul Kitchen",
                desc: "Smooth R&B vibes with AI-generated vocals and warm bass lines. Perfect for late-night sessions.",
                tag: "Soul / R&B",
              },
              {
                title: "Digital Carnival",
                desc: "Latin-infused beats meet electronic production. Salsa rhythms reimagined through neural networks.",
                tag: "Latin Fusion",
              },
              {
                title: "Midnight Jazz Club",
                desc: "Cool jazz improvisations generated in real-time. Every listen is unique — the AI never repeats itself.",
                tag: "Jazz",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group rounded-2xl border border-[#c9a84c]/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition hover:border-[#c9a84c]/25 hover:shadow-lg hover:shadow-[#c9a84c]/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a84c]/20 to-[#dc2626]/20">
                  <svg className="h-6 w-6 text-[#c9a84c]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <span className="inline-block rounded-full bg-[#dc2626]/15 px-3 py-1 text-xs font-semibold text-[#dc2626]">
                  {card.tag}
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">{card.title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">{card.desc}</p>
                <button
                  onClick={togglePlay}
                  className="mt-4 text-sm font-semibold text-[#c9a84c] transition hover:text-[#e8d5a8]"
                >
                  Listen Now &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BYOM Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-[#dc2626]/15 bg-gradient-to-br from-[#dc2626]/10 via-transparent to-[#c9a84c]/10 p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-black md:text-4xl font-[family-name:var(--font-raleway)]">
              <span className="bg-gradient-to-r from-[#dc2626] to-[#c9a84c] bg-clip-text text-transparent">
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
              className="mt-8 inline-block rounded-full bg-gradient-to-r from-[#dc2626] to-[#c9a84c] px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#dc2626]/25"
            >
              Submit Your Track
            </a>
          </div>
        </div>
      </section>

      {/* WavCraft CTA Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-[#c9a84c]/10 bg-gradient-to-br from-[#c9a84c]/10 via-transparent to-[#dc2626]/10 p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-black md:text-4xl font-[family-name:var(--font-raleway)]">
              Make Your Own Music
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-white/50">
              WavCraft is the AI music engine behind IMHO Radio. Type a prompt,
              get a track. It&apos;s that simple. Built for indie game devs, content
              creators, and anyone who thinks music should be free.
            </p>
            <div className="mt-8">
              <a
                href="https://wavcraft.vercel.app"
                target="_blank"
                className="inline-block rounded-full bg-gradient-to-r from-[#c9a84c] to-[#dc2626] px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#c9a84c]/25"
              >
                Try WavCraft Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#c9a84c]/10 px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/imho-logo-nav.jpg"
              alt="IMHO Media"
              width={32}
              height={19}
              className="rounded"
            />
            <span className="font-bold font-[family-name:var(--font-raleway)]">
              IMHO Media
            </span>
            <span className="text-sm text-[#c9a84c]/50">
              S&apos;Truth. Just Saying!
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <a href="/submit" className="transition hover:text-[#c9a84c]">
              Submit a Track
            </a>
            <span className="text-[#c9a84c]/20">|</span>
            <a href="https://wavcraft.vercel.app" target="_blank" className="transition hover:text-[#c9a84c]">
              WavCraft
            </a>
            <span className="text-[#c9a84c]/20">|</span>
            <span>Powered by <a href="https://wavcraft.vercel.app" target="_blank" className="text-[#c9a84c] hover:text-[#e8d5a8]">WavCraft AI</a> (beta)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
