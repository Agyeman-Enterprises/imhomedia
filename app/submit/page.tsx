"use client";

import { useState } from "react";
import Link from "next/link";

type FormData = {
  artistName: string;
  trackTitle: string;
  genre: string;
  trackLink: string;
  email: string;
};

const GENRES = [
  "Soul / R&B",
  "Jazz",
  "Reggae",
  "Latin",
  "Hip-Hop",
  "Pop",
  "Classical Fusion",
  "Gospel",
  "Afrobeats",
  "Electronic",
  "Other",
];

export default function SubmitPage() {
  const [form, setForm] = useState<FormData>({
    artistName: "",
    trackTitle: "",
    genre: "",
    trackLink: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setSending(false);
      return;
    }

    setSubmitted(true);
    setSending(false);
  };

  const update = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  if (submitted) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-purple-900/20 blur-[120px]" />
          <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-red-900/15 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
            <svg className="h-10 w-10" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black">Track Submitted!</h1>
          <p className="mt-4 text-lg text-white/60">
            Thanks for submitting <span className="font-semibold text-white">{form.trackTitle}</span>!
            We&apos;ll review your track and notify you within <span className="font-semibold text-purple-400">48 hours</span> if selected for rotation.
          </p>
          <p className="mt-6 text-white/40">
            If your track makes it in, you&apos;ll get social media templates to share with your audience.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-gradient-to-r from-purple-600 to-red-600 px-8 py-3 font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Back to IMHO Radio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-red-900/15 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-red-600">
            <span className="text-lg font-black">IM</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            IMHO<span className="text-purple-400"> Media</span>
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold transition hover:border-white/20 hover:text-white"
        >
          Back to Radio
        </Link>
      </nav>

      {/* Form */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-black md:text-5xl">
            <span className="bg-gradient-to-r from-purple-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Bring Your Own Music
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/50">
            Got a track that slaps? Submit it. If it vibes with the station,
            we&apos;ll put it in rotation alongside our AI tracks. Humans welcome.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          {/* Artist Name */}
          <div>
            <label htmlFor="artistName" className="mb-2 block text-sm font-semibold text-white/70">
              Artist / Producer Name
            </label>
            <input
              id="artistName"
              type="text"
              required
              value={form.artistName}
              onChange={update("artistName")}
              placeholder="e.g. DJ Mixtape, The Fusion Collective"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
            />
          </div>

          {/* Track Title */}
          <div>
            <label htmlFor="trackTitle" className="mb-2 block text-sm font-semibold text-white/70">
              Track Title
            </label>
            <input
              id="trackTitle"
              type="text"
              required
              value={form.trackTitle}
              onChange={update("trackTitle")}
              placeholder="e.g. Sunset in Lagos"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="mb-2 block text-sm font-semibold text-white/70">
              Genre
            </label>
            <select
              id="genre"
              required
              value={form.genre}
              onChange={update("genre")}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-white outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 [&>option]:bg-[#0a0a0f]"
            >
              <option value="" disabled>Select a genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Track Link */}
          <div>
            <label htmlFor="trackLink" className="mb-2 block text-sm font-semibold text-white/70">
              Track Link (SoundCloud, Dropbox, Google Drive)
            </label>
            <input
              id="trackLink"
              type="url"
              required
              value={form.trackLink}
              onChange={update("trackLink")}
              placeholder="https://soundcloud.com/your-track or Dropbox link"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white/70">
              Your Email (for notifications)
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
            />
          </div>

          {/* Info box */}
          <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
            <p className="text-sm text-white/50">
              <span className="font-semibold text-purple-400">How it works:</span>{" "}
              We review every submission. If your track fits the Mixed Heritage Beats vibe,
              we&apos;ll add it to rotation and email you social media templates to share.
              Review takes up to 48 hours.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-red-600 py-4 text-lg font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:hover:scale-100"
          >
            {sending ? "Submitting..." : "Submit Your Track"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center">
        <p className="text-sm text-white/30">
          Powered by <a href="https://wavcraft.vercel.app" target="_blank" className="font-semibold text-purple-400 hover:text-purple-300">WavCraft AI</a> (beta)
        </p>
      </footer>
    </div>
  );
}
