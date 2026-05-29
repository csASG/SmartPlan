#!/usr/bin/env python3
"""Inspect exact Phase 2 model and solver behavior."""
import sys, os
from collections import defaultdict
from ortools.sat.python import cp_model

rooms_d  = [('R_math', 'classroom'), ('R_gym', 'gymnasium')]
slots    = ['S1', 'S2', 'S3', 'S4']    # slot_ids
pairs    = [('T1', 'C1')]
pair_subjects = {('T1', 'C1'): {'sports', 'math'}}
pair_hours  = {('T1', 'C1'): 4}
subj_room_type = {'math': 'classroom', 'sports': 'gymnasium'}
blocked   = {'T1': set()}
quals     = {'T1': set()}   # No qualification

print("="*60)
print("Phase 2 model construction")
print("="*60)

m  = cp_model.CpModel()
a  = {}
ts = defaultdict(list); cs = defaultdict(list); rs = defaultdict(list); pp = defaultdict(list)

for tid, cid in pairs:
    for rm in rooms_d:
        for sid in slots:
            key = (tid, cid, rm[0], sid)
            v = m.NewBoolVar(f"a_{key[0]}_{key[1]}_{key[2]}_{key[3]}")
            a[key] = v
            ts[(tid,  sid)].append(v)
            cs[(cid,  sid)].append(v)
            rs[(rm[0], sid)].append(v)
            pp[(tid,cid)].append(v)
            print(f"  var: {key}")

print(f"\nTotal vars: {len(a)}")

def show_constraints(label, vs):
    print(f"  [{label}] {len(vs)} constraints")

for vs in ts.values():  m.Add(sum(vs) <= 1)
show_constraints("H1 teacher", ts.values())
for vs in cs.values():  m.Add(sum(vs) <= 1)
show_constraints("H2 class",  cs.values())
for vs in rs.values(): m.Add(sum(vs) <= 1)
show_constraints("H3 room",   rs.values())

# H5 room-type
b5 = 0
for (tid,cid,rid,sid), var in a.items():
    rm_t = dict(rooms_d).get(rid,'')
    if not rm_t: continue
    for s in pair_subjects.get((tid,cid), set()):
        rt = subj_room_type.get(s,'')
        if rt and rt != rm_t:
            m.Add(var == 0); b5 += 1
            print(f"  H5 BLOCKED: {tid},{cid},{rid},{sid} (subj={s})")
print(f"  H5 total blocked: {b5}")

m.Maximize(sum(a.values()))
print(f"\nMaximize vars: {sum(1 for _ in a)}")

s = cp_model.CpSolver()
s.parameters.max_time_in_seconds = 15
s.parameters.log_search_progress = False
st = s.Solve(m)

print(f"\nSolver status: {st.name}")
print(f"  OK: {st in [cp_model.CpSolverStatus.OPTIMAL, cp_model.CpSolverStatus.FEASIBLE]}")
if st in [0, 2]:
    soln = [k for k,v in a.items() if s.Value(v)==1]
    print(f"  Result: {len(soln)}")
    for k in soln: print(f"    T={k[0]} C={k[1]} R={k[2]} S={k[3]}")
else:
    print("  INFEASIBLE")
    # dump all vars
    print(f"\n  Var dump ({len(a)} total):")
    for k,v in sorted(a.items(), key=lambda x: x[0]):
        used = v == 1  # we don't have a value when infeasible
        print(f"    {k} = {s.Value(v) if st in [0,2] else '??'}")
