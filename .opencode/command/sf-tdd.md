---
description: Implement a task from the backlog using test-driven development (full workflow)
agent: general
---

# Test-Driven Development - Implement Task

Orchestrates the complete TDD workflow: implementation → code review → commit → PR → repeat.

**Usage:**
```
/sf-tdd [task-file-path]
```

**Autonomous Operation:** In PR mode, operates fully autonomously through agent orchestration. Each task goes through: sf-tdd-agent → code-reviewer → committer → poll → next task. No user confirmation needed.

**Agent Architecture:**
- **sf-tdd agent**: Handles test-driven implementation (RED → GREEN)
- **code-reviewer agent**: Ensures code quality
- **committer agent**: Manages commits, PRs, and polling
- **Supervising command**: Orchestrates the workflow and maintains context

**CRITICAL:**
- **ALWAYS wait for agent responses** - synchronous agent calls maintain proper sequencing
- Do NOT proceed to next task until PR is merged or terminal commit succeeds
- Command re-invokes itself only after complete task success
- **In PR mode: Create ONE PR per task** - each task gets its own focused review cycle

## Process

1. **Parse task argument and select task**:

   **Task Selection Logic:**
   - Read task described in $1

   **Output:** Clearly state which task was selected and show the full file path for verification

2. **Call sf-tdd agent for implementation**:

   Use the Task tool to invoke the sf-tdd agent:
   - **Subagent:** sf-tdd
   - **Description:** Implement the selected task using TDD
    - **Prompt:**
      ```
      Implement this specific task using test-driven development:

      Task file: [full path to .md file from $1 or determined autonomously]

      Process:
      1. Read the task requirements from the file
      2. Write comprehensive tests (RED phase) that cover all acceptance criteria
      3. Implement minimal code to make tests pass (GREEN phase)
      4. Verify batch size < 100 lines and all tests pass

      Return: IMPLEMENTATION_COMPLETE with task details, files changed, test results
      ```

   **Wait for completion** and parse the structured response from the sf-tdd agent.

3. **Code review**: Parse sf-tdd response and call code-reviewer agent

   **Parse the sf-tdd agent response:**
   - Look for: `RESULT: IMPLEMENTATION_COMPLETE`
   - Extract: Task number, feature number, modified files, test count, batch size, task file path, task title

   **If implementation is complete:**
   - Call code-reviewer agent with the implementation details
   - Provide all modified files, task requirements, and test results
   - Ask for approval or feedback

     Task(
       subagent_type="code-reviewer",
       description="Review task implementation",
       prompt="Review the implementation for task $TASK_NUM:
       - Files: $MODIFIED_FILES
       - Task file: $UPDATED_TASK_FILE
       - Batch size: $BATCH_SIZE lines
       - Tests: $TEST_COUNT passing

       Provide feedback if there are issues, otherwise approve."
     )
   else
     echo "Error: sf-tdd agent did not complete successfully"
     exit 1
   fi
   ```

   If code-reviewer provides feedback:
   - Pass feedback to sf-tdd agent to fix issues
   - Loop back to step 2 until approved

4. **Call committer agent** (AFTER code review passes):

   **Use the parsed information from previous steps:**

   **Invoke committer agent:**
   - **Subagent:** committer
   - **Description:** Create commit and PR for the implemented task
   - **Prompt:**
     ```
     Create a commit and pull request for this completed task:

     Files to commit: [all modified files from sf-tdd response + updated task file]
     Commit message: feat: implement task [FEATURE]/[TASK] [TASK_TITLE]
     PR title: [[FEATURE]/[TASK]] [TASK_TITLE]
     PR description: Implementation details with test results and file changes

     Execute the commit_and_review.py script and monitor the PR until merged or changes requested.
     Return RESULT: SUCCESS/MERGED, or RESULT: CHANGES_REQUESTED with feedback details.
     ```
   ```

   **Wait for committer response** - returns SUCCESS, CHANGES_REQUESTED, or ERROR

5. **Handle committer result**:

   **Parse the committer response:**
   - **RESULT: SUCCESS/MERGED**: Task completed successfully
   - **RESULT: CHANGES_REQUESTED**: PR has review comments that need addressing
   - **Other**: Error occurred

   **If SUCCESS:**
   - Mark task as fully complete
   - Proceed to next task

   **If CHANGES_REQUESTED:**
   - Extract review comments from committer response
   - Call sf-tdd agent again to address the feedback
   - Loop back to code review step

   **If ERROR:**
   - Report the error and stop

6. **Proceed to next task**:

   **After successful completion:**
    - Checkout main branch and pull latest changes
    - Find the next task in sequence (increment task number)
    - If next task exists: Set task file path and continue from step 1
    - If all tasks complete: Call `/sf-create-pr` for final PR

🚫 **PROCESS ENFORCEMENT** 🚫
Each task follows: RED → GREEN → REVIEW → COMMIT → SUCCESS → NEXT TASK
You may NEVER have uncommitted code from previous tasks when starting a new one.
Violation will result in incomplete task tracking and potential code conflicts.

## Output

**Workflow Orchestration:**
- **sf-tdd agent**: Handles RED → GREEN (tests → implementation)
- **code-reviewer agent**: Reviews implementation quality
- **committer agent**: Handles commit → PR → polling

**Terminal Mode:**
- Implementation complete via sf-tdd agent
- Code reviewed by code-reviewer agent
- Committed via committer agent
- Automatically proceeds to next task

**PR Mode:**
- Implementation complete (ONE task only)
- Code reviewed and committed via respective agents
- **Waits for PR polling results from committer agent**
 - **SUCCESS**: Continues with next task inline
- **CHANGES_REQUESTED**: Addresses feedback via agents, then commits again
- Maintains autonomous operation across task boundaries

**Practice:** AGENTS → RED → GREEN → REVIEW → COMMIT → POLL → REPEAT

OPENCODE1
