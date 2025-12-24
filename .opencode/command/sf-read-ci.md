# Read CI/CD Status

Read CI/CD pipeline status from the user's existing CI/CD system.

## Process

1. **Get CI status**: Check workflow runs
   - `gh pr checks` to see checks for current PR
   - Or `gh run list` and `gh run view [run-id]` for workflow details

2. **Parse results**: Understand what passed/failed
   - Identify passing checks ✅
   - Identify failing checks ❌
   - Note pending/running checks ⏳

3. **Get failure details**: If checks failed, fetch logs
   - `gh run view [run-id] --log-failed` for error logs
   - Parse error messages
   - Identify root cause

4. **Summarize**: Present status to user
   - Overall status (all passing / some failing)
   - Details of any failures
   - Suggested next steps if failures exist

## Output

- CI/CD status summary
- Details of any failed checks
- Error logs (if applicable)
- Recommended actions

**Note:** We only READ CI/CD status - we don't configure or modify the pipeline. Quality gates run locally via code reviewer agent.
