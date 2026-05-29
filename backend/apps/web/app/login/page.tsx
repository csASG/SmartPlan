"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Spinner } from "@phosphor-icons/react";
import { GridBackground } from "@/components/grid-background";
import { SmartPlanLogo } from "@/components/smartplan-logo";

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data: LoginResponse = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  const DEMO_CREDENTIALS: Record<string, { email: string; password: string }> = {
    ADMIN:   { email: "admin@smartplan.de",   password: "admin123" },
    TEACHER: { email: "schmidt@smartplan.de", password: "admin123" },
    STUDENT: { email: "wolf.amelie@schule.de", password: "admin123" },
  };

  async function handleDemoLogin(role: "ADMIN" | "TEACHER" | "STUDENT"): Promise<void> {
    const creds = DEMO_CREDENTIALS[role];
    setError(null);
    setIsLoading(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });

      if (!response.ok) throw new Error("Login failed");

      const data: LoginResponse = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/dashboard";
    } catch {
      setError("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--sp-bg)" }}
    >
      <GridBackground />

      <main className="relative z-10 w-full max-w-md px-6">
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <SmartPlanLogo />
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ color: "var(--sp-fg)" }}
          >
            SmartPlan
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--sp-muted)" }}
          >
            Intelligent School Management System
          </p>
        </div>

        {/* Login Card */}
        <div
          className="p-8 rounded-2xl"
          style={{
            backgroundColor: "var(--sp-surface)",
            border: "1px solid var(--sp-border)",
            boxShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.5)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-[11px] font-mono font-semibold mb-2 uppercase tracking-[0.15em]"
                style={{ color: "var(--sp-muted)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "oklch(12% 0.01 250)",
                  border: "1px solid var(--sp-border)",
                  color: "var(--sp-fg)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--sp-accent)";
                  e.currentTarget.style.boxShadow = "0 0 0 2px var(--sp-accent-muted)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--sp-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />
            </div>

            <div>
              <label
                className="block text-[11px] font-mono font-semibold mb-2 uppercase tracking-[0.15em]"
                style={{ color: "var(--sp-muted)" }}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-mono text-sm transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "oklch(12% 0.01 250)",
                  border: "1px solid var(--sp-border)",
                  color: "var(--sp-fg)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--sp-accent)";
                  e.currentTarget.style.boxShadow = "0 0 0 2px var(--sp-accent-muted)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--sp-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                required
              />
            </div>

            {error && (
              <div
                className="px-3 py-2 rounded-lg text-xs font-mono"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
              >
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{
                    accentColor: "var(--sp-accent)",
                    borderColor: "var(--sp-border)",
                  }}
                />
                <span
                  className="text-xs transition-colors group-hover:text-[var(--sp-fg)]"
                  style={{ color: "var(--sp-muted)" }}
                >
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-xs hover:underline opacity-80 hover:opacity-100 transition-opacity"
                style={{ color: "var(--sp-accent)" }}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{
                backgroundColor: "var(--sp-accent)",
                color: "white",
                boxShadow: "0 4px 14px -3px var(--sp-accent-muted)",
              }}
            >
              {isLoading ? (
                <>
                  <Spinner className="animate-spin" weight="bold" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight weight="bold" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: "var(--sp-border)" }}
          >
            <p
              className="text-[10px] text-center mb-4 uppercase tracking-[0.2em] font-mono font-semibold"
              style={{ color: "var(--sp-muted)" }}
            >
              Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { role: "ADMIN", label: "Admin", color: "var(--sp-accent)" },
                { role: "TEACHER", label: "Teacher", color: "#8b5cf6" },
                { role: "STUDENT", label: "Student", color: "#10b981" },
              ] as const).map(({ role, label, color }) => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  className="px-3 py-2.5 rounded-lg text-[11px] font-mono font-semibold transition-all duration-200 border"
                  style={{
                    borderColor: "var(--sp-border)",
                    color: color,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.backgroundColor = `${color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--sp-border)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <p
              className="text-[9px] text-center mt-3 font-mono"
              style={{ color: "var(--sp-muted)" }}
            >
              Passwort für alle: <strong>admin123</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="mt-8 text-center text-[11px]"
          style={{ color: "var(--sp-muted)" }}
        >
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-[var(--sp-fg)] transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-[var(--sp-fg)] transition-colors">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </div>
  );
}
