"use client";

import { useRealtimeTimetable } from "@/hooks/useRealtimeTimetable";

interface RealtimeTimetableProps {
  classId?: number;
  teacherId?: number;
}

export function RealtimeTimetable({ classId, teacherId }: RealtimeTimetableProps) {
  const { entries, loading, error, lastEvent } = useRealtimeTimetable({
    classId,
    teacherId,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm font-mono" style={{ color: "var(--sp-muted)" }}>
          Lade Stundenplan...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
        <p className="text-sm text-red-400 font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Live-Indicator */}
      <div
        className="flex items-center gap-2 text-xs font-mono"
        style={{ color: "var(--sp-muted)" }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Echtzeit aktiv
        {lastEvent && (
          <span
            className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono"
            style={{ backgroundColor: "var(--sp-accent-muted)", color: "var(--sp-accent)" }}
          >
            {lastEvent}
          </span>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="login-card rounded-xl p-4 flex items-start justify-between"
          >
            <div className="space-y-1">
              <div className="text-sm font-semibold" style={{ color: "var(--sp-fg)" }}>
                {entry.subject?.name ?? `Subject #${entry.subjectId}`}
              </div>
              <div className="text-xs font-mono" style={{ color: "var(--sp-muted)" }}>
                {entry.teacher?.name ?? "—"} · {entry.room?.name ?? "—"}
              </div>
              {entry.class && (
                <div className="text-xs font-mono" style={{ color: "var(--sp-muted)" }}>
                  Klasse: {entry.class.name}
                </div>
              )}
            </div>
            <div className="text-right text-xs font-mono" style={{ color: "var(--sp-muted)" }}>
              <div>{new Date(entry.start).toLocaleDateString("de-DE")}</div>
              <div>
                {new Date(entry.start).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" – "}
                {new Date(entry.end).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-center p-8 text-sm font-mono" style={{ color: "var(--sp-muted)" }}>
            Keine Einträge gefunden.
          </div>
        )}
      </div>
    </div>
  );
}
