# Test-Driven Development - Implement Task

Implement a task from the backlog using test-driven development.

**Autonomous Operation:** In PR mode, operates fully autonomously. Polls PR, automatically addresses review comments, and re-invokes `/sf-tdd` when merged to maintain fresh context. No user confirmation needed.

**CRITICAL:**
- Do NOT ask "should I proceed to next task?" - AUTOMATICALLY invoke `/sf-tdd` using SlashCommand tool
- Do NOT ask "shall I continue?" - Just invoke `/sf-tdd` again with fresh context
- This command handles ONE task only, then re-invokes itself for the next task
- Fresh context prevents losing autonomous operation instructions
- **In PR mode: Create ONE PR per task** - each task gets its own PR for focused review

## Process

1. **Find and read task file**: Identify which task to implement
   ```bash
   # List features and tasks
   ls backlog/*/

   # Read the task file
   TASK_FILE=backlog/XXXXXX-feature-name/XXX-task-description.md
   ```

   - Ask user which task to implement (or use next in sequence)
   - Read the task file to understand requirements
   - Check dependencies (ensure prerequisite tasks are done)

2. **Write tests FIRST**: Create tests before implementation

   Based on task file:
   - Read "Acceptance Criteria" section
   - Write tests that verify each criterion
   - Cover happy path and edge cases
   - Run tests (they should fail - RED phase)

3. **Implement code**: Write minimal code to pass tests

   Based on task file:
   - Reference "Files to Modify/Create" section
   - Follow "Implementation Notes"
   - Keep changes focused on the task
   - Run tests until they pass (GREEN phase)

4. **Verify constraints**:
   - Check batch size: `git diff --stat` (<100 lines)
   - Compare against "Estimated Lines of Code" in task file
   - All acceptance criteria checked
   - All tests passing

5. **Update task file**: Mark task as completed
   ```markdown
   ## Status
   [COMPLETED] - [Date]
   Actual lines: XX
   Commit: [will be added by committer agent]
   ```

6. **Code review**: Use code-quality-reviewer agent BEFORE committing

   **IMPORTANT**: Invoke code review agent using Task tool:
   ```
   Task(
     subagent_type="code-quality-reviewer",
     description="Review task implementation",
     prompt="Review the implementation for task [TASK_NUM]:
     - Files: [list of modified files]
     - Task acceptance criteria: [from task.md]
     - Batch size limit: 100 lines
     - Tests must be passing

     Provide feedback if there are issues, otherwise approve."
   )
   ```

   If code-reviewer provides feedback:
   - Implement the suggested improvements
   - Run tests again
   - Invoke code-reviewer again
   - Repeat until approved

7. **Call committer agent**: Review and commit the implementation (AFTER code review passes)

   **IMPORTANT**: In PR mode, this creates a NEW PR for THIS TASK (one PR per task).

   Pass to committer agent:
   - **Files**: All modified code files + updated task file
   - **Commit message**:
     ```
     feat: implement task ${TASK_NUM} [${FEATURE_NUM}/${TASK_NUM}]

     ${TASK_TITLE}

     - Tests written and passing
     - Batch size: XX lines
     - Task: backlog/${FEATURE_NUM}-${FEATURE_NAME}/${TASK_NUM}-task.md
     ```
   - **Context**: "task implementation"
   - **PR title**: `[${FEATURE_NUM}/${TASK_NUM}] ${TASK_TITLE}`
   - **PR body**:
     ```
     Implementation for task ${TASK_NUM}.

     See task file: backlog/${FEATURE_NUM}-${FEATURE_NAME}/${TASK_NUM}-task.md

     Changes:
     - [List of files modified]

     Tests: [X passing]
     Batch size: [XX lines]
     ```

   The committer agent will:
   - Call commit_and_review.py script
   - Script stages files, commits, pushes, creates PR, polls for review
   - Returns when PR merged or changes requested

8. **Handle review result** (PR mode only):

   The commit_and_review.py script blocks until PR is resolved, then returns exit code:

   - **Exit code 0** (PR merged):
     ```bash
     git checkout main
     git pull

     # Check for next task
     CURRENT_TASK=$(basename $(ls backlog/*/[0-9][0-9][0-9]-*.md | tail -1))
     CURRENT_NUM=$(echo $CURRENT_TASK | grep -oP '^\d{3}')
     NEXT_NUM=$(printf "%03d" $((10#$CURRENT_NUM + 1)))
     NEXT_TASK=$(ls backlog/*/${NEXT_NUM}-*.md 2>/dev/null | head -1)
     ```

     Then **use Skill tool** to re-invoke with fresh context:
     - If next task exists: `Skill(skill="sf-tdd")`
     - If all tasks complete: `Skill(skill="sf-create-pr")`

   - **Exit code 1** (changes requested):
     - Read review comments from script output
     - Analyze what changes are needed
     - Implement changes to code/tests
     - Go back to step 6 (code review with code-quality-reviewer agent)
     - **Then call committer agent again** (do NOT commit directly!)
     - Committer will detect existing PR and push updates to it
     - Script will poll again automatically

     **CRITICAL**: Always use committer agent - never run git commands directly

   - **Exit code 2** (error):
     - Report error and exit

## Output

**Terminal Mode:**
- Tests written and passing
- Implementation complete
- Task file updated with completion status
- Code reviewed
- Run `/sf-tdd` for next task or `/sf-create-pr` if done

**PR Mode:**
- Tests written and passing
- Implementation complete (ONE task only)
- PR created and polling
- When merged: Automatically invokes `/sf-tdd` again with FRESH CONTEXT
- Fresh context maintains autonomous operation instructions

**Practice:** RED → GREEN → COMMIT → REVIEW → REFACTOR (if needed) → COMMIT → RE-INVOKE
