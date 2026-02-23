import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data?.message || "If an account exists, a reset link was sent.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Forgot password
          </h1>
          <p className="text-sm text-slate-400">
            Enter the email associated with your account and we&apos;ll send you a
            link to reset your password.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xl shadow-black/30">
          {error && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/40 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
          {message && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 px-3 py-2 rounded-md">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium py-2.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending link..." : "Send reset link"}
            </button>
          </form>
        </div>

        <p className="text-xs text-center text-slate-400">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

