# Hands-On Exercise (10 min)

## Exercise: Convert a Real Feature to Executable Specs

### Step 1: Choose a Feature

Pick a feature from your current backlog. Ideally:
- Something you'll implement in the next 2 weeks
- Not too complex (can be described in 3-5 scenarios)
- Has clear business value

**Your chosen feature:** _______________

### Step 2: Write the User Story

```
As a [type of user]
I want [capability]
So that [business value]
```

**Your user story:**
_______________________________________________
_______________________________________________

### Step 3: Draft Acceptance Criteria

Write 3-5 scenarios in GIVEN-WHEN-THEN format:

**Scenario 1: Happy Path**
```gherkin
GIVEN _______________
WHEN _______________
THEN _______________
```

**Scenario 2: Error Case**
```gherkin
GIVEN _______________
WHEN _______________
THEN _______________
```

**Scenario 3: Edge Case**
```gherkin
GIVEN _______________
WHEN _______________
THEN _______________
```

### Step 4: Validate with Claude

Copy your scenarios and use the **Spec Clarity Checker** prompt to validate:

1. Are the scenarios unambiguous?
2. Can success/failure be automatically verified?
3. What clarifying questions would an engineer ask?

### Step 5: Refine

Based on Claude's feedback:
- Add missing edge cases
- Clarify ambiguous outcomes
- Remove implementation details

### Reflection Questions

1. How much clearer is this specification compared to how you'd normally describe the feature?

2. Could a new team member understand exactly what to build from these specs?

3. Could automated tests be written directly from these acceptance criteria?

## What You've Learned

- The GIVEN-WHEN-THEN format for specifications
- How to convert vague requirements to executable specs
- Using AI to validate specification quality
- The spec clarity checklist

## Next Steps

In Module 3, you'll learn how to break features into AI-sized batches using these specifications as the foundation.
