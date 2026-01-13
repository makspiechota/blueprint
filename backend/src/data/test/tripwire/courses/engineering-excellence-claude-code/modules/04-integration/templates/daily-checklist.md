# Daily Engineering Excellence Checklist

Print this or keep it visible. Check off as you go.

---

## Morning Setup (10 min)

- [ ] CLAUDE.md is current and accurate
- [ ] Today's tasks identified
- [ ] Tasks decomposed into batches
- [ ] Relevant context gathered
- [ ] Test watcher running
- [ ] Environment ready

---

## Per Feature

### Context Phase
- [ ] Reviewed architecture for affected areas
- [ ] Identified domain rules that apply
- [ ] Found example patterns to follow
- [ ] Listed files that will change

### Spec Phase
- [ ] Happy path test written
- [ ] Edge case tests written
- [ ] Error case tests written
- [ ] All tests fail (Red)

### Decomposition Phase
- [ ] Feature broken into batches
- [ ] Each batch passes 30-minute rule
- [ ] Dependencies identified
- [ ] Explicit scope for each batch

### Implementation Phase (per batch)
- [ ] Context provided to Claude Code
- [ ] Spec (test) provided
- [ ] Output reviewed line-by-line
- [ ] Tests pass (Green)
- [ ] Code matches conventions
- [ ] Committed

### Review Phase
- [ ] All tests still passing
- [ ] No unintended changes
- [ ] Ready for PR/merge

---

## End of Day (10 min)

- [ ] All tests passing
- [ ] No uncommitted work (or WIP noted)
- [ ] New patterns documented
- [ ] CLAUDE.md updated if needed
- [ ] Tomorrow's context identified

---

## Weekly Review

- [ ] Batches/day: _____
- [ ] Avg batch time: _____ min
- [ ] Issues caught in review: _____
- [ ] Issues escaped: _____
- [ ] CLAUDE.md improvements made
- [ ] Trust calibration updated

---

## Notes

_Space for daily observations, patterns noticed, improvements to make_
