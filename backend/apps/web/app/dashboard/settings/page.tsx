"use client";

import { Topbar } from "@/components/topbar";
import { Gear, Database } from "@phosphor-icons/react";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" subtitle="System configuration" />

      <div className="p-8 space-y-6 max-w-2xl">
        {/* General Settings */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--sp-surface)",
            borderColor: "var(--sp-border)",
          }}
        >
          <div
            className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: "var(--sp-border)" }}
          >
            <Gear className="text-base" weight="duotone" style={{ color: "var(--sp-muted)" }} />
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--sp-fg)" }}
            >
              General
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label
                className="block text-[11px] font-mono font-semibold mb-2 uppercase tracking-[0.12em]"
                style={{ color: "var(--sp-muted)" }}
              >
                School Name
              </label>
              <input
                type="text"
                defaultValue="SmartPlan School"
                className="w-full px-4 py-2.5 rounded-lg border text-sm font-mono transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "var(--sp-bg)",
                  borderColor: "var(--sp-border)",
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
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-mono font-semibold mb-2 uppercase tracking-[0.12em]"
                style={{ color: "var(--sp-muted)" }}
              >
                School Year
              </label>
              <input
                type="text"
                defaultValue="2026 / 2027"
                className="w-full px-4 py-2.5 rounded-lg border text-sm font-mono transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "var(--sp-bg)",
                  borderColor: "var(--sp-border)",
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
              />
            </div>
          </div>
        </div>

        {/* Solver Settings */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--sp-surface)",
            borderColor: "var(--sp-border)",
          }}
        >
          <div
            className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: "var(--sp-border)" }}
          >
            <Database className="text-base" weight="duotone" style={{ color: "var(--sp-muted)" }} />
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--sp-fg)" }}
            >
              Solver Configuration
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-[11px] font-mono font-semibold mb-2 uppercase tracking-[0.12em]"
                  style={{ color: "var(--sp-muted)" }}
                >
                  Max Solve Time (sec)
                </label>
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm font-mono transition-all duration-200 outline-none"
                  style={{
                    backgroundColor: "var(--sp-bg)",
                    borderColor: "var(--sp-border)",
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
                />
              </div>
              <div>
                <label
                  className="block text-[11px] font-mono font-semibold mb-2 uppercase tracking-[0.12em]"
                  style={{ color: "var(--sp-muted)" }}
                >
                  Periods per Day
                </label>
                <input
                  type="number"
                  defaultValue={10}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm font-mono transition-all duration-200 outline-none"
                  style={{
                    backgroundColor: "var(--sp-bg)",
                    borderColor: "var(--sp-border)",
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
                />
              </div>
            </div>
            <div>
              <label
                className="block text-[11px] font-mono font-semibold mb-2 uppercase tracking-[0.12em]"
                style={{ color: "var(--sp-muted)" }}
              >
                Days per Week
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-4 py-2.5 rounded-lg border text-sm font-mono transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "var(--sp-bg)",
                  borderColor: "var(--sp-border)",
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
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="px-6 py-2.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--sp-accent)", color: "white" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
