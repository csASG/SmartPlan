"use client";

import { useEffect, useState, useCallback } from "react";
import { Topbar } from "@/components/topbar";
import { useParams } from "next/navigation";
import { Plus, X } from "@phosphor-icons/react";
import { apiFetch, getStoredToken } from "@/lib/api";

interface ResourceField {
  key: string;
  label: string;
  type: "text" | "number";
  placeholder?: string;
}

interface ResourceConfig {
  title: string;
  subtitle: string;
  singular: string;
  apiPath: string;
  columns: { key: string; label: string }[];
  fields: ResourceField[];
  mapData: (item: any) => Record<string, string>;
}

const RESOURCE_CONFIGS: Record<string, ResourceConfig> = {
  teachers: {
    title: "Teachers",
    subtitle: "Manage teaching staff",
    singular: "Teacher",
    apiPath: "/teachers",
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
    ],
    fields: [
      { key: "name", label: "Full Name", type: "text", placeholder: "Dr. Schmidt" },
    ],
    mapData: (t) => ({
      id: String(t.id),
      name: t.name,
      email: t.user?.email ?? "—",
    }),
  },
  students: {
    title: "Students",
    subtitle: "Manage student roster",
    singular: "Student",
    apiPath: "/users",
    columns: [
      { key: "displayName", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
    ],
    fields: [
      { key: "email", label: "Email", type: "text", placeholder: "student@schule.de" },
      { key: "password", label: "Password", type: "text", placeholder: "mindestens 8 Zeichen" },
      { key: "displayName", label: "Display Name", type: "text", placeholder: "Max Mustermann" },
    ],
    mapData: (u) => ({
      id: String(u.id),
      displayName: u.displayName ?? "—",
      email: u.email,
      role: u.role,
    }),
  },
  rooms: {
    title: "Rooms",
    subtitle: "Manage rooms and facilities",
    singular: "Room",
    apiPath: "/rooms",
    columns: [
      { key: "name", label: "Name" },
      { key: "capacity", label: "Capacity" },
    ],
    fields: [
      { key: "name", label: "Room Name", type: "text", placeholder: "R101" },
      { key: "capacity", label: "Capacity", type: "number", placeholder: "30" },
    ],
    mapData: (r) => ({
      id: String(r.id),
      name: r.name,
      capacity: String(r.capacity ?? "—"),
    }),
  },
  classes: {
    title: "Classes",
    subtitle: "Manage class groups",
    singular: "Class",
    apiPath: "/classes",
    columns: [
      { key: "name", label: "Name" },
      { key: "year", label: "Year" },
    ],
    fields: [
      { key: "name", label: "Class Name", type: "text", placeholder: "10A" },
      { key: "year", label: "Year", type: "number", placeholder: "10" },
    ],
    mapData: (c) => ({
      id: String(c.id),
      name: c.name,
      year: String(c.year ?? "—"),
    }),
  },
};

function AddDialog({
  config,
  onClose,
  onCreated,
}: {
  config: ResourceConfig;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = getStoredToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const body: Record<string, any> = {};
      for (const field of config.fields) {
        const val = form[field.key];
        if (val === undefined || val === "") continue;
        body[field.key] = field.type === "number" ? Number(val) : val;
      }

      await apiFetch(config.apiPath, {
        method: "POST",
        token,
        body: JSON.stringify(body),
      });

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        className="relative w-full max-w-md mx-4 rounded-xl border p-6"
        style={{
          backgroundColor: "var(--sp-surface)",
          borderColor: "var(--sp-border)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold" style={{ color: "var(--sp-fg)" }}>
            Add {config.singular}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
            style={{ color: "var(--sp-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--sp-fg)";
              e.currentTarget.style.backgroundColor = "var(--sp-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--sp-muted)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X className="text-sm" weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label
                className="block text-[11px] font-mono font-semibold mb-1.5 uppercase tracking-[0.12em]"
                style={{ color: "var(--sp-muted)" }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key] ?? ""}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-xs font-mono transition-all duration-200 outline-none"
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
                required
              />
            </div>
          ))}

          {error && (
            <div
              className="px-3 py-2 rounded-lg text-xs font-mono"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono border transition-colors"
              style={{
                borderColor: "var(--sp-border)",
                color: "var(--sp-muted)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--sp-accent)", color: "white" }}
            >
              {loading ? "Creating..." : `Add ${config.singular}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const params = useParams();
  const resourceType = (params?.slug as string) || "teachers";
  const config = RESOURCE_CONFIGS[resourceType] || RESOURCE_CONFIGS.teachers;
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const fetchData = useCallback(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    apiFetch(config.apiPath, { token })
      .then((items: any) => {
        setData(items.map(config.mapData));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [config.apiPath, resourceType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleDelete(id: string) {
    if (!confirm("Wirklich löschen?")) return;
    const token = getStoredToken();
    if (!token) return;

    try {
      await apiFetch(`${config.apiPath}/${id}`, {
        method: "DELETE",
        token,
      });
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  }

  return (
    <>
      <Topbar
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--sp-accent)", color: "white" }}
          >
            <Plus weight="bold" />
            Add {config.singular}
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
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--sp-border)" }}>
                {config.columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3.5 text-left font-mono font-semibold uppercase tracking-[0.12em] text-[10px]"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    {col.label}
                  </th>
                ))}
                <th
                  className="px-6 py-3.5 text-right font-mono font-semibold uppercase tracking-[0.12em] text-[10px]"
                  style={{ color: "var(--sp-muted)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="px-6 py-8 text-center font-mono text-xs"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="px-6 py-8 text-center font-mono text-xs"
                    style={{ color: "var(--sp-muted)" }}
                  >
                    No entries found. Click &quot;Add {config.singular}&quot; to create one.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b last:border-b-0 transition-colors hover:bg-[var(--sp-bg)]"
                    style={{ borderColor: "var(--sp-border)" }}
                  >
                    {config.columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-6 py-3.5 font-medium"
                        style={{ color: "var(--sp-fg)" }}
                      >
                        {col.key === "role" ? (
                          <span
                            className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                            style={{
                              backgroundColor:
                                row[col.key] === "ADMIN"
                                  ? "rgba(139, 92, 246, 0.1)"
                                  : row[col.key] === "TEACHER"
                                  ? "rgba(59, 130, 246, 0.1)"
                                  : "rgba(16, 185, 129, 0.1)",
                              color:
                                row[col.key] === "ADMIN"
                                  ? "#8b5cf6"
                                  : row[col.key] === "TEACHER"
                                  ? "#3b82f6"
                                  : "#10b981",
                            }}
                          >
                            {row[col.key]}
                          </span>
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-[11px] font-mono transition-colors"
                        style={{ color: "var(--sp-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--sp-muted)";
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p
            className="text-[11px] font-mono"
            style={{ color: "var(--sp-muted)" }}
          >
            {data.length} entries
          </p>
        </div>
      </div>

      {/* Add Dialog */}
      {showAdd && (
        <AddDialog
          config={config}
          onClose={() => setShowAdd(false)}
          onCreated={fetchData}
        />
      )}
    </>
  );
}
