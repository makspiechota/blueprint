# The Principle: Why Specs Matter for AI (10 min)

## Why "Write Code That Does X" Fails

When you tell AI "build a login feature," you're relying on the AI to:
- Guess your authentication method (OAuth? JWT? Session?)
- Assume your UI requirements
- Decide on error handling
- Choose validation rules
- Pick security measures

The result? Code that technically "works" but doesn't match what you actually needed.

## Acceptance Criteria as Executable Specifications

The solution is to define **what success looks like** before asking AI to implement.

### Bad Specification
> "Add a login feature to the app"

### Good Specification
```gherkin
GIVEN a user with valid credentials
WHEN they submit the login form
THEN they receive a JWT token
AND they are redirected to the dashboard
AND the token is stored in httpOnly cookie

GIVEN a user with invalid credentials
WHEN they submit the login form
THEN they see an error message "Invalid email or password"
AND the form is not cleared
AND they remain on the login page
```

## The Specification Hierarchy

```
User Story
    ↓
Acceptance Criteria (GIVEN-WHEN-THEN)
    ↓
Test Cases (automated verification)
```

Each level adds more precision, making AI execution more reliable.

## Involving Engineers in Discovery (Product Engineering)

The best specifications come from collaboration:

1. **Product** defines the user story and business value
2. **Engineering** asks clarifying questions about edge cases
3. **Together** they write acceptance criteria
4. **AI** implements to make the criteria pass

This is "Product Engineering" - engineers involved in discovery, not just delivery.

## Key Insight

> "AI can't read minds. But AI can read specifications. The quality of AI output is directly proportional to the quality of specifications."
