import os
import json
import logging
from time import time
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from .solver import solve_scheduler

# JSON Logger setup
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "service": "python-solver",
            "request_id": getattr(record, "request_id", "none"),
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

logger = logging.getLogger("solver")
logger.setLevel(logging.INFO)
# Remove any existing handlers
for handler in logger.handlers[:]:
    logger.removeHandler(handler)
handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger.addHandler(handler)

app = FastAPI()

# Middleware to log requests and responses
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Generate or get request ID
    request_id = request.headers.get("x-request-id")
    if not request_id:
        # If no request ID, generate one (though Next.js middleware should provide one)
        import random
        request_id = f"{random.randint(100000, 999999)}-{random.randint(100000, 999999)}"
    
    # Add request_id to logger extra for JsonFormatter
    old_factory = logging.getLogRecordFactory()
    def record_factory(*args, **kwargs):
        record = old_factory(*args, **kwargs)
        record.request_id = request_id
        return record
    logging.setLogRecordFactory(record_factory)
    
    try:
        start_time = time()
        
        # Log request
        logger.info(
            "Incoming request",
            extra={
                "method": request.method,
                "url": str(request.url),
                "client_ip": request.client.host if request.client else None,
            }
        )
        
        # Process request
        response = await call_next(request)
        
        # Log response
        process_time = time() - start_time
        logger.info(
            "Request completed",
            extra={
                "status_code": response.status_code,
                "process_time_ms": round(process_time * 1000, 2),
            }
        )
        
        # Add request ID to response headers for tracing
        response.headers["x-request-id"] = request_id
        return response
    except Exception as exc:
        # Log exception
        process_time = time() - start_time
        logger.error(
            "Request failed",
            extra={
                "exception": str(exc),
                "process_time_ms": round((time() - start_time) * 1000, 2),
            },
            exc_info=True
        )
        # Re-raise to let FastAPI handle the exception
        raise
    finally:
        # Reset log record factory
        logging.setLogRecordFactory(old_factory)

SOLVER_SECRET = os.environ.get("SOLVER_SECRET", "")


class Requirement(BaseModel):
    teacherId: int
    classId: int
    hoursPerWeek: int


class Room(BaseModel):
    id: int


class Slot(BaseModel):
    id: int


class Teacher(BaseModel):
    id: int


class ClassItem(BaseModel):
    id: int


class ScheduleRequest(BaseModel):
    requirements: List[Requirement]
    rooms: List[Room]
    slots: List[Slot]
    teachers: List[Teacher]
    classes: List[ClassItem]


@app.get("/")
async def health():
    return {"status": "ok"}


@app.post("/solve")
async def solve(data: ScheduleRequest, x_solver_secret: Optional[str] = Header(None)):
    if SOLVER_SECRET and x_solver_secret != SOLVER_SECRET:
        logger.warning("Invalid solver secret attempt")
        raise HTTPException(status_code=401, detail="Unauthorized")

    result = solve_scheduler(data)
    return {"status": "success" if result else "failed", "schedule": result}