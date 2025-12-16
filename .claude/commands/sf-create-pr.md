# Create Pull Request

Create a pull request using GitHub CLI with reference to backlog feature/task.

## Process

1. **Verify commits**: Check that work is committed and pushed
   - Run `git log` to see recent commits
   - Push to remote if needed: `git push -u origin [branch]`

2. **Identify feature/task**: Determine what this PR implements
   - Find the feature directory: `backlog/XXXXXX-feature-name/`
   - Read `feature.md` for context
   - List completed tasks (those with ✅ Status)

3. **Generate PR content**:

   **Title**: `[XXXXXX] Feature Name` (use feature number and name)
   Example: `[000001] User Authentication`

   **Body**: Include:
   ```markdown
   ## Feature
   [Brief description from feature.md]

   ## Tasks Completed
   - [x] 001: Add User model
   - [x] 002: Create login endpoint
   - [x] 003: Add JWT token generation

   ## Implementation Summary
   [Brief technical summary - what changed]

   ## Commits
   - Initial implementation commits
   - Code review improvement commits

   ## Testing
   [How was this tested?]

   ## Related
   Feature: backlog/XXXXXX-feature-name/feature.md
   ```

4. **Create PR**: Use GitHub CLI
   - `gh pr create --title "..." --body "..."`
   - Ensure base branch is correct (usually `main`)

5. **Return PR URL**: Provide link to the created PR

## Output

- PR created successfully
- PR URL for review
- PR number for reference
- Feature/task references included

**Note:** PR should contain 2 commits per task if code review happened: initial implementation + review improvements.
