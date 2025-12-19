# Task: Update Example File with New WHY Structure

## User Story Reference
All user stories (demonstrates proper usage)

## Description
Update the sample architectural scope example file to use the new WHY structure with mission and goals. Position WHY first in the file and ensure goals start with "To".

## Files to Modify/Create
- `examples/sample-architectural-scope.yaml` - Update to new structure

## Estimated Lines of Code
~25 lines (restructure WHY section)

## Dependencies
- Task 001 (schema updated)

## Implementation Notes

Update the example file with WHY-first ordering and new structure:

```yaml
type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "CourseIQ Learning Platform"
north_star_ref: "sample-north-star.yaml"

why:
  mission:
    action: "to provide"
    service: "intelligent course recommendation and learning path optimization"
    beneficiary: "students and educational institutions"
  goals:
    - title: "To increase student course completion rates"
      description: "Improve learning outcomes by matching students with optimal courses based on their goals and learning style"
    - title: "To reduce course selection time"
      description: "Enable students to find relevant courses quickly through intelligent recommendations"
    - title: "To enhance institutional insights"
      description: "Provide educational institutions with data-driven insights about course effectiveness and student success"

what:
  - title: "Student Profile"
    description: "Comprehensive academic and demographic data for enrolled students"
  # ... rest of existing what items

how:
  # ... existing items

where:
  # ... existing items

who:
  # ... existing items

when:
  # ... existing items
```

**Key Changes**:
1. Move WHY to first position
2. Change WHY from array to object with mission + goals
3. Mission has three components: action, service, beneficiary
4. Goals start with "To"
5. Goals emphasize capability-specific objectives (not enterprise-wide)
6. Update descriptions to clarify ongoing nature

## Acceptance Criteria
- [ ] WHY is first scope dimension in file
- [ ] WHY has mission object with action, service, beneficiary
- [ ] Mission action starts with "to"
- [ ] Goals array with 3-5 items
- [ ] All goal titles start with "To"
- [ ] Goals are capability-specific (not enterprise-wide)
- [ ] File validates against updated schema
- [ ] Example demonstrates proper WHY usage
