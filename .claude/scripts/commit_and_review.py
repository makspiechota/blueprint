#!/usr/bin/env python3
"""
Unified commit and review script for Software Factory.
Handles the entire workflow: stage → commit → push → PR → poll for review.
"""

import sys
import argparse
import subprocess
import json
import yaml
import time
from datetime import datetime
from pathlib import Path


def run_command(cmd, check=True, capture=True):
    """Run shell command and return result."""
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=capture,
            text=True,
            check=check
        )
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {cmd}", file=sys.stderr)
        print(f"Error: {e.stderr}", file=sys.stderr)
        sys.exit(2)


def read_config():
    """Read Software Factory configuration."""
    config_path = Path(".sf.config.yaml")
    if not config_path.exists():
        # Defaults
        return {
            "review_mode": "terminal",
            "auto_push": True,
            "base_branch": "main"
        }

    with open(config_path) as f:
        return yaml.safe_load(f)


def get_repo_info():
    """Get repository owner and name from git remote."""
    try:
        result = run_command("gh repo view --json owner,name")
        data = json.loads(result.stdout)
        return data["owner"]["login"], data["name"]
    except:
        return None, None


def get_current_branch():
    """Get current git branch name."""
    result = run_command("git branch --show-current")
    return result.stdout.strip()


def determine_branch_name(files):
    """Determine branch name from files being committed."""
    current_branch = get_current_branch()

    # If already on a feature branch, use it
    if current_branch.startswith("feature/") or current_branch.startswith("task/"):
        return current_branch

    # Extract feature number from files
    for file in files:
        if "backlog/" in file:
            # Extract feature number (e.g., "000001" from "backlog/000001-feature-name/")
            parts = file.split("backlog/")[1].split("/")
            if parts:
                feature_id = parts[0].split("-")[0]
                feature_name = parts[0].replace(f"{feature_id}-", "")
                return f"feature/{feature_id}-{feature_name}"

    # Fallback to current branch
    return current_branch


def stage_files(files):
    """Stage files for commit."""
    print(f"\n[STAGING] Adding {len(files)} file(s)...")
    for file in files:
        print(f"  - {file}")
        run_command(f"git add {file}")


def create_commit(commit_message):
    """Create git commit."""
    print(f"\n[COMMIT] Creating commit...")

    # Write message to temp file and commit from it
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
        f.write(commit_message)
        temp_path = f.name

    try:
        run_command(f"git commit -F {temp_path}")
        print("✓ Commit created")
    finally:
        Path(temp_path).unlink()



def show_diff_and_confirm():
    """Show diff and ask for confirmation in terminal mode."""
    print("\n" + "="*70)
    print("CHANGES TO COMMIT:")
    print("="*70)
    run_command("git diff --staged", capture=False)
    print("="*70)

    response = input("\nCommit these changes? (y/n): ").strip().lower()
    return response == 'y'


def create_or_checkout_branch(branch_name, base_branch):
    """Create or checkout feature branch."""
    current = get_current_branch()

    if current == branch_name:
        print(f"[BRANCH] Already on {branch_name}")
        return

    # Try to checkout existing branch, or create new one
    result = run_command(f"git checkout {branch_name}", check=False)
    if result.returncode != 0:
        print(f"[BRANCH] Creating new branch: {branch_name}")
        run_command(f"git checkout -b {branch_name}")
    else:
        print(f"[BRANCH] Switched to existing branch: {branch_name}")


def push_to_remote(branch_name):
    """Push branch to remote."""
    print(f"\n[PUSH] Pushing to origin/{branch_name}...")
    run_command(f"git push -u origin {branch_name}")
    print("✓ Pushed to remote")


def check_existing_pr(branch_name):
    """Check if PR already exists for this branch."""
    try:
        pr_list = run_command(f"gh pr list --head {branch_name} --json number --limit 1")
        prs = json.loads(pr_list.stdout)
        if prs and len(prs) > 0:
            return prs[0]["number"]
        return None
    except:
        return None


