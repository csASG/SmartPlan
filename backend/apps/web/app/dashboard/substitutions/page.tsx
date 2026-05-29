"use client";

import { Topbar } from "@/components/topbar";
import { Plus, ArrowRight, CalendarBlank } from "@phosphor-icons/react";

const SUBSTITUTIONS = [
  { date: "2026-05-29", time: "08:00 – 08:45", class: "10A", subject: "Mathematik", original: "Dr. Schmidt", substitute: "Fr. Müller", room: "R102", note: "Room change" },
  { date: "2026-05-29", time: "09:00 – 09:45", class: "10B", subject: "Physik", original: "Dr. Schmidt", substitute: "Hr. Koch", room: "Lab1", note: "Teacher absent" },
  { date: "2026-05-29", time: "10:00 – 10:45", class: "11A", subject: "Englisch", original: "Fr. Weber", substitute: "Fr. Lange", room: "R103", note: "" },
  { date: "2026-05-30", time: "08:00 – 08:45", class: "12A", subject: "Chemie", original: "Fr. Fischer", substitute: "Dr. Schmidt", room: "Lab2", note: "Lab equipment ready" },
  { date: "2026-05-30", time: "11:20 – 12:10", class: "10B", subject: "Deutsch", original: "Fr. Müller", substitute: "Fr. Weber", room: "R102", note: "" },
];

const STATS = [
  { label: "Today", value: "3", color: "var(--sp-accent)" },
  { label: "This Week", value: "5", color: "#f59e0b" },
  { label: "Pending", value: "1", color: "#ef4444" },
];

export default function SubstitutionsPage() {
  return (
    <>
      <Topbar
        title="Substitutions"
        subtitle="Manage schedule changes"
        actions={
          <button
            className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--sp-accent)", color: "white" }}
          >
            <Plus weight="bold" />
            Add Substitution
          </button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: "var(--sp-surface)",
                borderColor: "var(--sp-border)",
              }}
            >
              <p
                className="text-[10px] font-mono uppercase tracking-[0.15em] font-semibold"
                style={{ color: "var(--sp-muted)" }}
              >
                {stat.label}
              </p>
              <p
                className="text-3xl font-bold mt-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Substitution List */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--sp-surface)",
            borderColor: "var(--sp-border)",
          }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--sp-border)" }}
          >
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--sp-fg)" }}
            >
              Upcoming Substitutions
            </h2>
            <div className="flex items-center gap-2">
              <CalendarBlank
                className="text-sm"
                weight="duotone"
                style={{ color: "var(--sp-muted)" }}
              />
              <span
                className="text-[11px] font-mono"
                style={{ color: "var(--sp-muted)" }}
              >
                May 29 – 30, 2026
              </span>
            </div>
          </div>

          <div>
            {SUBSTITUTIONS.map((sub, i) => (
              <div
                key={i}
                className="px-6 py-4 flex items-center gap-5 border-b last:border-b-0 transition-colors hover:bg-[var(--sp-bg)]"
                style={{ borderColor: "var(--sp-border)" }}
              >
                {/* Date + Time */}
                <div className="w-28 shrink-0">
                  <p
                    className="text-[11px] font-mono"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    {sub.date}
                  </p>
                  <p
                    className="text-[11px] font-mono font-semibold mt-0.5"
                    style={{ color: "var(--sp-fg)" }}
                  >
                    {sub.time}
                  </p>
                </div>

                {/* Class Badge */}
                <div className="w-14 shrink-0">
                  <span
                    className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: "var(--sp-accent-muted)",
                      color: "var(--sp-accent)",
                    }}
                  >
                    {sub.class}
                  </span>
                </div>

                {/* Subject + Teacher Swap */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--sp-fg)" }}
                  >
                    {sub.subject}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: "var(--sp-muted)" }}
                    >
                      {sub.original}
                    </span>
                    <ArrowRight
                      className="text-[10px] shrink-0"
                      weight="bold"
                      style={{ color: "var(--sp-accent)" }}
                    />
                    <span
                      className="text-[11px] font-mono font-semibold"
                      style={{ color: "var(--sp-fg)" }}
                    >
                      {sub.substitute}
                    </span>
                  </div>
                </div>

                {/* Room */}
                <div className="w-14 shrink-0">
                  <p
                    className="text-[11px] font-mono"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    {sub.room}
                  </p>
                </div>

                {/* Note */}
                {sub.note && (
                  <div
                    className="px-2.5 py-1 rounded-md text-[10px] font-mono font-medium shrink-0"
                    style={{
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      color: "#f59e0b",
                    }}
                  >
                    {sub.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
