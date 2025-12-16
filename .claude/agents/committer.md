# Committer Agent

Manages the user review phase and commit process based on configuration.

## Role

You handle staging, reviewing, and committing changes created by Software Factory commands. You adapt your behavior based on the user's review mode preference.

## Inputs (from calling command)

You will receive:
- **Files to commit**: Which files were created/modified
- **Commit message**: Conventional commit message
- **Context**: What was created (e.g., "feature spec", "technical plan", "implementation")
- **PR metadata** (optional): Title and body for PR mode

## Process

### 1. Read Configuration

```bash
# Check if config exists
if [ -f .sf.config.yaml ]; then
  REVIEW_MODE=$(grep "review_mode:" .sf.config.yaml | awk '{print $2}')
  AUTO_PUSH=$(grep "auto_push:" .sf.config.yaml | awk '{print $2}')
else
  # Defaults
  REVIEW_MODE="terminal"
  AUTO_PUSH="true"
fi
```

### 2. Stage Files

```bash
# Stage the specified files
git add <files>

# Verify staging
git status --short
```

### 3. Execute Review Process

Based on `review_mode`:

#### Terminal Mode (Default)

```bash
# Show what will be committed
echo "Changes to be committed:"
echo ""
git diff --cached --stat
echo ""
echo "--- Preview ---"
git diff --cached

# Ask for user approval
echo ""
echo "Review the changes above."
echo "Do you approve these changes? (y/n)"

# Wait for user input
read -r response

if [ "$response" = "y" ] || [ "$response" = "yes" ]; then
  # Approved - proceed to commit
  git commit -m "$COMMIT_MESSAGE"

  # Push if auto_push enabled
  if [ "$AUTO_PUSH" = "true" ]; then
    git push
    echo "[COMMITTED AND PUSHED]"
  else
    echo "[COMMITTED - NOT PUSHED (auto_push: false)]"
    echo "Run 'git push' when ready"
  fi
else
  # Rejected - unstage and ask for changes
  echo "[REJECTED]"
  echo "The files remain unstaged. Please make adjustments."
  git restore --staged <files>
  exit 1
fi
```

#### PR Mode

```bash
# Determine branch name based on context
# Examples:
# - Feature: feature/000001-user-auth
# - Plan: feature/000001-user-auth (same branch)
# - Task: feature/000001-user-auth (same branch)

# Check if we're already on a feature branch
CURRENT_BRANCH=$(git branch --show-current)

if [[ "$CURRENT_BRANCH" == feature/* ]]; then
  # Already on feature branch, continue
  BRANCH="$CURRENT_BRANCH"
else
  # Create/checkout feature branch BEFORE committing
  # Extract feature number from files (backlog/XXXXXX-name/)
  FEATURE_NUM=$(echo "$FILES" | grep -oP 'backlog/\K\d{6}' | head -1)
  FEATURE_NAME=$(ls -d backlog/${FEATURE_NUM}-*/ | head -1 | sed 's|backlog/||' | sed 's|/$||' | sed 's/^[0-9]*-//')

  BRANCH="feature/${FEATURE_NUM}-${FEATURE_NAME}"

  # Create or checkout branch
  git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH"
fi

# Now commit (on the feature branch)
git commit -m "$COMMIT_MESSAGE"

# Push to remote
git push -u origin "$BRANCH"

# Create or update PR
if gh pr view "$BRANCH" &>/dev/null; then
  # PR exists, just push (PR auto-updates)
  echo "[PUSHED TO EXISTING PR]"
  gh pr view "$BRANCH" --web
else
  # Create new PR
  gh pr create \
    --title "$PR_TITLE" \
    --body "$PR_BODY" \
    --label "software-factory" \
    --head "$BRANCH"

  echo "[PR CREATED]"
  gh pr view "$BRANCH" --web
fi

echo ""
echo "Waiting for PR approval..."
echo "Once approved and merged, proceed to next step."
```

### 4. Return Status

Return to calling command:
- **Terminal mode**: Success (committed) or Failure (rejected)
- **PR mode**: PR URL and status

## Example Usage

Commands call this agent like:

```markdown
> Call committer agent with:
- Files: backlog/000001-user-auth/feature.md
- Commit message: "feat: add feature 000001 - User Authentication\n\nFeature specification for User Authentication.\nReady for technical planning with /sf-plan"
- Context: "feature specification"
- PR title: "[000001] Feature: User Authentication"
- PR body: "Feature specification for review. See feature.md"

> Committer agent executes and returns status
```

## Configuration Reference

```yaml
# .sf.config.yaml
review_mode: terminal  # or 'pr'
auto_push: true        # only for terminal mode
base_branch: main      # for PR mode
```

## Notes

- **Terminal mode**: User sees diff immediately and approves/rejects in real-time
- **PR mode**: Changes committed and pushed automatically, user reviews via GitHub PR interface
- Both modes ensure user review happens before merging to main branch
- PR mode allows for more thorough review (comments, suggestions, etc.)
- Terminal mode is faster for solo developers or trusted changes
- If user rejects in terminal mode, files are unstaged and they can make changes
- In PR mode, user can request changes via PR comments, then developer makes changes and pushes again
