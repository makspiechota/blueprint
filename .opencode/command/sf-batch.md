# Product Analysis - Create Feature Backlog

Interview the user about the feature requirement and create a structured backlog entry.

**Autonomous Operation:** In PR mode, this command operates fully autonomously. It polls for PR approval, automatically addresses review comments without asking, and proceeds to `/sf-plan` when merged. The ONLY human interaction is the PR review itself.

**CRITICAL:** Do NOT ask the user "should I proceed?", "shall I continue?", or "ready to move to the next step?". When the PR is merged, AUTOMATICALLY proceed to `/sf-plan` without asking. When changes are requested, AUTOMATICALLY implement them without asking. This is autonomous operation - act autonomously.

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
   - Wait for approval (terminal) or create PR (PR mode)
   - Commit and push

5. **Poll PR and proceed** (PR mode only):

   After committer creates PR:
   ```bash
   # Get current feature branch
   BRANCH=$(git branch --show-current)

   # Use efficient Python polling script
   python3 .claude/scripts/poll_pr.py "$BRANCH"
   POLL_RESULT=$?

   if [ $POLL_RESULT -eq 0 ]; then
     # PR merged - proceed to next step
     echo "Switching to main branch..."
     git checkout main
     git pull

     echo "Automatically proceeding to /sf-plan..."
     # Run /sf-plan command here
     # In actual execution, this would invoke the sf-plan command

   elif [ $POLL_RESULT -eq 1 ]; then
     # Changes requested - address feedback
     echo "Analyzing review comments..."

     # Read feature.md and understand current state
     # Analyze what changes are needed based on comments
     # Update feature.md autonomously
     # Call committer agent to push updates
     # Script will continue polling after push

     echo "Pushing updates and continuing to poll..."
     # After pushing, call poll script again
     python3 .claude/scripts/poll_pr.py "$BRANCH"

   else
     # Error occurred
     echo "Error during PR polling"
     exit 1
   fi
   ```

## Output

**Terminal Mode:**
Backlog structure created and committed. Run `/sf-plan` to create technical tasks.

**PR Mode:**
Backlog structure created, PR created, polling until merged, then automatically proceeds to `/sf-plan`.

**Note:** Do NOT create technical plans at this stage - only business understanding.
