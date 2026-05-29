#!/usr/bin/env python3
"""Stateless test of Phase 2 solution existence."""
import sys
from collections import defaultdict
from ortools.sat.python import cp_model

# Minimum setup to reproduce the issue with T-ROOM
rooms = [('R_math','classroom'), ('R_gym','gymnasium')]
slots = ['S1','S2','S3','S4']
pairs = [('T1','C1')]
pair_subjects = {('T1','C1'): {'math','sports'}}
subj_room_type = {'math':'classroom', 'sports':'gymnasium'}
blocked = {'T1': set()}
quals   = {'T1': set()}

def test_phase2(label, use_h5=False, use_h6=False, h1h1_pk=False, maximize=True):
    m = cp_model.CpModel()
    a = {}; ts=defaultdict(list); cs=defaultdict(list); rs=defaultdict(list); pp=defaultdict(list)
    for tid,cid in pairs:
        for rid,rt in rooms:
            for sid in slots:
                key = (tid,cid,rid,sid)
                v = m.NewBoolVar(f"a_{key[0]}_{key[1]}_{key[2]}_{key[3]}")
                a[key] = v
                ts[(tid,sid)].append(v); cs[(cid,sid)].append(v)
                rs[(rid,sid)].append(v); pp[(tid,cid)].append(v)
    for vs in ts.values():  m.Add(sum(vs) <= 1)   # H1
    for vs in cs.values():  m.Add(sum(vs) <= 1)   # H2
    for vs in rs.values(): m.Add(sum(vs) <= 1)   # H3
    if use_h5:
        for (tid,cid,rid,sid), var in a.items():
            for s in pair_subjects.get((tid,cid),set()):
                rt = subj_room_type.get(s,'')
                rm_t = dict(rooms).get(rid,'')
                if rt and rt != rm_t:
                    m.Add(var==0); break
    if use_h6:
        for (tid,cid,rid,sid), var in a.items():
            qs = quals.get(tid,set())
            if qs:
                pair_allows = any(s in qs for s in pair_subjects.get((tid,cid),set()))
                if not pair_allows: m.Add(var==0)
    if maximize:
        m.Maximize(sum(a.values()))
    else:
        for (tid,cid),vs in pp.items():
            m.Add(sum(vs) == 4)   # all-or-nothing H7

    s = cp_model.CpSolver()
    s.parameters.max_time_in_seconds = 10
    s.parameters.log_search_progress = False
    st = s.Solve(m)
    is_ok = st in [cp_model.CpSolverStatus.OPTIMAL, cp_model.CpSolverStatus.FEASIBLE]
    cnt = sum(1 for v in a.values() if s.Value(v)==1) if is_ok else -1
    print(f"  [{label}] status={st.name}  ok={is_ok}  cnt={cnt}")
    return is_ok and cnt

print("T-ROOM – phase2 capabilities:")
test_phase2("H1-H3 only, maximize", use_h5=False, use_h6=False)
test_phase2("H1-H3+H5, maximize", use_h5=True, use_h6=False)
test_phase2("H1-H3+H5+H6, maximize", use_h5=True, use_h6=True)

print("\n\nAnd to be clear OR-Tools int statuses:")
from ortools.sat.python import cp_model as cpm
for name in ['OPTIMAL','FEASIBLE','INFEASIBLE','UNKNOWN']:
    val = getattr(cpm.CpSolverStatus, name)
    print(f"  {name} = {int(val)} = {val.name}")
print()
print(f"OPTIMAL == 0: {cpm.CpSolverStatus.OPTIMAL == 0}")
print(f"FEASIBLE == 2: {cpm.CpSolverStatus.FEASIBLE == 2}")

# Minimal test: 0-phase-minimal
print("\n\n=== FINAL WORD ===")
print(f"  OPTIMAL={int(cpm.CpSolverStatus.OPTIMAL)}   FEASIBLE={int(cpm.CpSolverStatus.FEASIBLE)}")
print(f"  Must check: status == CpSolverStatus.OPTIMAL or == CpSolverStatus.FEASIBLE")
print(f"  Must NOT check: status == 0")
