const SOLVER_SECRET = process.env.SOLVER_SECRET ?? "";

export async function callSolver<T>(payload: unknown): Promise<T> {
  const schedulerUrl = process.env.SCHEDULER_URL ?? "http://scheduler:8000/solve";

  const response = await fetch(schedulerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(SOLVER_SECRET ? { "X-Solver-Secret": SOLVER_SECRET } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Scheduler request failed: ${response.status} ${response.statusText}${text ? ` – ${text}` : ""}`
    );
  }

  return response.json() as Promise<T>;
}
