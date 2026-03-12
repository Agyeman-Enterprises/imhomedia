"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SHOWS, getFeaturedEpisodes } from "@/data/podcasts";

const ALL_TAGS = ["All", ...Array.from(new Set(SHOWS.map((s) => s.tag)))];

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function PodcastsPage() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [subMsg, setSubMsg] = useState("");
  const [totalListeners] = useState(1247 + Math.floor(Math.random() * 50));

  const featured = getFeaturedEpisodes(3);

  const filtered = SHOWS.filter((s) => {
    const matchesTag = activeTag === "All" || s.tag === activeTag;
    const matchesQuery =
      !query ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase()) ||
      s.tag.toLowerCase().includes(query.toLowerCase());
    return matchesTag && matchesQuery;
  });

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setSubState("loading");
    try {
      const res = await fetch("/api/podcasts/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
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
      setSubMsg("Network error.");
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-red-900/15 blur-[120px]" />
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
        <div className="flex items-center gap-4">
          <Link
            href="/podcasts/pitch"
            className="hidden sm:inline-block rounded-full border border-[#c9a84c]/20 px-5 py-2 text-sm font-semibold text-[#e8d5a8]/70 transition hover:border-[#c9a84c]/40 hover:text-[#e8d5a8]"
          >
            Pitch a Show
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#c9a84c]/20 px-5 py-2 text-sm font-semibold text-[#e8d5a8]/70 transition hover:border-[#c9a84c]/40 hover:text-[#e8d5a8]"
          >
            Back to Radio
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-16 pb-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#dc2626]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#dc2626]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
          IMHO Podcasts
        </span>
        <h1 className="mt-6 text-5xl font-black md:text-6xl font-[family-name:var(--font-raleway)]">
          <span className="bg-gradient-to-r from-[#c9a84c] via-[#dc2626] to-[#c9a84c] bg-clip-text text-transparent">
            We say what everyone&apos;s thinking.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
          {totalListeners.toLocaleString()} listens this week. S&apos;Truth. Just Saying!
        </p>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-xl">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              data-testid="episode-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shows, topics..."
              className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] pl-11 pr-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
            />
          </div>
        </div>

        {/* Tag filter */}
        <div data-testid="tag-filter" className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                activeTag === tag
                  ? "bg-[#c9a84c] text-black"
                  : "border border-[#c9a84c]/20 text-[#c9a84c]/60 hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Featured Episodes Carousel */}
      {/* ------------------------------------------------------------------ */}
      {!query && activeTag === "All" && (
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-[#c9a84c]/60">
            Featured Episodes
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((ep) => (
              <Link
                key={`${ep.show.slug}-${ep.id}`}
                href={`/podcasts/${ep.show.slug}/${ep.id}`}
                className="group rounded-2xl border border-[#c9a84c]/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition hover:border-[#c9a84c]/25 hover:shadow-lg hover:shadow-[#c9a84c]/5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${ep.show.gradientFrom}33, ${ep.show.gradientTo}33)`,
                    }}
                  >
                    <svg className="h-4 w-4" style={{ color: ep.show.gradientFrom }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1a9 9 0 00-9 9v7c0 1.1.9 2 2 2h1v-8H5v-1a7 7 0 0114 0v1h-1v8h1c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/40">{ep.show.title}</span>
                </div>
                <h3 className="font-bold text-white group-hover:text-[#e8d5a8] transition text-sm leading-snug line-clamp-2">
                  {ep.title}
                </h3>
                <p className="mt-1 text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {ep.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-white/30">
                  <span>{ep.listens.toLocaleString()} listens</span>
                  <span className="text-[#c9a84c]/60 font-semibold group-hover:text-[#c9a84c] transition">Listen →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Show Grid */}
      {/* ------------------------------------------------------------------ */}
      <div
        data-testid="podcast-directory"
        className="relative z-10 mx-auto max-w-5xl px-6 pb-24"
      >
        {filtered.length === 0 ? (
          <div className="mt-12 text-center text-white/40 py-16">
            No shows match &ldquo;{query}&rdquo;. Try a different search.
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((show) => {
              const latestEp = show.episodes[0];
              return (
                <Link
                  key={show.slug}
                  href={`/podcasts/${show.slug}`}
                  data-testid="show-card"
                  className="group rounded-2xl border border-[#c9a84c]/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition hover:border-[#c9a84c]/25 hover:shadow-lg hover:shadow-[#c9a84c]/5"
                >
                  {/* Show art */}
                  <div
                    className="mb-4 flex h-24 w-full items-center justify-center rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${show.gradientFrom}33, ${show.gradientTo}33)`,
                      border: `1px solid ${show.gradientFrom}22`,
                    }}
                  >
                    <svg
                      className="h-10 w-10"
                      style={{ color: show.gradientFrom }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 1a9 9 0 00-9 9v7c0 1.1.9 2 2 2h1v-8H5v-1a7 7 0 0114 0v1h-1v8h1c1.1 0 2-.9 2-2v-7a9 9 0 00-9-9z" />
                    </svg>
                  </div>

                  <span className="inline-block rounded-full bg-[#dc2626]/15 px-3 py-1 text-xs font-semibold text-[#dc2626]">
                    {show.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white group-hover:text-[#e8d5a8] transition">
                    {show.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/50 leading-relaxed line-clamp-2">
                    {show.description}
                  </p>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-xs text-white/30">
                      <span>{show.episodes.length} episodes</span>
                      <span>{show.weeklyListens.toLocaleString()} listens/week</span>
                    </div>
                    {latestEp && (
                      <div className="text-xs text-white/25 truncate">
                        Latest: {latestEp.title}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-white/20">{latestEp?.date}</span>
                    <span className="text-sm font-semibold text-[#c9a84c] transition group-hover:text-[#e8d5a8]">
                      Listen →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Subscribe — all shows */}
        <div className="mt-16 rounded-3xl border border-[#c9a84c]/15 bg-gradient-to-br from-[#c9a84c]/8 via-transparent to-[#dc2626]/8 p-10 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-black font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-[#c9a84c] to-[#dc2626] bg-clip-text text-transparent">
              Never miss a drop
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/50 text-sm">
            New episodes across all shows — delivered to your inbox. No spam. S&apos;Truth only.
          </p>
          {subState === "done" ? (
            <p className="mt-6 font-semibold text-[#c9a84c]">✓ {subMsg}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
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
          {subState === "error" && <p className="mt-2 text-xs text-red-400">{subMsg}</p>}
        </div>

        {/* Pitch CTA */}
        <div className="mt-8 rounded-3xl border border-[#dc2626]/15 bg-gradient-to-br from-[#dc2626]/10 via-transparent to-[#c9a84c]/10 p-10 text-center backdrop-blur-sm">
          <h2 className="text-2xl font-black font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-[#dc2626] to-[#c9a84c] bg-clip-text text-transparent">
              Got a Show Idea?
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/50">
            We&apos;re always looking for sharp voices. Pitch your concept.
          </p>
          <Link
            href="/podcasts/pitch"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#dc2626] to-[#c9a84c] px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#dc2626]/25"
          >
            Pitch a Show
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#c9a84c]/10 px-6 py-8 text-center">
        <p className="text-sm text-white/30">
          Powered by{" "}
          <a href="https://wavcraft.vercel.app" target="_blank" className="font-semibold text-[#c9a84c] hover:text-[#e8d5a8]">
            WavCraft AI
          </a>{" "}
          (beta)
        </p>
      </footer>
    </div>
  );
}
