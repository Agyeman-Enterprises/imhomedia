"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/auth-template/hooks/useAuth";
import type { TrackSubmission, SubmissionStatus } from "@/app/api/submissions/route";

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  pending:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  approved: "bg-green-500/15 text-green-400 border-green-500/20",
  rejected: "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [submissions, setSubmissions] = useState<TrackSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/submissions");
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? "Failed to fetch submissions");
      }
      const body = await res.json() as { submissions: TrackSubmission[]; note?: string };
      setSubmissions(body.submissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const updateStatus = async (id: string, status: SubmissionStatus) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json() as { error?: string };
        throw new Error(body.error ?? "Update failed");
      }
      // Optimistically update local state
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const counts = {
    total:    submissions.length,
    pending:  submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-red-900/15 blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-[#c9a84c]/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between border-b border-[#c9a84c]/10 px-6 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/imho-logo-nav.jpg" alt="IMHO Media" width={44} height={26} className="rounded" />
          <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-raleway)]">
            IMHO<span className="text-[#c9a84c]"> Media</span>
          </span>
        </Link>
        <div className="flex items-center gap-4" data-testid="nav-user-menu">
          <span className="hidden text-sm text-white/40 md:block">{user?.email}</span>
          <button
            onClick={() => signOut()}
            className="rounded-full border border-[#c9a84c]/20 px-4 py-1.5 text-sm font-semibold text-[#e8d5a8]/70 transition hover:border-[#c9a84c]/40 hover:text-[#e8d5a8]"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:px-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black font-[family-name:var(--font-raleway)]">
            <span className="bg-gradient-to-r from-[#c9a84c] to-[#dc2626] bg-clip-text text-transparent">
              Submissions Dashboard
            </span>
          </h1>
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="rounded-full border border-[#c9a84c]/20 px-4 py-1.5 text-sm font-semibold text-[#e8d5a8]/70 transition hover:border-[#c9a84c]/40 hover:text-[#e8d5a8] disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total",    value: counts.total,    color: "from-white to-[#e8d5a8]" },
            { label: "Pending",  value: counts.pending,  color: "from-yellow-400 to-amber-400" },
            { label: "Approved", value: counts.approved, color: "from-green-400 to-emerald-400" },
            { label: "Rejected", value: counts.rejected, color: "from-red-400 to-rose-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#c9a84c]/10 bg-white/[0.03] p-5 text-center"
            >
              <div className={`text-3xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/50">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a84c] border-t-transparent" />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && submissions.length === 0 && (
          <div className="rounded-2xl border border-[#c9a84c]/10 bg-white/[0.02] py-24 text-center">
            <p className="text-lg text-white/40">No submissions yet.</p>
            <p className="mt-2 text-sm text-white/25">
              When artists submit tracks, they&apos;ll appear here.
            </p>
          </div>
        )}

        {/* Submissions table */}
        {!loading && submissions.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-[#c9a84c]/10">
            <table className="w-full text-sm" data-testid="submissions-table">
              <thead>
                <tr className="border-b border-[#c9a84c]/10 bg-white/[0.02] text-left text-xs font-semibold uppercase tracking-wider text-white/40">
                  <th className="px-5 py-4">Artist</th>
                  <th className="px-5 py-4">Track</th>
                  <th className="px-5 py-4">Genre</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-[#c9a84c]/5 transition hover:bg-white/[0.02]"
                    data-testid={`submission-row-${sub.id}`}
                  >
                    <td className="px-5 py-4 font-semibold text-white">{sub.artist_name}</td>
                    <td className="px-5 py-4 text-white/70">
                      <a
                        href={sub.track_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:text-[#c9a84c]"
                      >
                        {sub.track_title} ↗
                      </a>
                    </td>
                    <td className="px-5 py-4 text-white/50">{sub.genre}</td>
                    <td className="px-5 py-4 text-white/50">{sub.email}</td>
                    <td className="px-5 py-4 text-white/40">
                      {new Date(sub.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_COLORS[sub.status]}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {sub.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(sub.id, "approved")}
                            disabled={updating === sub.id}
                            data-testid={`approve-btn-${sub.id}`}
                            className="rounded-lg bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400 transition hover:bg-green-500/25 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {sub.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(sub.id, "rejected")}
                            disabled={updating === sub.id}
                            data-testid={`reject-btn-${sub.id}`}
                            className="rounded-lg bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/25 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                        {sub.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(sub.id, "pending")}
                            disabled={updating === sub.id}
                            data-testid={`reset-btn-${sub.id}`}
                            className="rounded-lg bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-400 transition hover:bg-yellow-500/25 disabled:opacity-50"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
