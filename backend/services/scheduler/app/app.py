try:
    from fastapi import FastAPI
except ImportError as exc:
    raise ImportError("fastapi is required. Install it with 'pip install fastapi'.") from exc

from app.schemas import SchedulerInput
from app.solver import solve_scheduler

app = FastAPI()


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/solve")
def solve(data: SchedulerInput):
    solution = solve_scheduler(data)
    return {"status": "SUCCESS" if solution else "INFEASIBLE", "solution": solution}
