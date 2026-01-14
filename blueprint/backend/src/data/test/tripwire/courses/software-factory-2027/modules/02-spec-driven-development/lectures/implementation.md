# Implementation: Writing AI-Executable Specs (10 min)

## Writing Specifications AI Can Execute Against

### The GIVEN-WHEN-THEN Format

```gherkin
GIVEN [precondition/context]
WHEN [action/trigger]
THEN [expected outcome]
AND [additional outcomes]
```

This format is powerful because:
- **GIVEN** establishes clear context
- **WHEN** defines a single action
- **THEN** specifies verifiable outcomes

### From Business Requirement to Testable Spec

**Business Requirement:**
> "Users should be able to reset their password"

**Step 1: Identify the user journey**
- User clicks "forgot password"
- User enters email
- User receives email
- User clicks link
- User enters new password
- User confirms new password

**Step 2: Write acceptance criteria for each step**

```gherkin
Feature: Password Reset

Scenario: Request password reset
  GIVEN a registered user with email "user@example.com"
  WHEN they request a password reset
  THEN they receive an email within 5 minutes
  AND the email contains a reset link valid for 24 hours

Scenario: Reset password with valid link
  GIVEN a valid password reset link
  WHEN the user enters a new password meeting requirements
  AND confirms the password
  THEN the password is updated
  AND the user receives a confirmation email
  AND all existing sessions are invalidated
```

## Common Mistakes and How to Avoid Them

### Mistake 1: Vague Outcomes
- Bad: "THEN the feature works correctly"
- Good: "THEN the user sees a success message containing 'Password updated'"

### Mistake 2: Missing Edge Cases
Always consider:
- Empty inputs
- Invalid inputs
- Network failures
- Race conditions
- Permission boundaries

### Mistake 3: Implementation Details in Specs
- Bad: "THEN the system calls the UserService.resetPassword() method"
- Good: "THEN the user's password is updated in the system"

### Mistake 4: Compound Actions
- Bad: "WHEN the user logs in and navigates to settings and changes their email"
- Good: Split into separate scenarios

## The Specification Checklist

Before handing specs to AI, verify:

- [ ] Each scenario has clear GIVEN-WHEN-THEN structure
- [ ] Outcomes are observable and verifiable
- [ ] Edge cases are covered
- [ ] No implementation details leaked into specs
- [ ] An engineer could write tests from these specs
