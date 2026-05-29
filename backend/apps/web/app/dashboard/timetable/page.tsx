"use client";

import { Topbar } from "@/components/topbar";
import { Lightning } from "@phosphor-icons/react";

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
const PERIODS = Array.from({ length: 10 }, (_, i) => i + 1);
const TIMES = [
  "08:00", "08:50", "09:40", "10:30", "11:20",
  "12:10", "13:00", "13:50", "14:40", "15:30",
];

const SAMPLE_LESSONS: Record<string, { subject: string; teacher: string; room: string; color: string }> = {
  "1-1": { subject: "Mathematik", teacher: "Dr. Schmidt", room: "R101", color: "#3b82f6" },
  "1-3": { subject: "Deutsch", teacher: "Fr. Müller", room: "R102", color: "#10b981" },
  "2-1": { subject: "Physik", teacher: "Dr. Schmidt", room: "Lab1", color: "#8b5cf6" },
  "2-4": { subject: "Englisch", teacher: "Fr. Weber", room: "R103", color: "#f59e0b" },
  "3-2": { subject: "Informatik", teacher: "Hr. Koch", room: "PC1", color: "#ef4444" },
  "3-5": { subject: "Sport", teacher: "Hr. Braun", room: "Halle", color: "#06b6d4" },
  "4-1": { subject: "Geschichte", teacher: "Fr. Müller", room: "R104", color: "#ec4899" },
  "4-3": { subject: "Mathematik", teacher: "Dr. Schmidt", room: "R101", color: "#3b82f6" },
  "5-2": { subject: "Chemie", teacher: "Fr. Fischer", room: "Lab2", color: "#84cc16" },
  "5-4": { subject: "Kunst", teacher: "Fr. Lange", room: "Kunst", color: "#f97316" },
};

export default function TimetablePage() {
  return (
    <>
      <Topbar
        title="Timetable"
        subtitle="Weekly schedule view — Class 10A"
        actions={
          <div className="flex items-center gap-3">
            <select
              className="px-3 py-2 rounded-lg text-xs font-mono border"
              style={{
                backgroundColor: "var(--sp-surface)",
                borderColor: "var(--sp-border)",
                color: "var(--sp-fg)",
              }}
            >
              <option>10A</option>
              <option>10B</option>
              <option>11A</option>
              <option>11B</option>
              <option>12A</option>
            </select>
            <button
              className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: "var(--sp-accent)",
                color: "white",
              }}
            >
              <Lightning weight="duotone" />
              Generate
            </button>
          </div>
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
          <div className="grid grid-cols-[72px_repeat(5,1fr)]">
            {/* Header Row */}
            <div
              className="h-11 border-b border-r flex items-center justify-center"
              style={{ borderColor: "var(--sp-border)" }}
            >
              <span
                className="text-[9px] font-mono font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--sp-muted)" }}
              >
                Time
              </span>
            </div>
            {DAYS.map((day, i) => (
              <div
                key={day}
                className="h-11 border-b border-r flex items-center justify-center last:border-r-0"
                style={{ borderColor: "var(--sp-border)" }}
              >
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: i === 0 ? "var(--sp-accent)" : "var(--sp-fg)" }}
                >
                  {day}
                </span>
              </div>
            ))}

            {/* Period Rows */}
            {PERIODS.map((period) => (
              <div key={period} className="contents">
                {/* Time Label */}
                <div
                  className="h-[72px] border-b border-r flex flex-col items-center justify-center"
                  style={{ borderColor: "var(--sp-border)" }}
                >
                  <span
                    className="text-[10px] font-mono font-semibold"
                    style={{ color: "var(--sp-fg)" }}
                  >
                    {period}
                  </span>
                  <span
                    className="text-[9px] font-mono"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    {TIMES[period - 1]}
                  </span>
                </div>

                {/* Day Cells */}
                {DAYS.map((_, dayIdx) => {
                  const key = `${dayIdx + 1}-${period}`;
                  const lesson = SAMPLE_LESSONS[key];

                  return (
                    <div
                      key={key}
                      className="h-[72px] border-b border-r p-1 last:border-r-0 transition-colors hover:bg-[var(--sp-bg)]"
                      style={{ borderColor: "var(--sp-border)" }}
                    >
                      {lesson && (
                        <div
                          className="h-full rounded-lg p-2.5 border-l-[3px] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-lg group"
                          style={{
                            borderLeftColor: lesson.color,
                            backgroundColor: `${lesson.color}12`,
                          }}
                        >
                          <div>
                            <p
                              className="text-[11px] font-bold leading-tight"
                              style={{ color: "var(--sp-fg)" }}
                            >
                              {lesson.subject}
                            </p>
                            <p
                              className="text-[10px] font-mono mt-0.5"
                              style={{ color: "var(--sp-muted)" }}
                            >
                              {lesson.teacher}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p
                              className="text-[10px] font-mono"
                              style={{ color: "var(--sp-muted)" }}
                            >
                              {lesson.room}
                            </p>
                            <div
                              className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: lesson.color }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { subject: "Mathematik", color: "#3b82f6" },
            { subject: "Deutsch", color: "#10b981" },
            { subject: "Physik", color: "#8b5cf6" },
            { subject: "Englisch", color: "#f59e0b" },
            { subject: "Informatik", color: "#ef4444" },
            { subject: "Sport", color: "#06b6d4" },
            { subject: "Geschichte", color: "#ec4899" },
            { subject: "Chemie", color: "#84cc16" },
            { subject: "Kunst", color: "#f97316" },
          ].map((item) => (
            <div key={item.subject} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span
                className="text-[10px] font-mono"
                style={{ color: "var(--sp-muted)" }}
              >
                {item.subject}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
