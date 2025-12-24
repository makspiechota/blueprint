# Technical Planning - Create Implementation Tasks

Analyze the codebase and create technical task files for the approved feature.

**Autonomous Operation:** In PR mode, operates fully autonomously. Polls PR, automatically addresses review comments, and proceeds to `/sf-tdd` when merged. No user confirmation needed - only PR review.

**CRITICAL:** Do NOT ask the user "should I proceed?", "shall I continue?", or "ready to implement?". When the PR is merged, AUTOMATICALLY proceed to `/sf-tdd` without asking. When changes are requested, AUTOMATICALLY implement them without asking. This is autonomous operation - act autonomously.

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
   - Wait for approval (terminal) or create PR (PR mode)
   - Commit and push

6. **Poll PR and proceed** (PR mode only):

   After committer creates PR:
   ```bash
   BRANCH=$(git branch --show-current)

   # Use efficient Python polling script
   python3 .claude/scripts/poll_pr.py "$BRANCH"
   POLL_RESULT=$?

   if [ $POLL_RESULT -eq 0 ]; then
     # PR merged - proceed to implement first task
     git checkout main
     git pull

     echo "Finding first task..."
     FIRST_TASK=$(ls backlog/*/001-*.md | head -1)

     echo "Automatically proceeding to /sf-tdd for: $FIRST_TASK"
     # Run /sf-tdd command here

   elif [ $POLL_RESULT -eq 1 ]; then
     # Changes requested - address feedback
     echo "Analyzing review comments and updating task files..."

     # Update task files based on comments
     # Call committer agent to push updates
     # Continue polling

     python3 .claude/scripts/poll_pr.py "$BRANCH"

   else
     echo "Error during PR polling"
     exit 1
   fi
   ```

## Output

**Terminal Mode:**
Task files created and committed. Run `/sf-tdd` to implement first task.

**PR Mode:**
Task files created, PR created, polling until merged, then automatically proceeds to `/sf-tdd` for first task.

**Note:** This is planning only - do NOT implement code at this stage.
