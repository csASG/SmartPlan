"use client";

import { useEffect, useState } from "react";
import { Topbar } from "@/components/topbar";
import {
  ChalkboardTeacher,
  Student,
  UsersThree,
  Door,
  ArrowUpRight,
  Clock,
} from "@phosphor-icons/react";
import { apiFetch, getStoredToken } from "@/lib/api";

interface StatsData {
  teachers: number;
  students: number;
  classes: number;
  rooms: number;
}

const FALLBACK_STATS = [
  { label: "Teachers", value: "—", icon: ChalkboardTeacher, color: "#8b5cf6" },
  { label: "Students", value: "—", icon: Student, color: "#10b981" },
  { label: "Classes", value: "—", icon: UsersThree, color: "#3b82f6" },
  { label: "Rooms", value: "—", icon: Door, color: "#f59e0b" },
];

const RECENT_ACTIVITY = [
  { action: "Schedule generated", detail: "Full timetable for all classes", time: "2 min ago", type: "success" as const },
  { action: "Teacher added", detail: "Dr. Schmidt — Mathematics, Physics", time: "1 hour ago", type: "info" as const },
  { action: "Substitution created", detail: "Room change for 10A — Math", time: "3 hours ago", type: "warning" as const },
  { action: "Attendance recorded", detail: "10B — 24 present, 2 absent", time: "5 hours ago", type: "info" as const },
];

const TYPE_COLORS = {
  success: "var(--sp-accent)",
  warning: "#f59e0b",
  info: "var(--sp-muted)",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    Promise.allSettled([
      apiFetch("/teachers", { token }),
      apiFetch("/users", { token }),
      apiFetch("/classes", { token }),
    ]).then(([teachers, users, classes]) => {
      setStats({
        teachers: teachers.status === "fulfilled" ? (teachers.value as unknown[]).length : 0,
        students: users.status === "fulfilled" ? (users.value as unknown[]).filter((u: any) => u.role === "STUDENT").length : 0,
        classes: classes.status === "fulfilled" ? (classes.value as unknown[]).length : 0,
        rooms: 0,
      });
    });
  }, []);

  const statValues = stats
    ? [
        { label: "Teachers", value: String(stats.teachers), icon: ChalkboardTeacher, color: "#8b5cf6" },
        { label: "Students", value: String(stats.students), icon: Student, color: "#10b981" },
        { label: "Classes", value: String(stats.classes), icon: UsersThree, color: "#3b82f6" },
        { label: "Rooms", value: String(stats.rooms), icon: Door, color: "#f59e0b" },
      ]
    : FALLBACK_STATS;

  return (
    <>
      <Topbar title="Dashboard" subtitle="SmartPlan Overview" />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statValues.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group rounded-xl p-5 border transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg cursor-pointer"
                style={{
                  backgroundColor: "var(--sp-surface)",
                  borderColor: "var(--sp-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = stat.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--sp-border)";
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon
                      className="text-base"
                      weight="duotone"
                      style={{ color: stat.color }}
                    />
                  </div>
                  <ArrowUpRight
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--sp-muted)" }}
                    weight="bold"
                  />
                </div>
                <p
                  className="text-[10px] font-mono uppercase tracking-[0.15em] font-semibold"
                  style={{ color: "var(--sp-muted)" }}
                >
                  {stat.label}
                </p>
                <p
                  className="text-3xl font-bold mt-1"
                  style={{ color: "var(--sp-fg)" }}
                >
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div
            className="lg:col-span-2 rounded-xl border"
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
                Recent Activity
              </h2>
            </div>
            <div>
              {RECENT_ACTIVITY.map((activity, i) => (
                <div
                  key={i}
                  className="px-6 py-3.5 flex items-center gap-4 border-b last:border-b-0 transition-colors hover:bg-[var(--sp-bg)]"
                  style={{ borderColor: "var(--sp-border)" }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: TYPE_COLORS[activity.type] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--sp-fg)" }}
                    >
                      {activity.action}
                    </p>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: "var(--sp-muted)" }}
                    >
                      {activity.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock
                      className="text-[10px]"
                      weight="duotone"
                      style={{ color: "var(--sp-muted)" }}
                    />
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: "var(--sp-muted)" }}
                    >
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="rounded-xl border"
            style={{
              backgroundColor: "var(--sp-surface)",
              borderColor: "var(--sp-border)",
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: "var(--sp-border)" }}
            >
              <h2
                className="text-sm font-semibold"
                style={{ color: "var(--sp-fg)" }}
              >
                Quick Actions
              </h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: "Generate Schedule", href: "/dashboard/timetable", color: "var(--sp-accent)" },
                { label: "Add Teacher", href: "/dashboard/resources/teachers", color: "#8b5cf6" },
                { label: "Add Class", href: "/dashboard/resources/classes", color: "#3b82f6" },
                { label: "Create Substitution", href: "/dashboard/substitutions", color: "#f59e0b" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border"
                  style={{
                    borderColor: "var(--sp-border)",
                    color: "var(--sp-fg)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.backgroundColor = `${action.color}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--sp-border)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: action.color }}
                  />
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
