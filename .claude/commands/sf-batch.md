# Product Analysis - Create Feature Backlog

Interview the user about the feature requirement and create a structured backlog entry.

## Process

1. **Interview the user**: Ask clarifying questions about the feature
   - What problem does this solve?
   - Who are the users?
   - What's the expected behavior?
   - What are the edge cases?
   - What's the business value?

2. **Create backlog structure**: Set up feature directory
   ```bash
   # Find next feature number
   NEXT_NUM=$(printf "%06d" $(($(ls -d backlog/*/ 2>/dev/null | wc -l) + 1)))

   # Create feature directory
   mkdir -p backlog/${NEXT_NUM}-short-feature-description/
   ```

   Format: `XXXXXX` = 6-digit counter (000001, 000002, etc.)
   Example: `backlog/000001-user-authentication/`

3. **Write feature.md**: Document the feature in business language

   Structure:
   ```markdown
   # Feature: [Feature Name]

   ## Problem
   [What problem does this solve?]

   ## Users
   [Who are the users?]

   ## User Stories
   1. As a [user type], I want to [action] so that [benefit]
   2. As a [user type], I want to [action] so that [benefit]
   3. ...

   ## Expected Behavior
   [What should happen?]

   ## Edge Cases
   [What edge cases to consider?]

   ## Success Criteria
   [How do we know this is done?]

   ## Business Value
   [Why is this important?]
   ```

4. **Call committer agent**: Review and commit the feature spec

   Pass to committer agent:
   - **Files**: `backlog/${FEATURE_NUM}-${FEATURE_NAME}/feature.md`
   - **Commit message**:
     ```
     feat: add feature ${FEATURE_NUM} - ${FEATURE_NAME}

     Feature specification for ${FEATURE_NAME}.
     Ready for technical planning with /sf-plan
     ```
   - **Context**: "feature specification"
   - **PR title**: `[${FEATURE_NUM}] Feature: ${FEATURE_NAME}`
   - **PR body**: `Feature specification for review. See feature.md in backlog/${FEATURE_NUM}-${FEATURE_NAME}/`

   The committer agent will:
   - Stage the file
   - Show for review (terminal or PR based on config)
   - Wait for approval
   - Commit and push

## Output

Backlog structure created and committed:
```
backlog/
└── XXXXXX-feature-name/
    └── feature.md
```

**Next step:** Once approved, run `/sf-plan` to create technical tasks.

**Note:** Do NOT create technical plans at this stage - only business understanding.
