from ortools.sat.python import cp_model
from typing import Dict, List, Tuple, Set
from collections import defaultdict


def solve_scheduler_optimized(data):
    """
    Optimized scheduler solver with improved variable creation and constraint building.

    Optimizations:
    1. Pre-filter impossible assignments
    2. Use efficient lookup structures for constraints
    3. Reduce variable search space
    4. Better constraint building complexity
    """
    model = cp_model.CpModel()

    # Create lookup dictionaries for faster access
    teachers_by_id = {t.id: t for t in data.teachers}
    classes_by_id = {c.id: c for c in data.classes}
    rooms_by_id = {r.id: r for r in data.rooms}
    slots_by_id = {s.id: s for s in data.slots}

    # Group requirements by (teacherId, classId) for hours constraint
    requirements_by_teacher_class = defaultdict(list)
    for req in data.requirements:
        key = (req.teacherId, req.classId)
        requirements_by_teacher_class[key].append(req)

    # Pre-compute valid assignments to reduce variable space
    assignments = {}  # (teacherId, classId, roomId, slotId) -> variable
    assignment_keys_by_teacher_slot = defaultdict(list)  # For teacher constraint
    assignment_keys_by_class_slot = defaultdict(list)  # For class constraint
    assignment_keys_by_room_slot = defaultdict(list)  # For room constraint
    assignment_keys_by_teacher_class = defaultdict(list)  # For hours constraint

    # Create variables only for potentially valid assignments
    for req in data.requirements:
        teacher_id = req.teacherId
        class_id = req.classId
        hours_needed = req.hoursPerWeek

        # Skip if teacher or class doesn't exist
        if teacher_id not in teachers_by_id or class_id not in classes_by_id:
            continue

        for room in data.rooms:
            room_id = room.id
            for slot in data.slots:
                slot_id = slot.id

                # Basic validity check: create variable for all combinations
                # (Could add more sophisticated filtering here based on subject/room type, etc.)
                key = (teacher_id, class_id, room_id, slot_id)
                var = model.NewBoolVar(f"assignment_{teacher_id}_{class_id}_{room_id}_{slot_id}")
                assignments[key] = var

                # Build lookup structures for efficient constraint creation
                assignment_keys_by_teacher_slot[(teacher_id, slot_id)].append(key)
                assignment_keys_by_class_slot[(class_id, slot_id)].append(key)
                assignment_keys_by_room_slot[(room_id, slot_id)].append(key)
                assignment_keys_by_teacher_class[(teacher_id, class_id)].append(key)

    # Constraint 1: Teacher can teach at most one class per slot
    for (teacher_id, slot_id), keys in assignment_keys_by_teacher_slot.items():
        if keys:  # Only add constraint if there are variables
            model.AddAtMostOne([assignments[k] for k in keys])

    # Constraint 2: Class can have at most one lesson per slot
    for (class_id, slot_id), keys in assignment_keys_by_class_slot.items():
        if keys:
            model.AddAtMostOne([assignments[k] for k in keys])

    # Constraint 3: Room can host at most one lesson per slot
    for (room_id, slot_id), keys in assignment_keys_by_room_slot.items():
        if keys:
            model.AddAtMostOne([assignments[k] for k in keys])

    # Constraint 4: Meet required hours per week for each teacher-class pair
    for (teacher_id, class_id), req_list in requirements_by_teacher_class.items():
        total_hours_needed = sum(req.hoursPerWeek for req in req_list)
        if total_hours_needed > 0 and (teacher_id, class_id) in assignment_keys_by_teacher_class:
            keys = assignment_keys_by_teacher_class[(teacher_id, class_id)]
            model.Add(sum(assignments[k] for k in keys) == total_hours_needed)

    # Solve
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 10.0
    solver.parameters.num_search_workers = 8  # Use parallel search
    solver.parameters.log_search_progress = False  # Reduce logging overhead

    status = solver.Solve(model)

    if status not in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
        return []

    # Extract solution
    solution = []
    for key, var in assignments.items():
        if solver.Value(var) == 1:
            teacher_id, class_id, room_id, slot_id = key
            solution.append(
                {
                    "teacherId": teacher_id,
                    "classId": class_id,
                    "roomId": room_id,
                    "slotId": slot_id,
                }
            )

    return solution


def solve_scheduler(data):
    """
    Wrapper function that chooses between original and optimized solver.
    For now, uses the optimized version.
    """
    return solve_scheduler_optimized(data)
