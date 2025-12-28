#!/bin/bash
#
# Autonomous Mode Reminder Hook
# Reminds agent to operate autonomously in PR mode
#

# Only trigger in PR mode
if [ -f .sf.config.yaml ] && grep -q "review_mode: pr" .sf.config.yaml 2>/dev/null; then
  cat <<'EOF'
⚠️ AUTONOMOUS MODE ACTIVE

You are operating in FULLY AUTONOMOUS PR mode:

✗ FORBIDDEN - Never ask:
  • "Should I proceed to /sf-plan?"
  • "Ready to move to next task?"
  • "Would you like me to continue?"

✓ REQUIRED - Always do automatically:
  • When PR merged → Invoke next command using Skill() tool
  • When changes requested → Implement feedback automatically
  • When task complete → Invoke /sf-tdd using Skill() tool

Use Skill() tool to invoke commands. The ONLY human interaction is PR review.
EOF
fi
