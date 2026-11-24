"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2, Lock } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage("Salah, tidak valid.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Gagal memproses login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Halaman Oprec</span>
        </Link>

        <div className="mt-5 rounded-[1rem] border border-line bg-surface p-7 sm:p-8">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/bdca-emblem.webp"
              alt="Logo BDCA"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
            <div>
              <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
                Login Panitia Oprec
              </h1>
              <p className="text-xs text-muted">
                Dashboard Administrasi Bina Darma Cyber Army
              </p>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-[0.65rem] border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-900"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
                aria-hidden="true"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-ink"
              >
                Email Panitia
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="panitia@bidarcyberarmy.org"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 w-full rounded-[0.55rem] border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-ink"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 w-full rounded-[0.55rem] border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bdca-button-primary mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[0.6rem] px-5 text-sm font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
