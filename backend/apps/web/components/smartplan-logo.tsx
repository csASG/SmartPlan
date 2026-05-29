import { CalendarCheck } from "@phosphor-icons/react";

interface SmartPlanLogoProps {
  className?: string;
}

export function SmartPlanLogo({ className }: SmartPlanLogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border border-[var(--sp-border)] mb-4 shadow-xl ${className ?? ""}`}
      style={{ backgroundColor: "var(--sp-surface)" }}
    >
      <CalendarCheck className="text-2xl" style={{ color: "var(--sp-accent)" }} weight="duotone" />
    </div>
  );
}
