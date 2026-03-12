"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/auth-template/hooks/useAuth";

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-1/2 -left-1/4 h-[120vh] w-[80vw] rounded-full bg-red-900/15 blur-[120px]" />
        <div className="absolute -bottom-1/3 -right-1/4 h-[100vh] w-[70vw] rounded-full bg-[#c9a84c]/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
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
          <h1 className="text-2xl font-black font-[family-name:var(--font-raleway)]">Admin Sign In</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          data-testid="login-form"
          className="space-y-5 rounded-2xl border border-[#c9a84c]/10 bg-white/[0.03] p-8 backdrop-blur-sm"
        >
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-5 py-3 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-white/70">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#c9a84c]/15 bg-white/[0.04] px-5 py-3 pr-12 text-white placeholder-white/25 outline-none transition focus:border-[#c9a84c]/50 focus:ring-1 focus:ring-[#c9a84c]/25"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/70"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="login-btn"
            className="w-full rounded-xl bg-gradient-to-r from-[#c9a84c] via-[#dc2626] to-[#c9a84c] py-3 font-bold text-black transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#c9a84c]/25 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/30">
          <Link href="/" className="transition hover:text-[#c9a84c]">
            ← Back to IMHO Radio
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a84c] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
