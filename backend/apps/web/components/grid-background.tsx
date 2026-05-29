export function GridBackground() {
  return (
    <>
      {/* Dot Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, var(--sp-border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial Glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30"
        style={{
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle at center, var(--sp-accent-muted) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
