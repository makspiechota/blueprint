#!/usr/bin/env python3
"""
Efficient PR polling script for Software Factory.
Polls GitHub PR until merged or changes requested.
Returns only when action is needed.
"""

import sys
import time
import subprocess
import json
from datetime import datetime

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)


def find_pr_for_branch(branch_name):
    """Find PR number for a given branch name."""
    try:
        # List PRs for this branch
        result = subprocess.run(
            ["gh", "pr", "list", "--head", branch_name, "--json", "number", "--limit", "1"],
            capture_output=True,
            text=True,
            check=True
        )
        prs = json.loads(result.stdout)
        if prs and len(prs) > 0:
            return str(prs[0]["number"])
        return None
    except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
        return None


def get_repo_info():
    """Get repository owner and name from git remote."""
    try:
        result = subprocess.run(
            ["gh", "repo", "view", "--json", "owner,name"],
            capture_output=True,
            text=True,
            check=True
        )
        data = json.loads(result.stdout)
        return data["owner"]["login"], data["name"]
    except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError):
        return None, None


def get_reviews(owner, repo, pr_number):
    """Fetch reviews using GitHub API (more reliable than gh pr view)."""
    try:
        result = subprocess.run(
            ["gh", "api", f"repos/{owner}/{repo}/pulls/{pr_number}/reviews"],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except (subprocess.CalledProcessError, json.JSONDecodeError):
        return []


def get_review_comments(owner, repo, pr_number):
    """Fetch review comments using GitHub API."""
    try:
        result = subprocess.run(
            ["gh", "api", f"repos/{owner}/{repo}/pulls/{pr_number}/comments"],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except (subprocess.CalledProcessError, json.JSONDecodeError):
        return []


def run_gh_command(pr_identifier):
    """Run gh CLI command and return parsed JSON output."""
    try:
        result = subprocess.run(
            ["gh", "pr", "view", pr_identifier, "--json", "state,reviewDecision,reviews,url,number,commits"],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error running gh command: {e.stderr}", file=sys.stderr)
        sys.exit(2)
    except json.JSONDecodeError as e:
        print(f"Error parsing gh output: {e}", file=sys.stderr)
        sys.exit(2)


def get_current_reviews(reviews, latest_commit_sha):
    """Filter reviews to only those on the latest commit (not outdated)."""
    if not latest_commit_sha:
        # If we can't get latest commit, return all reviews to be safe
        return reviews

    current_reviews = []
    for review in reviews:
        review_commit = review.get("commit_id")
        review_state = review.get("state", "")

        # Skip PENDING reviews (not yet submitted)
        if review_state == "PENDING":
            continue

        # Only count reviews on the latest commit
        # API endpoint should always provide commit_id
        if review_commit == latest_commit_sha:
            current_reviews.append(review)

    return current_reviews


def format_review_comments(reviews, review_comments):
    """Format review comments for display."""
    comments = []

    # Format review submissions (from reviews endpoint)
    for review in reviews:
        author = review.get("author", {}).get("login", "Unknown")
        body = review.get("body", "").strip()
        state = review.get("state", "")

        if body:
            comments.append(f"  @{author} ({state}): {body}")

    # Format line comments (from comments endpoint)
    for comment in review_comments:
        author = comment.get("user", {}).get("login", "Unknown")
        body = comment.get("body", "").strip()
        path = comment.get("path", "")
        line = comment.get("line")

        if body:
            location = f"{path}:{line}" if path and line else "general"
            comments.append(f"  @{author} [{location}]: {body}")

    return "\n".join(comments) if comments else "No comments yet"


def poll_pr(branch_or_number, poll_interval=15):
    """
    Poll PR until merged or changes requested.

    Args:
        branch_or_number: Branch name or PR number
        poll_interval: Seconds between polls (default 15)

    Returns:
        0 if merged
        1 if changes requested
        2 if error
    """
    print(f"[PR POLLING] Starting for: {branch_or_number}", flush=True)

    # Get repo info for API calls
    owner, repo = get_repo_info()
    if not owner or not repo:
        print(f"[PR POLLING] Warning: Could not get repo info, review comments may not be detected", flush=True)

    # If it looks like a branch name, find the PR number
    pr_identifier = branch_or_number
    pr_number = None
    if not branch_or_number.isdigit():
        print(f"[PR POLLING] Finding PR number for branch: {branch_or_number}", flush=True)
        pr_number = find_pr_for_branch(branch_or_number)
        if pr_number:
            pr_identifier = pr_number
            print(f"[PR POLLING] Found PR #{pr_number}", flush=True)
        else:
            print(f"[PR POLLING] No PR found for branch, trying branch name directly...", flush=True)
    else:
        pr_number = branch_or_number

    print(f"[PR POLLING] Checking every {poll_interval}s", flush=True)
    print(flush=True)

    iterations = 0

    while True:
        iterations += 1
        current_time = datetime.now().strftime("%H:%M:%S")

        # Get PR data
        pr_data = run_gh_command(pr_identifier)

        state = pr_data.get("state", "")
        review_decision = pr_data.get("reviewDecision", "")
        pr_url = pr_data.get("url", "")
        commits = pr_data.get("commits", [])

        # Get latest commit SHA
        latest_commit_sha = None
        if commits and len(commits) > 0:
            latest_commit_sha = commits[-1].get("oid")

        # Fetch reviews and comments via API (more reliable than gh pr view)
        all_reviews = []
        review_comments = []
        if owner and repo and pr_number:
            all_reviews = get_reviews(owner, repo, pr_number)
            review_comments = get_review_comments(owner, repo, pr_number)

        # Filter to only current reviews (not outdated)
        current_reviews = get_current_reviews(all_reviews, latest_commit_sha)

        # Debug output
        total_reviews = len(all_reviews)
        current_reviews_count = len(current_reviews)
        comments_count = len(review_comments)
        print(f"[{current_time}] Poll #{iterations}: state={state}, decision={review_decision or 'NONE'}, reviews={current_reviews_count}/{total_reviews}, comments={comments_count}", flush=True)

        # Check for merge
        if state == "MERGED":
            print(f"\n[{current_time}] PR MERGED!")
            print(f"[PR POLLING] Total polls: {iterations}")
            print(f"[PR POLLING] Ready to proceed to next step")
            return 0

        # Check for formal changes requested
        if review_decision == "CHANGES_REQUESTED":
            print(f"\n[{current_time}] CHANGES REQUESTED", flush=True)
            print("\nReview comments:", flush=True)
            print(format_review_comments(current_reviews, review_comments), flush=True)
            print("\n[PR POLLING] Autonomously addressing feedback...", flush=True)
            return 1

        # Check for submitted reviews on current commit (not outdated reviews)
        # Only count reviews on the latest commit
        has_current_review = len(current_reviews) > 0

        if has_current_review and review_decision != "APPROVED":
            # Review was submitted on current code (COMMENTED, CHANGES_REQUESTED, etc.)
            # Fetch the associated comments to show context
            print(f"\n[{current_time}] REVIEW SUBMITTED (on current commit)", flush=True)
            print("\nReview comments:", flush=True)
            print(format_review_comments(current_reviews, review_comments), flush=True)
            print("\n[PR POLLING] Autonomously addressing feedback...", flush=True)
            return 1

        # Status update - show on every poll for visibility
        if review_decision == "APPROVED":
            print(f"  Status: PR approved, waiting for merge...", flush=True)
        elif review_decision:
            print(f"  Status: {review_decision}", flush=True)
        else:
            print(f"  Status: Waiting for review...", flush=True)

        # Wait before next poll
        print(f"  Sleeping {poll_interval}s until next check...", flush=True)
        time.sleep(poll_interval)


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage: poll_pr.py <branch-name-or-pr-number> [poll-interval]", file=sys.stderr)
        print("Example: poll_pr.py feature/000001-user-auth", file=sys.stderr)
        print("Example: poll_pr.py 123 60", file=sys.stderr)
        sys.exit(2)

    branch_or_number = sys.argv[1]
    poll_interval = int(sys.argv[2]) if len(sys.argv) > 2 else 30

    try:
        return poll_pr(branch_or_number, poll_interval)
    except KeyboardInterrupt:
        print("\n[PR POLLING] Interrupted by user")
        sys.exit(2)
    except Exception as e:
        print(f"\n[PR POLLING] Error: {e}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    sys.exit(main())
