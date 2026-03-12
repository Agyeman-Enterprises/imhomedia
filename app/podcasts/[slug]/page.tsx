"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { SHOWS, type Episode } from "@/data/podcasts";
import { notFound } from "next/navigation";
import { use } from "react";

export default function ShowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const show = SHOWS.find((s) => s.slug === slug);

  if (!show) {
    notFound();
  }

  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [subMsg, setSubMsg] = useState("");
  const [liveCount, setLiveCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLiveCount(Math.floor(Math.random() * 8) + 3);
  }, []);

  const filtered = show.episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(query.toLowerCase()) ||
      ep.description.toLowerCase().includes(query.toLowerCase()) ||
      (ep.keyMoments ?? []).some((km) =>
        km.quote.toLowerCase().includes(query.toLowerCase())
      )
  );

  // Group episodes by series
  const seriesMap: Record<string, typeof show.episodes> = {};
  const standalone: typeof show.episodes = [];
  for (const ep of filtered) {
    if (ep.series) {
      if (!seriesMap[ep.series]) seriesMap[ep.series] = [];
      seriesMap[ep.series].push(ep);
    } else {
      standalone.push(ep);
    }
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubState("loading");
    try {
      const res = await fetch("/api/podcasts/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, showSlug: show!.slug }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (data.success) {
        setSubState("done");
        setSubMsg(data.message ?? "Subscribed!");
        setEmail("");
      } else {
        setSubState("error");
        setSubMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setSubState("error");
      setSubMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full blur-[120px] opacity-15"
          style={{ background: show.gradientFrom }}
        />
        <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-[#c9a84c]/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/imho-logo-nav.jpg" alt="IMHO Media" width={44} height={26} className="rounded" />
          <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-raleway)]">
            IMHO<span className="text-[#c9a84c]"> Media</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/podcasts" className="text-sm text-white/50 transition hover:text-[#c9a84c]">
            ← All Shows
          </Link>
          <a
            href={`/api/podcasts/feed?show=${show.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#c9a84c]/20 px-4 py-1.5 text-xs font-semibold text-[#c9a84c]/70 transition hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            RSS Feed
          </a>
        </div>
      </nav>

      {/* Show Header */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${show.gradientFrom}44, ${show.gradientTo}44)`,
              border: `1px solid ${show.gradientFrom}33`,
            }}
          >
            <svg className="h-12 w-12" style={{ color: show.gradientFrom }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a9 9 0 00-9 9v7c0 1.1.9 2 2 2h1v-8H5v-1a7 7 0 0114 0v1h-1v8h1c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z" />
            </svg>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                style={{ background: `${show.gradientFrom}22`, color: show.gradientFrom }}
              >
                {show.tag}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                {liveCount} listening now
              </span>
              <span className="text-xs text-white/40">
                {show.weeklyListens.toLocaleString()} listens this week
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-black md:text-4xl font-[family-name:var(--font-raleway)]">
              {show.title}
            </h1>
            <p className="mt-2 max-w-2xl text-white/60 leading-relaxed">
              {show.description}
            </p>
            <p className="mt-1 text-sm text-white/40">
              {show.episodes.length} episodes
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-6">
        <div className="relative max-w-xl">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            data-testid="episode-search"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search episodes, topics, quotes..."
            className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] pl-11 pr-10 py-3 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Episodes */}
      <div data-testid="episode-results" className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="mt-8 text-center text-white/40 py-16">
            No episodes match &ldquo;{query}&rdquo;. Try different keywords.
          </div>
        ) : (
          <>
            {/* Series blocks */}
            {Object.entries(seriesMap).map(([seriesName, eps]) => (
              <div key={seriesName} data-testid="series-block" className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#c9a84c]/15" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]/60 px-3">
                    {seriesName}
                  </span>
                  <div className="h-px flex-1 bg-[#c9a84c]/15" />
                </div>
                <div className="space-y-3">
                  {eps.map((ep, i) => (
                    <EpisodeCard
                      key={ep.id}
                      ep={ep}
                      showSlug={show.slug}
                      showGradientFrom={show.gradientFrom}
                      showGradientTo={show.gradientTo}
                      seriesIndex={i + 1}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Standalone episodes */}
            {standalone.length > 0 && (
              <div className="space-y-3">
                {standalone.map((ep) => (
                  <EpisodeCard
                    key={ep.id}
                    ep={ep}
                    showSlug={show.slug}
                    showGradientFrom={show.gradientFrom}
                    showGradientTo={show.gradientTo}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Subscribe block */}
        <div className="mt-16 rounded-3xl border border-[#c9a84c]/15 bg-gradient-to-br from-[#c9a84c]/8 via-transparent to-[#dc2626]/8 p-8 backdrop-blur-sm">
          <h2 className="text-xl font-black font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-[#c9a84c] to-[#dc2626] bg-clip-text text-transparent">
              Get notified when we drop new episodes
            </span>
          </h2>
          <p className="mt-2 text-sm text-white/50">
            S&apos;Truth delivered to your inbox. No spam — just new episodes.
          </p>

          {subState === "done" ? (
            <p className="mt-4 text-sm font-semibold text-[#c9a84c]">✓ {subMsg}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                data-testid="subscribe-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50"
              />
              <button
                data-testid="subscribe-btn"
                type="submit"
                disabled={subState === "loading"}
                className="rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#dc2626] px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 disabled:opacity-60"
              >
                {subState === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {subState === "error" && (
            <p className="mt-2 text-xs text-red-400">{subMsg}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#c9a84c]/10 px-6 py-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/40">
          <Link href="/podcasts" className="transition hover:text-[#c9a84c]">
            ← Back to Podcasts
          </Link>
          <span className="text-[#c9a84c]/20">|</span>
          <Link href="/submit" className="transition hover:text-[#c9a84c]">
            Submit a Track
          </Link>
          <span className="text-[#c9a84c]/20">|</span>
          <Link href="/podcasts/pitch" className="transition hover:text-[#c9a84c]">
            Pitch a Show
          </Link>
        </div>
        <p className="mt-3 text-xs text-white/25">
          © 2026 IMHO Media — S&apos;Truth. Just Saying!
        </p>
      </footer>
    </div>
  );
}

type EpType = Episode;

function EpisodeCard({
  ep,
  showSlug,
  showGradientFrom,
  showGradientTo,
  seriesIndex,
}: {
  ep: EpType;
  showSlug: string;
  showGradientFrom: string;
  showGradientTo: string;
  seriesIndex?: number;
}) {
  return (
    <Link
      href={`/podcasts/${showSlug}/${ep.id}`}
      data-testid="episode-card"
      className="group flex items-start gap-4 rounded-2xl border border-[#c9a84c]/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition hover:border-[#c9a84c]/25 hover:shadow-lg hover:shadow-[#c9a84c]/5"
    >
      {seriesIndex !== undefined && (
        <div
          className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black"
          style={{
            background: `linear-gradient(135deg, ${showGradientFrom}33, ${showGradientTo}33)`,
            border: `2px solid ${showGradientFrom}55`,
            color: showGradientFrom,
          }}
        >
          {seriesIndex}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/40">{ep.date}</span>
          <span className="text-xs text-white/30">·</span>
          <span className="text-xs text-white/40">{ep.duration}</span>
          <span className="text-xs text-white/30">·</span>
          <span className="text-xs text-white/40">
            {ep.listens.toLocaleString()} listens
          </span>
        </div>
        <h3 className="mt-1 font-bold text-white group-hover:text-[#e8d5a8] transition leading-tight">
          {ep.title}
        </h3>
        <p className="mt-1 text-sm text-white/50 line-clamp-2 leading-relaxed">
          {ep.description}
        </p>
        {ep.keyMoments && ep.keyMoments.length > 0 && (
          <p className="mt-2 text-xs text-[#c9a84c]/60 italic line-clamp-1">
            &ldquo;{ep.keyMoments[0].quote}&rdquo;
          </p>
        )}
      </div>

      <svg
        className="h-5 w-5 shrink-0 text-white/20 group-hover:text-[#c9a84c] transition mt-1"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
