"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DbTimetableEntry } from "@/types/database";
import type { RealtimeChannel } from "@supabase/supabase-js";

type TimetableEvent = "INSERT" | "UPDATE" | "DELETE" | "SYNC";

interface UseRealtimeTimetableOptions {
  classId?: number;
  teacherId?: number;
  enabled?: boolean;
}

interface UseRealtimeTimetableResult {
  entries: DbTimetableEntry[];
  loading: boolean;
  error: string | null;
  lastEvent: TimetableEvent | null;
  refetch: () => Promise<void>;
}

async function fetchEntries(
  classId: number | undefined,
  teacherId: number | undefined
): Promise<{ data: DbTimetableEntry[]; error: string | null }> {
  const supabase = createClient();
  let query = supabase
    .from("TimetableEntry")
    .select("*, class:Class(*), subject:Subject(*), teacher:Teacher(*), room:Room(*)")
    .order("start", { ascending: true });

  if (classId !== undefined) {
    query = query.eq("classId", classId);
  }
  if (teacherId !== undefined) {
    query = query.eq("teacherId", teacherId);
  }

  const { data, error: fetchError } = await query;

  if (fetchError) {
    return { data: [], error: fetchError.message };
  }
  return { data: data as DbTimetableEntry[], error: null };
}

export function useRealtimeTimetable(
  options: UseRealtimeTimetableOptions = {}
): UseRealtimeTimetableResult {
  const { classId, teacherId, enabled = true } = options;

  const [entries, setEntries] = useState<DbTimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<TimetableEvent | null>(null);
  const mountedRef = useRef<boolean>(true);

  const refetch = useCallback(async () => {
    const { data, error: fetchError } = await fetchEntries(classId, teacherId);
    if (mountedRef.current) {
      setEntries(data);
      setError(fetchError);
      setLoading(false);
    }
  }, [classId, teacherId]);

  useEffect(() => {
    if (!enabled) return;

    mountedRef.current = true;

    // Initial data fetch (async, updates state via refetch)
    void refetch();

    // Subscribe to realtime changes
    const supabase = createClient();

    const channel: RealtimeChannel = supabase
      .channel("timetable-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "TimetableEntry" },
        (payload) => {
          const eventType = payload.eventType as TimetableEvent;
          setLastEvent(eventType);

          setEntries((prev) => {
            const row = payload.new as DbTimetableEntry | undefined;
            const oldRow = payload.old as Pick<DbTimetableEntry, "id"> | undefined;

            switch (eventType) {
              case "INSERT":
                return row ? [...prev, row] : prev;
              case "UPDATE":
                return row ? prev.map((e) => (e.id === row.id ? row : e)) : prev;
              case "DELETE":
                return oldRow ? prev.filter((e) => e.id !== oldRow.id) : prev;
              default:
                return prev;
            }
          });
        }
      )
      .on("broadcast", { event: "sync" }, () => {
        setLastEvent("SYNC");
        void refetch();
      })
      .subscribe();

    return () => {
      mountedRef.current = false;
      void supabase.removeChannel(channel);
    };
  }, [enabled, refetch]);

  return { entries, loading, error, lastEvent, refetch };
}
