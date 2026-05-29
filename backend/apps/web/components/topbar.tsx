"use client";

import { type ReactNode } from "react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  return (
    <header
      className="h-14 border-b px-8 flex items-center justify-between sticky top-0 z-20"
      style={{
        backgroundColor: "var(--sp-bg)",
        borderColor: "var(--sp-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div>
        <h1
          className="text-base font-bold tracking-tight"
          style={{ color: "var(--sp-fg)" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-[11px] font-mono"
            style={{ color: "var(--sp-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