def create_pr(pr_title, pr_description, branch_name):
    """Create GitHub pull request or return existing PR number."""
    # Check if PR already exists for this branch
    existing_pr = check_existing_pr(branch_name)
    if existing_pr:
        print(f"\n[PR] PR #{existing_pr} already exists for this branch")
        print(f"[PR] Pushing updates to existing PR...")
        return existing_pr

    print(f"\n[PR] Creating new pull request...")

    # Write PR description to temp file
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
        f.write(pr_description)
        temp_path = f.name

    try:
        # Escape quotes in title
        safe_title = pr_title.replace('"', '\\"')
        result = run_command(f'gh pr create --title "{safe_title}" --body-file {temp_path}')
        print("✓ Pull request created")
    finally:
        Path(temp_path).unlink()

    # Get PR number
    pr_list = run_command(f"gh pr list --head {branch_name} --json number --limit 1")
    prs = json.loads(pr_list.stdout)
    if prs and len(prs) > 0:
        return prs[0]["number"]
    return None


def get_reviews(owner, repo, pr_number):
    """Fetch reviews using GitHub API."""
    try:
        result = run_command(f"gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews")
        return json.loads(result.stdout)
    except:
        return []


def get_review_comments(owner, repo, pr_number):
    """Fetch review comments using GitHub API."""
    try:
        result = run_command(f"gh api repos/{owner}/{repo}/pulls/{pr_number}/comments")
        return json.loads(result.stdout)
    except:
        return []


def get_current_reviews_only(reviews, latest_commit_sha):
    """Filter reviews to only those on the latest commit (not outdated)."""
    if not latest_commit_sha:
        return reviews

    current_reviews = []
    for review in reviews:
        review_commit = review.get("commit_id")
        review_state = review.get("state", "")

        # Skip PENDING reviews (not yet submitted)
        if review_state == "PENDING":
            continue

        # Only count reviews on the latest commit
        if review_commit == latest_commit_sha:
            current_reviews.append(review)

    return current_reviews


def format_review_comments(reviews, review_comments):
    """Format review comments for display."""
    comments = []

    # Format review submissions
    for review in reviews:
        author = review.get("author", {}).get("login", "Unknown")
        body = review.get("body", "").strip()
        state = review.get("state", "")

        if body:
            comments.append(f"  @{author} ({state}): {body}")

    # Format line comments
    for comment in review_comments:
        author = comment.get("user", {}).get("login", "Unknown")
        body = comment.get("body", "").strip()
        path = comment.get("path", "")
        line = comment.get("line")

        if body:
            location = f"{path}:{line}" if path and line else "general"
            comments.append(f"  @{author} [{location}]: {body}")

    return "\n".join(comments) if comments else "No comments yet"


