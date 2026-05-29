"""
Time conflict detection for timetable events.

A conflict occurs when two events occupy overlapping time ranges
and share a constrained resource (teacher, room, or class).
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple
from datetime import datetime


@dataclass
class Event:
    id: str
    start: datetime
    end: datetime
    teacher_id: Optional[str] = None
    class_id: Optional[str] = None
    room_id: Optional[str] = None


@dataclass
class Conflict:
    event_a_id: str
    event_b_id: str
    resource_type: str  # "teacher" | "class" | "room"
    resource_id: str
    overlap_start: datetime
    overlap_end: datetime


def _overlap_duration(
    a_start: datetime,
    a_end: datetime,
    b_start: datetime,
    b_end: datetime,
) -> float:
    """Return overlap duration in seconds. 0 means no overlap."""
    latest_start = max(a_start, b_start)
    earliest_end = min(a_end, b_end)
    return (earliest_end - latest_start).total_seconds()


def _has_overlap(
    a_start: datetime,
    a_end: datetime,
    b_start: datetime,
    b_end: datetime,
) -> bool:
    return _overlap_duration(a_start, a_end, b_start, b_end) > 0


def check_time_conflicts(events: List[Event]) -> List[Conflict]:
    """
    Detect all resource-level conflicts in a list of events.

    Returns a list of Conflict objects describing every pair-wise
    violation found across teachers, classes, and rooms.
    """
    conflicts: List[Conflict] = []

    for i in range(len(events)):
        a = events[i]
        for j in range(i + 1, len(events)):
            b = events[j]
            if not _has_overlap(a.start, a.end, b.start, b.end):
                continue

            overlap_start = max(a.start, b.start)
            overlap_end = min(a.end, b.end)

            # Teacher conflict
            if (
                a.teacher_id is not None
                and b.teacher_id is not None
                and a.teacher_id == b.teacher_id
            ):
                conflicts.append(
                    Conflict(
                        event_a_id=a.id,
                        event_b_id=b.id,
                        resource_type="teacher",
                        resource_id=a.teacher_id,
                        overlap_start=overlap_start,
                        overlap_end=overlap_end,
                    )
                )

            # Class conflict
            if a.class_id is not None and b.class_id is not None and a.class_id == b.class_id:
                conflicts.append(
                    Conflict(
                        event_a_id=a.id,
                        event_b_id=b.id,
                        resource_type="class",
                        resource_id=a.class_id,
                        overlap_start=overlap_start,
                        overlap_end=overlap_end,
                    )
                )

            # Room conflict
            if a.room_id is not None and b.room_id is not None and a.room_id == b.room_id:
                conflicts.append(
                    Conflict(
                        event_a_id=a.id,
                        event_b_id=b.id,
                        resource_type="room",
                        resource_id=a.room_id,
                        overlap_start=overlap_start,
                        overlap_end=overlap_end,
                    )
                )

    return conflicts
