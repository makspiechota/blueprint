# Test-Driven Development - Implement Task

Implement a task from the backlog using test-driven development.

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

6. **Call committer agent**: Review and commit the implementation

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
   - Stage all changes (code + task file)
   - Show for review (terminal or PR based on config)
   - Wait for approval
   - Commit and push

   **Note:** After committer agent commits, the code review agent runs automatically

7. **Code review**: Automated review by code-reviewer agent
   - Reviews against task acceptance criteria
   - Checks batch size, tests, code quality
   - Provides feedback if needed
   - If feedback exists, implement and call committer agent again (review commit)

## Output

- Tests written and passing
- Implementation complete
- Task file updated with completion status
- Batch size verified (<100 lines)
- Code reviewed
- All changes committed (initial + review if needed)

**Practice:** RED → GREEN → COMMIT → REVIEW → REFACTOR (if needed) → COMMIT
