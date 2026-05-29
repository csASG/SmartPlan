from pydantic import BaseModel
from typing import List, Optional, Union


class Requirement(BaseModel):
    teacherId: Union[str, int]
    classId: Union[str, int]
    subjectId: Union[str, int]
    hoursPerWeek: int
    requiredRoomType: Optional[str] = None


class Teacher(BaseModel):
    id: Union[str, int]
    fullName: Optional[str] = None
    availableSlots: Optional[List[str]] = None
    unavailableSlots: Optional[List[str]] = None
    qualifiedSubjects: Optional[List[str]] = None


class ClassItem(BaseModel):
    id: Union[str, int]
    name: Optional[str] = None


class Room(BaseModel):
    id: Union[str, int]
    name: Optional[str] = None
    roomType: Optional[str] = None


class Slot(BaseModel):
    id: Union[str, int]
    day: Optional[str] = None
    period: Optional[int] = None


class SchedulerInput(BaseModel):
    teachers: List[Teacher]
    classes: List[ClassItem]
    rooms: List[Room]
    slots: List[Slot]
    requirements: List[Requirement]
    maxSolveSeconds: Optional[float] = 15.0


Class = ClassItem  # backward-compatible alias used by existing tests and integration code
