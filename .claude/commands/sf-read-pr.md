# Read Pull Request Feedback

Read PR comments and review feedback.

## Process

1. **Get current PR**: Find the PR number
   - `gh pr view` to see current PR
   - Or specify PR number if multiple PRs exist

2. **Read comments**: Fetch review feedback
   - `gh pr view [number] --json comments` for comments
   - Parse and summarize reviewer feedback
   - Identify action items

3. **Check review status**: See approval state
   - Approved, changes requested, or pending
   - Note any blocking issues

4. **Summarize**: Present feedback to user
   - List all reviewer comments
   - Highlight action items
   - Ask if user wants to address feedback

## Output

- Summary of all PR comments
- Review status (approved/changes requested/pending)
- Action items identified
- Recommendation for next steps

**Note:** After reading feedback, user can decide to implement changes with `/sf-tdd` and commit with `/sf-commit`.
