# Technical Planning - Create Implementation Tasks

Analyze the codebase and create technical task files for the approved feature.

## Process

1. **Find the feature**: Identify which feature to plan
   ```bash
   # List available features
   ls -d backlog/*/

   # User specifies or use most recent
   FEATURE_DIR=backlog/XXXXXX-feature-name/
   ```

2. **Read feature.md**: Understand the business requirements
   - Read `$FEATURE_DIR/feature.md`
   - Understand user stories
   - Identify success criteria

3. **Analyze codebase**: Understand existing architecture
   - Read relevant models, services, controllers
   - Identify existing patterns
   - Find dependencies and integration points
   - Map user stories to code changes

4. **Create task files**: Break feature into technical tasks

   For each task, create: `XXX-task-description.md`

   Format: `XXX` = 3-digit counter (001, 002, 003, etc.)

   Structure of each task file:
   ```markdown
   # Task: [Task Title]

   ## User Story Reference
   [Which user story from feature.md does this implement?]

   ## Description
   [What needs to be done technically?]

   ## Files to Modify/Create
   - `path/to/file1.js` - [what changes]
   - `path/to/file2.js` - [what changes]

   ## Estimated Lines of Code
   ~XX lines (must be <100)

   ## Dependencies
   [Which tasks must be completed first? Reference by number]

   ## Implementation Notes
   [Technical details, patterns to follow, gotchas]

   ## Acceptance Criteria
   - [ ] Criterion 1
   - [ ] Criterion 2
   - [ ] Tests pass
   ```

5. **Call committer agent**: Review and commit the task files

   Pass to committer agent:
   - **Files**: `backlog/${FEATURE_NUM}-${FEATURE_NAME}/*.md` (all task files)
   - **Commit message**:
     ```
     feat: add technical plan [${FEATURE_NUM}]

     Created ${TASK_COUNT} tasks for ${FEATURE_NAME}:
     - 001-task-name.md
     - 002-task-name.md
     - ...

     Ready for implementation with /sf-tdd
     ```
   - **Context**: "technical plan"
   - **PR title**: `[${FEATURE_NUM}] Technical Plan: ${FEATURE_NAME}`
   - **PR body**: `Technical implementation plan for review. See task files in backlog/${FEATURE_NUM}-${FEATURE_NAME}/`

   The committer agent will:
   - Stage the task files
   - Show for review (terminal or PR based on config)
   - Wait for approval
   - Commit and push

## Output

Backlog structure with tasks created and committed:
```
backlog/
└── XXXXXX-feature-name/
    ├── feature.md                    # Business requirements
    ├── 001-task-description.md       # Task 1
    ├── 002-task-description.md       # Task 2
    └── 003-task-description.md       # Task 3
```

**Next step:** Once approved, run `/sf-tdd` to implement tasks one by one.

**Note:** This is planning only - do NOT implement code at this stage.
