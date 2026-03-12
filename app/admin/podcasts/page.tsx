"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SHOWS } from "@/data/podcasts";

interface EpisodeRow {
  id: string;
  showSlug: string;
  title: string;
  date: string;
  duration: string;
  description: string;
  listens: number;
  audioUrl?: string;
}

type FormState = {
  showSlug: string;
  title: string;
  date: string;
  duration: string;
  durationSeconds: number;
  description: string;
  audioUrl: string;
  transcript: string;
};

const DEFAULT_FORM: FormState = {
  showSlug: SHOWS[0]?.slug ?? "",
  title: "",
  date: new Date().toISOString().split("T")[0],
  duration: "",
  durationSeconds: 0,
  description: "",
  audioUrl: "",
  transcript: "",
};

export default function AdminPodcastsPage() {
  const [episodes, setEpisodes] = useState<EpisodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editShowSlug, setEditShowSlug] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadEpisodes();
  }, []);

  async function loadEpisodes() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/podcasts/episodes");
      const data = (await res.json()) as { episodes?: EpisodeRow[]; error?: string };
      if (data.episodes) setEpisodes(data.episodes);
    } catch {
      console.error("Failed to load episodes");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg("");

    try {
      // Parse transcript lines
      const transcriptLines = form.transcript
        .split("\n")
        .filter((l) => l.trim())
        .map((line, i) => {
          const match = line.match(/^\[?(\d+:\d+)\]?\s+(.+)$/);
          if (match) {
            const [, time, text] = match;
            const [m, s] = time.split(":").map(Number);
            return { time, timeSeconds: m * 60 + (s ?? 0), text };
          }
          return { time: `${i}:00`, timeSeconds: i * 60, text: line };
        });

      const payload = {
        showSlug: form.showSlug,
        title: form.title,
        date: form.date,
        duration: form.duration,
        durationSeconds: Number(form.durationSeconds),
        description: form.description,
        audioUrl: form.audioUrl || undefined,
        transcript: transcriptLines,
      };

      const isEdit = editId !== null;
      const res = await fetch("/api/admin/podcasts/episodes", {
        method: isEdit ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(isEdit ? { ...payload, id: editId, showSlug: editShowSlug ?? form.showSlug } : payload),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (data.success) {
        setSaveMsg(isEdit ? "Episode updated." : "Episode added.");
        setShowForm(false);
        setForm(DEFAULT_FORM);
        setEditId(null);
        setEditShowSlug(null);
        await loadEpisodes();
      } else {
        setSaveMsg(data.error ?? "Failed to save.");
      }
    } catch {
      setSaveMsg("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, showSlug: string) {
    try {
      await fetch(`/api/admin/podcasts/episodes?id=${id}&showSlug=${showSlug}`, {
        method: "DELETE",
      });
      setDeleteConfirm(null);
      await loadEpisodes();
    } catch {
      console.error("Delete failed");
    }
  }

  function startEdit(ep: EpisodeRow) {
    setForm({
      showSlug: ep.showSlug,
      title: ep.title,
      date: ep.date,
      duration: ep.duration,
      durationSeconds: 0,
      description: ep.description,
      audioUrl: ep.audioUrl ?? "",
      transcript: "",
    });
    setEditId(ep.id);
    setEditShowSlug(ep.showSlug);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-red-900/15 blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-[#c9a84c]/8 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-[#c9a84c]/60 hover:text-[#c9a84c] transition">
              ← Admin
            </Link>
            <h1 className="mt-1 text-3xl font-black font-[family-name:var(--font-raleway)]">
              Episode Manager
            </h1>
          </div>
          <button
            data-testid="add-episode-btn"
            onClick={() => {
              setForm(DEFAULT_FORM);
              setEditId(null);
              setEditShowSlug(null);
              setShowForm((v) => !v);
            }}
            className="rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#dc2626] px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-105"
          >
            {showForm && !editId ? "Cancel" : "+ Add Episode"}
          </button>
        </div>

        {saveMsg && (
          <div className="mb-4 rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/10 px-4 py-3 text-sm text-[#c9a84c]">
            {saveMsg}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <form
            data-testid="add-episode-form"
            onSubmit={handleSave}
            className="mb-8 rounded-2xl border border-[#c9a84c]/15 bg-white/[0.03] p-6 space-y-4"
          >
            <h2 className="text-lg font-bold font-[family-name:var(--font-raleway)]">
              {editId ? "Edit Episode" : "Add Episode"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Show *</label>
                <select
                  value={form.showSlug}
                  onChange={(e) => setForm((f) => ({ ...f, showSlug: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a84c]/50"
                >
                  {SHOWS.map((s) => (
                    <option key={s.slug} value={s.slug} className="bg-[#0a0a0f]">
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a84c]/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="Episode title"
                className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#c9a84c]/50"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Duration (e.g. 42 min)</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  placeholder="42 min"
                  className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#c9a84c]/50"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Duration (seconds)</label>
                <input
                  type="number"
                  value={form.durationSeconds}
                  onChange={(e) => setForm((f) => ({ ...f, durationSeconds: Number(e.target.value) }))}
                  placeholder="2520"
                  className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#c9a84c]/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={3}
                placeholder="Episode description..."
                className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#c9a84c]/50 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">Audio URL (optional)</label>
              <input
                type="url"
                value={form.audioUrl}
                onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#c9a84c]/50"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">
                Transcript (optional — one line per paragraph, optionally prefixed with [MM:SS])
              </label>
              <textarea
                value={form.transcript}
                onChange={(e) => setForm((f) => ({ ...f, transcript: e.target.value }))}
                rows={8}
                placeholder={"[0:00] Opening paragraph...\n[2:30] Second paragraph..."}
                className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#c9a84c]/50 resize-y font-mono"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#dc2626] px-6 py-2.5 text-sm font-bold text-black transition-all hover:scale-105 disabled:opacity-60"
              >
                {saving ? "Saving..." : editId ? "Save Changes" : "Add Episode"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setEditShowSlug(null);
                  setForm(DEFAULT_FORM);
                }}
                className="rounded-xl border border-[#c9a84c]/20 px-6 py-2.5 text-sm text-[#c9a84c]/70 transition hover:border-[#c9a84c]/50 hover:text-[#c9a84c]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Episode List */}
        <div data-testid="episode-manager" className="space-y-3">
          {loading ? (
            <div className="flex items-center gap-2 text-white/40 py-8 justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-[#c9a84c]/40 border-t-[#c9a84c] animate-spin" />
              Loading episodes...
            </div>
          ) : episodes.length === 0 ? (
            <div className="text-center text-white/40 py-12">
              No episodes yet. Add your first episode above.
            </div>
          ) : (
            episodes.map((ep) => {
              const show = SHOWS.find((s) => s.slug === ep.showSlug);
              return (
                <div
                  key={`${ep.showSlug}:${ep.id}`}
                  className="flex items-start gap-4 rounded-2xl border border-[#c9a84c]/10 bg-white/[0.03] p-4 transition hover:border-[#c9a84c]/20"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {show && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${show.gradientFrom}22`,
                            color: show.gradientFrom,
                          }}
                        >
                          {show.title}
                        </span>
                      )}
                      <span className="text-xs text-white/30">{ep.date}</span>
                      <span className="text-xs text-white/30">{ep.duration}</span>
                    </div>
                    <h3 className="font-bold text-white">{ep.title}</h3>
                    <p className="mt-1 text-sm text-white/50 line-clamp-1">{ep.description}</p>
                    {ep.audioUrl && (
                      <p className="mt-1 text-xs text-[#c9a84c]/60 truncate">🎵 {ep.audioUrl}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/podcasts/${ep.showSlug}/${ep.id}`}
                      target="_blank"
                      className="rounded-lg border border-[#c9a84c]/15 px-3 py-1.5 text-xs text-white/50 transition hover:border-[#c9a84c]/40 hover:text-[#c9a84c]"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => startEdit(ep)}
                      className="rounded-lg border border-[#c9a84c]/15 px-3 py-1.5 text-xs text-white/50 transition hover:border-[#c9a84c]/40 hover:text-[#c9a84c]"
                    >
                      Edit
                    </button>
                    {deleteConfirm === `${ep.showSlug}:${ep.id}` ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(ep.id, ep.showSlug)}
                          className="rounded-lg bg-red-600/20 border border-red-600/30 px-2 py-1.5 text-xs text-red-400 transition hover:bg-red-600/30"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-white/30 hover:text-white/60 px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(`${ep.showSlug}:${ep.id}`)}
                        className="rounded-lg border border-red-600/15 px-3 py-1.5 text-xs text-red-400/60 transition hover:border-red-600/40 hover:text-red-400"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
