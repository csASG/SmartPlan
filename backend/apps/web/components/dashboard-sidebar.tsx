"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SmartPlanLogo } from "@/components/smartplan-logo";
import {
  House,
  GridFour,
  UsersThree,
  Student,
  Door,
  ChalkboardTeacher,
  Lightning,
  Gear,
  Terminal,
  SignOut,
  type IconProps,
} from "@phosphor-icons/react";
import type { ComponentType } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
  section: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: House, section: "general" },
  { href: "/dashboard/timetable", label: "Timetable", icon: GridFour, section: "general" },
  { href: "/dashboard/resources/teachers", label: "Teachers", icon: ChalkboardTeacher, section: "general" },
  { href: "/dashboard/resources/students", label: "Students", icon: Student, section: "general" },

  { href: "/dashboard/resources/rooms", label: "Rooms", icon: Door, section: "management" },
  { href: "/dashboard/resources/classes", label: "Classes", icon: UsersThree, section: "management" },
  { href: "/dashboard/substitutions", label: "Substitutions", icon: Lightning, section: "management" },

  { href: "/dashboard/settings", label: "Settings", icon: Gear, section: "system" },
  { href: "/dashboard/logs", label: "Logs", icon: Terminal, section: "system" },
];

const SECTION_LABELS: Record<string, string> = {
  general: "General",
  management: "Management",
  system: "System",
};

export function DashboardSidebar() {
  const pathname = usePathname();

  let lastSection = "";

  return (
    <aside
      className="w-60 border-r flex flex-col h-screen sticky top-0 shrink-0"
      style={{
        backgroundColor: "var(--sp-bg)",
        borderColor: "var(--sp-border)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5 border-b flex items-center gap-3"
        style={{ borderColor: "var(--sp-border)" }}
      >
        <SmartPlanLogo />
        <span
          className="font-bold text-lg tracking-tight"
          style={{ color: "var(--sp-fg)" }}
        >
          SmartPlan
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const showSection = item.section !== lastSection;
          lastSection = item.section;
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <div key={item.href}>
              {showSection && (
                <div
                  className="text-[9px] font-mono px-3 mb-1.5 mt-5 uppercase tracking-[0.15em] first:mt-0 font-semibold"
                  style={{ color: "var(--sp-muted)" }}
                >
                  {SECTION_LABELS[item.section]}
                </div>
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                  isActive && "border-l-2 rounded-l-none -ml-0.5 pl-3.5"
                )}
                style={{
                  color: isActive ? "var(--sp-fg)" : "var(--sp-muted)",
                  backgroundColor: isActive ? "var(--sp-surface)" : "transparent",
                  borderLeftColor: isActive ? "var(--sp-accent)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "var(--sp-surface)";
                    e.currentTarget.style.color = "var(--sp-fg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--sp-muted)";
                  }
                }}
              >
                <Icon className="text-base" weight="duotone" />
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div
        className="p-3 border-t"
        style={{ borderColor: "var(--sp-border)" }}
      >
        <div
          className="flex items-center gap-3 p-2.5 rounded-lg"
          style={{ backgroundColor: "var(--sp-surface)" }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            AU
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "var(--sp-fg)" }}
            >
              Admin User
            </p>
            <p
              className="text-[10px] truncate"
              style={{ color: "var(--sp-muted)" }}
            >
              System Administrator
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 p-1 rounded hover:bg-[var(--sp-border)] transition-colors"
            style={{ color: "var(--sp-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--sp-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--sp-muted)";
            }}
          >
            <SignOut className="text-sm" weight="duotone" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
