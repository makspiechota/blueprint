# Spec Clarity Checker

Use this prompt to validate your specifications are clear enough for AI execution.

---

## Prompt

```markdown
SPEC CLARITY CHECKER
--------------------
I have a feature request: [FEATURE]

Here are my acceptance criteria:
[PASTE YOUR GIVEN-WHEN-THEN SCENARIOS]

Analyze this specification for AI-executability:

1. **Ambiguity Check**: Is the expected behavior unambiguous? List any parts that could be interpreted multiple ways.

2. **Verifiability Check**: Can success/failure be automatically verified? For each THEN clause, explain how you would test it.

3. **Completeness Check**: What clarifying questions would an engineer ask? List questions that aren't answered by the specification.

4. **Rewrite**: Rewrite the specification with improvements, keeping the GIVEN-WHEN-THEN format.
```

---

## Example Usage

**Input:**
```
I have a feature request: User login

Here are my acceptance criteria:
GIVEN a user exists
WHEN they login
THEN they are logged in
```

**Expected Output:**
```
1. Ambiguity Check:
   - "user exists" - What makes a user valid? Active? Verified email?
   - "they login" - Login with what? Username? Email? Password? OAuth?
   - "logged in" - What does this mean? Redirect? Token? Session?

2. Verifiability Check:
   - "logged in" cannot be automatically verified without defining
     what observable state change occurs.

3. Clarifying Questions:
   - What authentication method is used?
   - What happens on invalid credentials?
   - Is there rate limiting?
   - What happens to existing sessions?

4. Rewrite:
   GIVEN a verified user with email "user@example.com" and password "ValidPass123!"
   WHEN they submit the login form with correct credentials
   THEN they receive a 200 response with a JWT token
   AND they are redirected to "/dashboard"
   AND the JWT is stored in an httpOnly cookie named "auth_token"
```
