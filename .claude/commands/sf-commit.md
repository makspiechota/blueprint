# Commit Changes

Stage and commit changes with a conventional commit message, and update task tracking.

## Process

1. **Review changes**: Check what's being committed
   - Run `git status` to see changed files
   - Run `git diff` to review changes
   - Verify batch size (<100 lines preferred)

2. **Identify task**: Determine which task this commit relates to
   - Ask user which task file (if not obvious)
   - Or infer from changed files
   - Example: `backlog/000001-user-auth/001-add-user-model.md`

3. **Stage changes**: Add files to staging area
   - `git add .` for all changes (excluding backlog/ directory)
   - Or selectively stage specific files
   - Note: Task files are updated separately

4. **Generate commit message**: Follow conventional commits format
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `docs:` - Documentation
   - Format: `type: brief description`
   - Add task reference: `feat: add User model [000001/001]`

5. **Commit**: Create the commit
   - `git commit -m "message"`
   - Capture commit hash

6. **Update task file**: Link commit to task
   ```markdown
   ## Status
   ✅ Completed - [Date]
   Actual lines: XX
   Commit: abc123def (initial implementation)
   # OR for review commit:
   Commit: abc123def (initial), xyz789abc (review improvements)
   ```

   - Stage and commit the task file update
   - `git add backlog/XXXXXX-*/XXX-*.md`
   - `git commit -m "docs: update task XXX status [000001/001]"`

## Output

- Changes committed with task reference
- Commit hash captured
- Task file updated and committed
- Two commits total (code + task tracking)

**Note:** This creates a snapshot of work - either initial implementation or code review improvements.
