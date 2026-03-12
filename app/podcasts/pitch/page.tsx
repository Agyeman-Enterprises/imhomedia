"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type FormData = {
  name: string;
  showTitle: string;
  concept: string;
  sampleLink: string;
  email: string;
};

export default function PitchPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    showTitle: "",
    concept: "",
    sampleLink: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/podcast-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setSending(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-red-900/15 blur-[120px]" />
          <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-[#c9a84c]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a84c] to-[#dc2626]">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="white"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-[#c9a84c] to-[#dc2626] bg-clip-text text-transparent">
              Pitch Received!
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Thanks for pitching{" "}
            <span className="font-semibold text-white">{form.showTitle}</span>!
            We&apos;ll review your concept and get back to you within{" "}
            <span className="font-semibold text-[#c9a84c]">5 business days</span>.
          </p>
          <p className="mt-6 text-white/40 text-sm">
            Keep making noise. If your concept slaps, we&apos;ll be in touch.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/podcasts"
              className="inline-block rounded-full bg-gradient-to-r from-[#c9a84c] to-[#dc2626] px-8 py-3 font-bold text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#c9a84c]/25"
            >
              Browse Podcasts
            </Link>
            <Link
              href="/"
              className="inline-block rounded-full border border-[#c9a84c]/20 px-8 py-3 font-semibold text-[#e8d5a8]/70 transition hover:border-[#c9a84c]/40 hover:text-[#e8d5a8]"
            >
              Back to Radio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-red-900/15 blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-[#c9a84c]/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-3">
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
        </Link>
        <Link
          href="/podcasts"
          className="rounded-full border border-[#c9a84c]/20 px-5 py-2 text-sm font-semibold text-[#e8d5a8]/70 transition hover:border-[#c9a84c]/40 hover:text-[#e8d5a8]"
        >
          All Podcasts
        </Link>
      </nav>

      {/* Form */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-black md:text-5xl font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-[#c9a84c] via-[#dc2626] to-[#c9a84c] bg-clip-text text-transparent">
              Pitch a Show
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/50">
            Got a concept? A voice? An opinion that won&apos;t shut up? Tell us
            about it. IMHO Podcasts is always looking for sharp, unconventional
            creators.
          </p>
        </div>

        <form
          data-testid="pitch-form"
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
        >
          {/* Name */}
          <div>
            <label
              htmlFor="pitch-name"
              className="mb-2 block text-sm font-semibold text-white/70"
            >
              Your Name
            </label>
            <input
              id="pitch-name"
              type="text"
              required
              value={form.name}
              onChange={update("name")}
              placeholder="e.g. Amara Osei"
              className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
            />
          </div>

          {/* Show Title */}
          <div>
            <label
              htmlFor="pitch-show-title"
              className="mb-2 block text-sm font-semibold text-white/70"
            >
              Show Title
            </label>
            <input
              id="pitch-show-title"
              type="text"
              required
              value={form.showTitle}
              onChange={update("showTitle")}
              placeholder="e.g. Unfiltered Frequencies"
              className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
            />
          </div>

          {/* Concept */}
          <div>
            <label
              htmlFor="pitch-concept"
              className="mb-2 block text-sm font-semibold text-white/70"
            >
              Show Concept
            </label>
            <textarea
              id="pitch-concept"
              required
              rows={5}
              value={form.concept}
              onChange={update("concept")}
              placeholder="Tell us what the show is about, who it's for, and why you're the right person to host it..."
              className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25 resize-none"
            />
          </div>

          {/* Sample Link */}
          <div>
            <label
              htmlFor="pitch-sample"
              className="mb-2 block text-sm font-semibold text-white/70"
            >
              Sample Episode Link{" "}
              <span className="font-normal text-white/30">(optional)</span>
            </label>
            <input
              id="pitch-sample"
              type="url"
              value={form.sampleLink}
              onChange={update("sampleLink")}
              placeholder="https://soundcloud.com/your-pilot or YouTube link"
              className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="pitch-email"
              className="mb-2 block text-sm font-semibold text-white/70"
            >
              Your Email
            </label>
            <input
              id="pitch-email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@email.com"
              className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-5 py-3.5 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
            />
          </div>

          {/* Info box */}
          <div className="rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/5 p-5">
            <p className="text-sm text-white/50">
              <span className="font-semibold text-[#c9a84c]">What happens next:</span>{" "}
              Our team reviews every pitch. If your concept fits the IMHO vibe,
              we&apos;ll reach out to discuss production, hosting, and launch.
              Response within 5 business days.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            data-testid="pitch-submit"
            type="submit"
            disabled={sending}
            className="w-full rounded-xl bg-gradient-to-r from-[#c9a84c] via-[#dc2626] to-[#c9a84c] py-4 text-lg font-bold text-black transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#c9a84c]/25 disabled:opacity-50 disabled:hover:scale-100"
          >
            {sending ? "Submitting..." : "Pitch My Show"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#c9a84c]/10 px-6 py-8 text-center">
        <p className="text-sm text-white/30">
          Powered by{" "}
          <a
            href="https://wavcraft.vercel.app"
            target="_blank"
            className="font-semibold text-[#c9a84c] hover:text-[#e8d5a8]"
          >
            WavCraft AI
          </a>{" "}
          (beta)
        </p>
      </footer>
    </div>
  );
}
