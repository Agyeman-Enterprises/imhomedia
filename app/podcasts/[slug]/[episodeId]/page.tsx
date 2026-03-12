"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { SHOWS, getShow, getEpisode } from "@/data/podcasts";
import { notFound } from "next/navigation";
import { use } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ReactionKey = "fire" | "heart" | "mind_blown" | "insight" | "disagree";

const REACTION_EMOJI: Record<ReactionKey, string> = {
  fire: "🔥",
  heart: "❤️",
  mind_blown: "🤯",
  insight: "💡",
  disagree: "🗣️",
};

const REACTION_LABELS: Record<ReactionKey, string> = {
  fire: "Fire moment",
  heart: "Loved it",
  mind_blown: "Mind blown",
  insight: "Insight",
  disagree: "Disagree",
};

// ---------------------------------------------------------------------------
// Helper: format seconds as MM:SS
// ---------------------------------------------------------------------------
function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Helper: get or create session id
// ---------------------------------------------------------------------------
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem("imho_session");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("imho_session", id);
  }
  return id;
}

// ---------------------------------------------------------------------------
// Main Episode Page
// ---------------------------------------------------------------------------
export default function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string; episodeId: string }>;
}) {
  const { slug, episodeId } = use(params);

  // Support clip deep-links from URL hash on client
  const [clipStart, setClipStart] = useState<number | null>(null);
  const [clipEnd, setClipEnd] = useState<number | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const clip = urlParams.get("clip");
    if (clip) {
      const [s, e] = clip.split("-").map(Number);
      if (!isNaN(s) && !isNaN(e)) {
        setClipStart(s);
        setClipEnd(e);
      }
    }
  }, []);

  const show = getShow(slug);
  const episode = getEpisode(slug, episodeId);

  if (!show || !episode) {
    notFound();
  }

  // ---------------------------------------------------------------------------
  // Audio player state
  // ---------------------------------------------------------------------------
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(episode.durationSeconds);
  const [hasAudio] = useState(!!episode.audioUrl);

  // Progress percentage (for timeline)
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Currently active transcript paragraph index
  const activeParaIdx = episode.transcript.findLastIndex
    ? episode.transcript.findLastIndex((seg) => seg.timeSeconds <= currentTime)
    : episode.transcript.reduce((acc, seg, i) => (seg.timeSeconds <= currentTime ? i : acc), -1);

  // ---------------------------------------------------------------------------
  // Audio controls
  // ---------------------------------------------------------------------------
  const togglePlay = useCallback(() => {
    if (!hasAudio) return;
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [hasAudio, isPlaying]);

  const seekTo = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Reactions state
  // ---------------------------------------------------------------------------
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionKey, number>>({
    fire: 0, heart: 0, mind_blown: 0, insight: 0, disagree: 0,
  });
  const [reactionPeaks, setReactionPeaks] = useState<Record<ReactionKey, number>>({
    fire: 0, heart: 0, mind_blown: 0, insight: 0, disagree: 0,
  });
  const [reactionsOnTimeline, setReactionsOnTimeline] = useState<
    Array<{ timestampSeconds: number; reaction: ReactionKey }>
  >([]);
  const [pendingReaction, setPendingReaction] = useState<ReactionKey | null>(null);

  useEffect(() => {
    fetch(`/api/podcasts/react?showSlug=${slug}&episodeId=${episodeId}`)
      .then((r) => r.json())
      .then((data: {
        reactions?: Array<{ timestamp_seconds: number; reaction: ReactionKey }>;
        counts?: Record<ReactionKey, number>;
        peakSeconds?: Record<ReactionKey, number>;
      }) => {
        if (data.counts) setReactionCounts(data.counts);
        if (data.peakSeconds) setReactionPeaks(data.peakSeconds);
        if (data.reactions) {
          setReactionsOnTimeline(
            data.reactions.map((r) => ({
              timestampSeconds: r.timestamp_seconds,
              reaction: r.reaction,
            }))
          );
        }
      })
      .catch(() => {});
  }, [slug, episodeId]);

  const handleReact = async (reaction: ReactionKey) => {
    setPendingReaction(reaction);
    const ts = Math.round(currentTime);
    try {
      await fetch("/api/podcasts/react", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          showSlug: slug,
          episodeId,
          timestampSeconds: ts,
          reaction,
          sessionId: getSessionId(),
        }),
      });
      setReactionCounts((prev) => ({ ...prev, [reaction]: prev[reaction] + 1 }));
      setReactionsOnTimeline((prev) => [...prev, { timestampSeconds: ts, reaction }]);
    } catch {
      // silent fail — still update local state optimistically
      setReactionCounts((prev) => ({ ...prev, [reaction]: prev[reaction] + 1 }));
    } finally {
      setTimeout(() => setPendingReaction(null), 800);
    }
  };

  // ---------------------------------------------------------------------------
  // AI Summary state
  // ---------------------------------------------------------------------------
  type SummaryDepth = "tldr" | "brief" | "deep";
  const [summaryDepth, setSummaryDepth] = useState<SummaryDepth>("tldr");
  const [summaries, setSummaries] = useState<Partial<Record<SummaryDepth, string>>>({});
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const loadSummary = async (depth: SummaryDepth) => {
    if (summaries[depth]) return;
    setSummaryLoading(true);
    setSummaryError("");
    try {
      const res = await fetch(
        `/api/podcasts/summarize?showSlug=${slug}&episodeId=${episodeId}&depth=${depth}`
      );
      const data = (await res.json()) as { summary?: string; error?: string };
      if (data.summary) {
        setSummaries((prev) => ({ ...prev, [depth]: data.summary! }));
      } else {
        setSummaryError(data.error ?? "Failed to generate summary.");
      }
    } catch {
      setSummaryError("Network error. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSummaryTab = (depth: SummaryDepth) => {
    setSummaryDepth(depth);
    loadSummary(depth);
  };

  // ---------------------------------------------------------------------------
  // Ask This Episode state
  // ---------------------------------------------------------------------------
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState("");
  const [questionsLeft, setQuestionsLeft] = useState(5);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || questionsLeft <= 0) return;
    setAskLoading(true);
    setAnswer("");
    setAskError("");
    try {
      const res = await fetch("/api/podcasts/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ showSlug: slug, episodeId, question }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (data.answer) {
        setAnswer(data.answer);
        setQuestionsLeft((q) => q - 1);
        setQuestion("");
      } else {
        setAskError(data.error ?? "Failed to get an answer.");
      }
    } catch {
      setAskError("Network error. Please try again.");
    } finally {
      setAskLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Clip Studio state
  // ---------------------------------------------------------------------------
  const [clipSelectStart, setClipSelectStart] = useState<number>(0);
  const [clipSelectEnd, setClipSelectEnd] = useState<number>(60);
  const [clipCopied, setClipCopied] = useState(false);

  const generateClipUrl = () => {
    const base = typeof window !== "undefined" ? window.location.origin : "https://imho.media";
    return `${base}/podcasts/${slug}/${episodeId}?clip=${clipSelectStart}-${clipSelectEnd}`;
  };

  const copyClipUrl = async () => {
    const url = generateClipUrl();
    try {
      await navigator.clipboard.writeText(url);
      setClipCopied(true);
      setTimeout(() => setClipCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // ---------------------------------------------------------------------------
  // Auto-scroll transcript to active paragraph
  // ---------------------------------------------------------------------------
  const transcriptRef = useRef<HTMLDivElement>(null);
  const activeParaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeParaRef.current && transcriptRef.current) {
      activeParaRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeParaIdx]);

  // ---------------------------------------------------------------------------
  // Clip mode: if clip param, highlight clip region
  // ---------------------------------------------------------------------------
  const clipActive = clipStart !== null && clipEnd !== null;

  // ---------------------------------------------------------------------------
  // Live listener sim
  // ---------------------------------------------------------------------------
  const [liveCount] = useState(Math.floor(Math.random() * 5) + 2);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full blur-[120px] opacity-12"
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
        <div className="flex items-center gap-3 text-sm text-white/50">
          <Link href={`/podcasts/${slug}`} className="transition hover:text-[#c9a84c]">
            ← {show.title}
          </Link>
        </div>
      </nav>

      {/* Clip banner */}
      {clipActive && (
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-3">
          <div className="rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-2.5 flex items-center gap-3">
            <span className="text-xs font-bold text-[#c9a84c] uppercase tracking-wider">Clip</span>
            <span className="text-sm text-white/70">
              Shared clip: {formatTime(clipStart!)} – {formatTime(clipEnd!)}
            </span>
            <button
              onClick={() => seekTo(clipStart!)}
              className="ml-auto text-xs font-semibold text-[#c9a84c] hover:text-[#e8d5a8] transition"
            >
              Jump to clip →
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8">
        {/* Episode header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: `${show.gradientFrom}22`, color: show.gradientFrom }}
            >
              {show.tag}
            </span>
            {episode.series && (
              <span className="text-xs text-[#c9a84c]/60 font-medium">{episode.series}</span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              {liveCount} listening now
            </span>
          </div>
          <h1 className="text-2xl font-black md:text-3xl font-[family-name:var(--font-raleway)] leading-tight">
            {episode.title}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-white/40 flex-wrap">
            <span>{episode.date}</span>
            <span>·</span>
            <span>{episode.duration}</span>
            <span>·</span>
            <span>{episode.listens.toLocaleString()} total listens</span>
          </div>
          <p className="mt-3 text-white/60 leading-relaxed max-w-3xl">{episode.description}</p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* AUDIO PLAYER */}
        {/* ------------------------------------------------------------------ */}
        <div data-testid="episode-player" className="mb-6 rounded-2xl border border-[#c9a84c]/15 bg-white/[0.04] p-5 backdrop-blur-sm">
          {hasAudio ? (
            <audio
              ref={audioRef}
              src={episode.audioUrl}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          ) : null}

          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              disabled={!hasAudio}
              data-testid="episode-play-btn"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition hover:scale-105 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${show.gradientFrom}, ${show.gradientTo})` }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="h-5 w-5" fill="white" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="h-5 w-5 ml-0.5" fill="white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-white/40 w-10 text-right">{formatTime(currentTime)}</span>
                <div
                  className="relative flex-1 h-2 rounded-full bg-white/10 cursor-pointer group"
                  onClick={(e) => {
                    if (!hasAudio) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    seekTo(ratio * duration);
                  }}
                  data-testid="audio-progress"
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(to right, ${show.gradientFrom}, ${show.gradientTo})`,
                    }}
                  />
                  {/* Reaction dots on progress bar */}
                  {reactionsOnTimeline.slice(-30).map((r, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 text-xs cursor-pointer"
                      style={{
                        left: `${(r.timestampSeconds / duration) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        fontSize: "10px",
                      }}
                      title={`${REACTION_EMOJI[r.reaction]} at ${formatTime(r.timestampSeconds)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        seekTo(r.timestampSeconds);
                      }}
                    >
                      {REACTION_EMOJI[r.reaction]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-white/40 w-10">{formatTime(duration)}</span>
              </div>
              {!hasAudio && (
                <p className="text-xs text-[#c9a84c]/60">
                  Episode audio loading — transcript available now
                </p>
              )}
            </div>
          </div>

          {/* Reaction bar */}
          <div data-testid="reactions-panel" className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-white/40 mb-2">
              React at {formatTime(currentTime)} — drop a reaction at this moment:
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.entries(REACTION_EMOJI) as [ReactionKey, string][]).map(([key, emoji]) => (
                <button
                  key={key}
                  data-testid="reaction-btn"
                  onClick={() => handleReact(key)}
                  disabled={pendingReaction !== null}
                  title={REACTION_LABELS[key]}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm transition hover:border-[#c9a84c]/40 hover:bg-white/[0.08] disabled:opacity-50"
                >
                  <span className={pendingReaction === key ? "animate-bounce" : ""}>{emoji}</span>
                  {reactionCounts[key] > 0 && (
                    <span className="text-xs text-white/50">{reactionCounts[key]}</span>
                  )}
                </button>
              ))}
            </div>
            {/* Peak reaction insight */}
            {Object.values(reactionCounts).some((c) => c > 0) && (
              <p className="mt-2 text-xs text-white/30">
                {(() => {
                  const topReaction = (Object.entries(reactionCounts) as [ReactionKey, number][])
                    .sort((a, b) => b[1] - a[1])[0];
                  const peak = reactionPeaks[topReaction[0]];
                  return `${topReaction[1]} ${REACTION_EMOJI[topReaction[0]]} reactions — most at ${formatTime(peak)}`;
                })()}
              </p>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TWO-COLUMN LAYOUT: transcript + sidebar */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* LEFT: Transcript */}
          <div>
            {/* ---------------------------------------------------------------- */}
            {/* AI Summary tabs */}
            {/* ---------------------------------------------------------------- */}
            <div data-testid="summary-tabs" className="mb-6 rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] overflow-hidden">
              <div className="flex border-b border-[#c9a84c]/10">
                {([
                  { key: "tldr" as SummaryDepth, label: "⚡ TL;DR" },
                  { key: "brief" as SummaryDepth, label: "📖 2-min Read" },
                  { key: "deep" as SummaryDepth, label: "📚 Deep Notes" },
                ] as const).map(({ key, label }) => (
                  <button
                    key={key}
                    data-testid="summary-btn"
                    onClick={() => handleSummaryTab(key)}
                    className={`flex-1 px-3 py-3 text-xs font-bold uppercase tracking-wider transition ${
                      summaryDepth === key
                        ? "bg-[#c9a84c]/10 text-[#c9a84c] border-b-2 border-[#c9a84c]"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div data-testid="summary-content" className="p-5 min-h-[80px]">
                {summaryLoading ? (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <div className="h-4 w-4 rounded-full border-2 border-[#c9a84c]/40 border-t-[#c9a84c] animate-spin" />
                    Generating with AI...
                  </div>
                ) : summaryError ? (
                  <p className="text-sm text-red-400">{summaryError}</p>
                ) : summaries[summaryDepth] ? (
                  <div className="prose prose-invert prose-sm max-w-none text-white/70 whitespace-pre-wrap text-sm leading-relaxed">
                    {summaries[summaryDepth]}
                  </div>
                ) : (
                  <button
                    onClick={() => loadSummary(summaryDepth)}
                    className="text-sm text-[#c9a84c]/70 hover:text-[#c9a84c] transition"
                  >
                    Generate {summaryDepth === "tldr" ? "TL;DR" : summaryDepth === "brief" ? "2-min summary" : "deep notes"} with AI →
                  </button>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Transcript */}
            {/* ---------------------------------------------------------------- */}
            <div
              data-testid="transcript-panel"
              ref={transcriptRef}
              className="mb-6 rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#c9a84c]/10">
                <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">Transcript</h2>
                {!hasAudio && (
                  <span className="text-xs text-white/30">Click any paragraph to seek</span>
                )}
                {hasAudio && (
                  <span className="text-xs text-white/30">Synced to audio</span>
                )}
              </div>
              <div className="max-h-[500px] overflow-y-auto p-1">
                {episode.transcript.map((seg, i) => {
                  const isActive = i === activeParaIdx;
                  const isInClip =
                    clipActive &&
                    seg.timeSeconds >= clipStart! &&
                    seg.timeSeconds <= clipEnd!;

                  return (
                    <div
                      key={i}
                      ref={isActive ? activeParaRef : null}
                      data-testid="transcript-para"
                      onClick={() => seekTo(seg.timeSeconds)}
                      className={`group relative flex gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all ${
                        isActive
                          ? "bg-[#c9a84c]/10 border border-[#c9a84c]/25"
                          : isInClip
                          ? "bg-blue-500/8 border border-blue-500/20"
                          : "border border-transparent hover:bg-white/[0.03]"
                      }`}
                    >
                      <span
                        className="shrink-0 text-xs font-mono pt-0.5 w-10 text-right transition"
                        style={{
                          color: isActive ? show.gradientFrom : "rgba(255,255,255,0.25)",
                        }}
                      >
                        {seg.time}
                      </span>
                      <p
                        className={`flex-1 text-sm leading-relaxed transition ${
                          isActive ? "text-white" : "text-white/60"
                        }`}
                      >
                        {seg.text}
                      </p>
                      {/* Copy and Share buttons */}
                      <div className="flex shrink-0 flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(seg.text).catch(() => {});
                          }}
                          title="Copy text"
                          className="rounded px-1.5 py-0.5 text-xs text-white/30 hover:text-[#c9a84c] transition bg-white/[0.04]"
                        >
                          📋
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = `${window.location.origin}/podcasts/${slug}/${episodeId}?clip=${seg.timeSeconds}-${seg.timeSeconds + 60}`;
                            navigator.clipboard.writeText(url).catch(() => {});
                          }}
                          title="Share from this timestamp"
                          className="rounded px-1.5 py-0.5 text-xs text-white/30 hover:text-[#c9a84c] transition bg-white/[0.04]"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Ask This Episode */}
            {/* ---------------------------------------------------------------- */}
            <div data-testid="ask-panel" className="mb-6 rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#c9a84c]/10">
                <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">
                  Ask This Episode
                </h2>
                <span className="text-xs text-white/30">{questionsLeft}/5 questions remaining</span>
              </div>
              <div className="p-5">
                {answer && (
                  <div
                    data-testid="ask-response"
                    className="mb-4 rounded-xl border border-[#c9a84c]/15 bg-[#c9a84c]/5 p-4 text-sm text-white/80 leading-relaxed"
                  >
                    {answer}
                  </div>
                )}
                {askError && (
                  <p className="mb-3 text-xs text-red-400">{askError}</p>
                )}

                {questionsLeft > 0 ? (
                  <form onSubmit={handleAsk} className="flex gap-2">
                    <input
                      data-testid="ask-input"
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder='e.g. "What did they say about AI music rights?"'
                      className="flex-1 rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50"
                      disabled={askLoading}
                    />
                    <button
                      data-testid="ask-submit"
                      type="submit"
                      disabled={askLoading || !question.trim()}
                      className="rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#dc2626] px-4 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
                    >
                      {askLoading ? (
                        <div className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                      ) : (
                        "Ask →"
                      )}
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-white/40">
                    Session limit reached. Refresh to ask more questions.
                  </p>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Clip Studio */}
            {/* ---------------------------------------------------------------- */}
            <div className="mb-6 rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#c9a84c]/10">
                <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">Clip Studio</h2>
                <p className="text-xs text-white/30 mt-0.5">Select a time range and share a clip</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Start (seconds)</label>
                    <input
                      data-testid="clip-start"
                      type="number"
                      min={0}
                      max={episode.durationSeconds}
                      value={clipSelectStart}
                      onChange={(e) => setClipSelectStart(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]/50"
                    />
                    <span className="text-xs text-white/30 mt-1 block">{formatTime(clipSelectStart)}</span>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">End (seconds)</label>
                    <input
                      data-testid="clip-end"
                      type="number"
                      min={0}
                      max={episode.durationSeconds}
                      value={clipSelectEnd}
                      onChange={(e) => setClipSelectEnd(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-[#c9a84c]/50"
                    />
                    <span className="text-xs text-white/30 mt-1 block">{formatTime(clipSelectEnd)}</span>
                  </div>
                </div>

                {/* Clip preview — transcript excerpt */}
                {episode.transcript.filter(
                  (s) => s.timeSeconds >= clipSelectStart && s.timeSeconds <= clipSelectEnd
                ).length > 0 && (
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-xs text-white/50 italic">
                    &ldquo;{episode.transcript
                      .filter((s) => s.timeSeconds >= clipSelectStart && s.timeSeconds <= clipSelectEnd)
                      .slice(0, 2)
                      .map((s) => s.text)
                      .join(" ")
                      .slice(0, 200)}...&rdquo;
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => seekTo(clipSelectStart)}
                    className="rounded-xl border border-[#c9a84c]/20 px-3 py-2 text-xs font-semibold text-[#c9a84c]/70 transition hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
                  >
                    Preview start
                  </button>
                  <button
                    data-testid="clip-share"
                    onClick={copyClipUrl}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#c9a84c]/20 to-[#dc2626]/20 border border-[#c9a84c]/20 px-3 py-2 text-xs font-bold text-[#c9a84c] transition hover:from-[#c9a84c]/30 hover:to-[#dc2626]/30"
                  >
                    {clipCopied ? "✓ Link copied!" : "Share Clip — copy link"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-5">
            {/* Key Moments */}
            <div data-testid="key-moments" className="rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#c9a84c]/10">
                <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">📌 Key Moments</h2>
              </div>
              <div className="p-4 space-y-3">
                {episode.keyMoments.map((km, i) => (
                  <button
                    key={i}
                    onClick={() => seekTo(km.timestampSeconds)}
                    className="group w-full text-left rounded-xl border border-transparent bg-white/[0.03] p-3 transition hover:border-[#c9a84c]/20 hover:bg-white/[0.06]"
                  >
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: show.gradientFrom }}
                    >
                      {km.timestamp}
                    </span>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition line-clamp-3">
                      &ldquo;{km.quote}&rdquo;
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Knowledge Cards */}
            <div data-testid="knowledge-cards" className="rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#c9a84c]/10">
                <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">Also Mentioned</h2>
              </div>
              <div className="p-4 space-y-2">
                {episode.knowledgeCards.map((card, i) => {
                  const icons: Record<string, string> = {
                    Book: "📚",
                    Person: "👤",
                    Link: "🔗",
                    Concept: "💡",
                  };
                  const colors: Record<string, string> = {
                    Book: "text-amber-400",
                    Person: "text-purple-400",
                    Link: "text-cyan-400",
                    Concept: "text-emerald-400",
                  };
                  const cardEl = (
                    <div className="flex items-start gap-3 rounded-xl border border-transparent bg-white/[0.03] p-3 transition hover:border-[#c9a84c]/15 hover:bg-white/[0.05]">
                      <span className="text-lg shrink-0">{icons[card.type]}</span>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold uppercase tracking-wider ${colors[card.type]}`}>
                          {card.type}
                        </span>
                        <p className="text-sm text-white/80 font-medium leading-tight mt-0.5 line-clamp-2">
                          {card.title}
                        </p>
                        {card.subtitle && (
                          <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{card.subtitle}</p>
                        )}
                      </div>
                    </div>
                  );
                  return card.href ? (
                    <a key={i} href={card.href} target="_blank" rel="noopener noreferrer" className="block">
                      {cardEl}
                    </a>
                  ) : (
                    <div key={i}>{cardEl}</div>
                  );
                })}
              </div>
            </div>

            {/* Other episodes */}
            <div className="rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#c9a84c]/10">
                <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">More Episodes</h2>
              </div>
              <div className="p-3 space-y-2">
                {show.episodes
                  .filter((ep) => ep.id !== episodeId)
                  .slice(0, 3)
                  .map((ep) => (
                    <Link
                      key={ep.id}
                      href={`/podcasts/${slug}/${ep.id}`}
                      className="block rounded-xl border border-transparent bg-white/[0.03] p-3 text-sm transition hover:border-[#c9a84c]/15 hover:bg-white/[0.05]"
                    >
                      <span className="text-xs text-white/30">{ep.duration}</span>
                      <p className="mt-0.5 text-white/70 hover:text-white transition leading-tight line-clamp-2">
                        {ep.title}
                      </p>
                    </Link>
                  ))}
                <Link
                  href={`/podcasts/${slug}`}
                  className="block text-center text-xs text-[#c9a84c]/60 hover:text-[#c9a84c] transition py-2"
                >
                  All episodes →
                </Link>
              </div>
            </div>
          </div>
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
