import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

type AdminLoginProps = {
  onLogin: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => void;
  errorMessage: string | null;
  statusMessage: string | null;
  loading: boolean;
};

export function AdminLogin({
  onLogin,
  onResetPassword,
  errorMessage,
  statusMessage,
  loading,
}: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLocalError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLocalError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setLocalError("Email harus diisi.");
      return;
    }

    if (!password) {
      setLocalError("Password harus diisi.");
      return;
    }

    await onLogin(email, password);
  };

  const handleReset = async () => {
    if (!email) {
      setLocalError("Masukkan email terlebih dahulu.");
      return;
    }
    await onResetPassword(email);
  };

  return (
    <div className="min-h-screen bg-bataru-50 text-slate-800">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200/80 bg-slate-50 p-10 shadow-glass">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.35em] text-bataru-700">
              Admin Login
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-800">
              Masuk sebagai Admin BATARU
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Gunakan email dan password yang sudah didaftarkan di Firebase
              Auth.
            </p>
          </div>

          {errorMessage || localError ? (
            <div className="mb-6 rounded-[1.75rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage || localError}
            </div>
          ) : null}
          {statusMessage ? (
            <div className="mb-6 rounded-[1.75rem] border border-bataru-200 bg-bataru-50 px-4 py-3 text-sm text-slate-800">
              {statusMessage}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => handleEmailChange(event.target.value)}
                disabled={loading}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="admin@bataru.co"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => handlePasswordChange(event.target.value)}
                disabled={loading}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-bataru-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="••••••••"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="inline-flex w-full items-center justify-center rounded-full bg-bataru-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-bataru-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Memproses ..." : "Masuk ke Dashboard"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading || !email}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Belum punya akun admin? Buat akun di Firebase Console.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex text-sm font-semibold text-bataru-700 hover:text-bataru-900"
          >
            Kembali ke toko
          </Link>
        </div>
      </div>
    </div>
  );
}