def poll_pr(pr_number, owner, repo, poll_interval=15):
    """Poll PR until merged or changes requested."""
    print(f"\n[POLLING] Monitoring PR #{pr_number} (every {poll_interval}s)")
    print(f"[POLLING] URL: https://github.com/{owner}/{repo}/pull/{pr_number}")
    print()

    # Force unbuffered output
    sys.stdout.reconfigure(line_buffering=True)
    sys.stderr.reconfigure(line_buffering=True)

    iterations = 0

    while True:
        iterations += 1
        current_time = datetime.now().strftime("%H:%M:%S")

        # Get PR data
        pr_data = run_command(f"gh pr view {pr_number} --json state,reviewDecision,commits")
        pr_info = json.loads(pr_data.stdout)

        state = pr_info.get("state", "")
        review_decision = pr_info.get("reviewDecision", "")
        commits = pr_info.get("commits", [])

        # Get latest commit SHA
        latest_commit_sha = None
        if commits and len(commits) > 0:
            latest_commit_sha = commits[-1].get("oid")

        # Fetch reviews and comments via API
        all_reviews = get_reviews(owner, repo, pr_number)
        review_comments = get_review_comments(owner, repo, pr_number)

        # Filter to current reviews only
        current_reviews = get_current_reviews_only(all_reviews, latest_commit_sha)

        # Debug output
        total_reviews = len(all_reviews)
        current_reviews_count = len(current_reviews)
        comments_count = len(review_comments)
        print(f"[{current_time}] Poll #{iterations}: state={state}, decision={review_decision or 'NONE'}, reviews={current_reviews_count}/{total_reviews}, comments={comments_count}", flush=True)

        # Check for merge
        if state == "MERGED":
            print(f"\n[{current_time}] ✓ PR MERGED!")
            print(f"[POLLING] Total polls: {iterations}")
            print(f"[POLLING] Ready to proceed to next step")
            return 0

        # Check for formal changes requested
        if review_decision == "CHANGES_REQUESTED":
            print(f"\n[{current_time}] ✗ CHANGES REQUESTED", flush=True)
            print("\nReview comments:", flush=True)
            print(format_review_comments(current_reviews, review_comments), flush=True)
            print("\n[POLLING] Need to address feedback", flush=True)
            return 1

        # Check for submitted reviews on current commit
        has_current_review = len(current_reviews) > 0

        if has_current_review and review_decision != "APPROVED":
            print(f"\n[{current_time}] ✗ REVIEW SUBMITTED (on current commit)", flush=True)
            print("\nReview comments:", flush=True)
            print(format_review_comments(current_reviews, review_comments), flush=True)
            print("\n[POLLING] Need to address feedback", flush=True)
            return 1

        # Status update
        if review_decision == "APPROVED":
            print(f"  Status: PR approved, waiting for merge...", flush=True)
        else:
            print(f"  Status: Waiting for review...", flush=True)

        print(f"  Sleeping {poll_interval}s until next check...", flush=True)
        time.sleep(poll_interval)


def main():
    parser = argparse.ArgumentParser(description="Commit and review workflow for Software Factory")
    parser.add_argument("--files", required=True, help="Space-separated list of files to commit")
    parser.add_argument("--commit-message", required=True, help="Commit message")
    parser.add_argument("--pr-title", help="Pull request title (required for PR mode)")
    parser.add_argument("--pr-description", help="Pull request description (required for PR mode)")
    parser.add_argument("--context", help="Context description (for logging)")

    args = parser.parse_args()

    # Parse files
    files = args.files.split()

    print("="*70)
    print("SOFTWARE FACTORY - COMMIT AND REVIEW")
    print("="*70)

    # Read configuration
    config = read_config()
    review_mode = config.get("review_mode", "terminal")
    base_branch = config.get("base_branch", "main")

    print(f"\nMode: {review_mode.upper()}")
    print(f"Context: {args.context or 'N/A'}")
    print(f"Files: {len(files)}")

    # Stage files
    stage_files(files)

    # Terminal mode workflow
    if review_mode == "terminal":
        # Show diff and confirm
        if not show_diff_and_confirm():
            print("\n✗ Commit cancelled by user")
            sys.exit(1)

        # Create commit
        create_commit(args.commit_message)

        # Push if configured
        if config.get("auto_push", True):
            current_branch = get_current_branch()
            push_to_remote(current_branch)

        print("\n✓ Complete (terminal mode)")
        return 0

    # PR mode workflow
    elif review_mode == "pr":
        if not args.pr_title or not args.pr_description:
            print("Error: --pr-title and --pr-description required for PR mode", file=sys.stderr)
            sys.exit(2)

        # Determine and create/checkout branch
        branch_name = determine_branch_name(files)
        create_or_checkout_branch(branch_name, base_branch)

        # Create commit
        create_commit(args.commit_message)

        # Push to remote
        push_to_remote(branch_name)

        # Create PR
        pr_number = create_pr(args.pr_title, args.pr_description, branch_name)

        if not pr_number:
            print("Error: Could not create or find PR", file=sys.stderr)
            sys.exit(2)

        # Get repo info for polling
        owner, repo = get_repo_info()
        if not owner or not repo:
            print("Error: Could not get repository info", file=sys.stderr)
            sys.exit(2)

        # Poll PR until resolution
        return poll_pr(pr_number, owner, repo)

    else:
        print(f"Error: Unknown review mode: {review_mode}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    sys.exit(main())
