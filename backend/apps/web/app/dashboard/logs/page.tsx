"use client";

import { Topbar } from "@/components/topbar";
import { ArrowClockwise } from "@phosphor-icons/react";

const LOGS = [
  { timestamp: "14:32:01", level: "INFO", service: "api", message: "Schedule generated successfully (Phase 1: FEASIBLE)" },
  { timestamp: "14:31:45", level: "INFO", service: "solver", message: "CP-SAT Phase 1 solved in 1.2s — 40 assignments" },
  { timestamp: "14:31:44", level: "INFO", service: "solver", message: "Incoming request POST /solve" },
  { timestamp: "14:28:12", level: "WARN", service: "api", message: "Rate limit exceeded for 192.168.1.100 (login)" },
  { timestamp: "14:15:33", level: "INFO", service: "api", message: "User login: admin@example.com (ADMIN)" },
  { timestamp: "13:45:00", level: "ERROR", service: "solver", message: "Timeout after 15s — schedule infeasible" },
  { timestamp: "13:20:10", level: "INFO", service: "api", message: "Teacher created: Dr. Schmidt (id=8)" },
  { timestamp: "12:00:00", level: "INFO", service: "api", message: "Database connected: PostgreSQL 16-alpine" },
  { timestamp: "11:30:00", level: "INFO", service: "api", message: "Prisma migrations applied: 3 pending" },
  { timestamp: "11:00:00", level: "INFO", service: "api", message: "Application started on port 3001" },
];

const LEVEL_CONFIG: Record<string, { bg: string; color: string }> = {
  INFO: { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" },
  WARN: { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" },
  ERROR: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" },
};

const SERVICE_COLORS: Record<string, string> = {
  api: "#3b82f6",
  solver: "#8b5cf6",
};

export default function LogsPage() {
  return (
    <>
      <Topbar
        title="Logs"
        subtitle="System event log"
        actions={
          <button
            className="px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all hover:bg-[var(--sp-surface)]"
            style={{
              borderColor: "var(--sp-border)",
              color: "var(--sp-muted)",
            }}
          >
            <ArrowClockwise weight="duotone" />
            Refresh
          </button>
        }
      />

      <div className="p-8">
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--sp-surface)",
            borderColor: "var(--sp-border)",
          }}
        >
          {/* Header */}
          <div
            className="px-6 py-3 border-b flex items-center gap-6 text-[10px] font-mono font-semibold uppercase tracking-[0.12em]"
            style={{ borderColor: "var(--sp-border)", color: "var(--sp-muted)" }}
          >
            <span className="w-16">Time</span>
            <span className="w-12">Level</span>
            <span className="w-14">Service</span>
            <span className="flex-1">Message</span>
          </div>

          {/* Log Entries */}
          <div>
            {LOGS.map((log, i) => {
              const levelCfg = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.INFO;
              const serviceColor = SERVICE_COLORS[log.service] || "var(--sp-muted)";

              return (
                <div
                  key={i}
                  className="px-6 py-2.5 flex items-center gap-6 border-b last:border-b-0 font-mono text-[11px] transition-colors hover:bg-[var(--sp-bg)]"
                  style={{ borderColor: "var(--sp-border)" }}
                >
                  <span className="w-16 shrink-0" style={{ color: "var(--sp-muted)" }}>
                    {log.timestamp}
                  </span>
                  <span className="w-12 shrink-0">
                    <span
                      className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{ backgroundColor: levelCfg.bg, color: levelCfg.color }}
                    >
                      {log.level}
                    </span>
                  </span>
                  <span
                    className="w-14 shrink-0 font-semibold"
                    style={{ color: serviceColor }}
                  >
                    {log.service}
                  </span>
                  <span className="flex-1 truncate" style={{ color: "var(--sp-fg)" }}>
                    {log.message}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
