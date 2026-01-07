---
type: tripwire-product
version: 2.0
last_updated: 2026-01-02
status: draft
target_icp: engineering-leaders
price: $27
---

# Tripwire Product for Leaders: "Software Factory 2027"

## Title & Positioning

**Primary Title:**
> **Software Factory 2027**
> *Join the movement. Build your autonomous SDLC.*

**Alternative Title Options:**

1. **"Software Factory 2027"**
   *"Join the movement. Build your autonomous SDLC."* ← SELECTED

2. **"Software Factory 2027"**
   *"Join the future of software development. Build your autonomous SDLC."*

3. **"Software Factory 2027"**
   *"Join the pioneers building autonomous SDLC."*

4. **"Software Factory 2027"**
   *"Build your autonomous SDLC before your competitors do."*

5. **"Software Factory 2027"**
   *"The engineering orgs building autonomous SDLC now will outpace everyone else."*

6. **"Software Factory 2027"**
   *"Build the autonomous SDLC your competitors will be copying in 2 years."*

7. **"Software Factory 2027"**
   *"Autonomous SDLC is coming. The teams building it today will lead tomorrow."*

## Product Overview

**What it is:** A hands-on course that takes engineering leaders from assessment to working prototype. Not just "where you stand" — but "here's your working autonomous SDLC."

**Format:** Video course + assessment + Claude prompts + templates + prototype exercise

**Price:** $27

**Length:** 4-5 hours total

**Outcome:** By the end, you have a working Software Factory prototype you can demonstrate to your team and start using immediately.

### The Transformation

```
START                                    END
─────────────────────────────────────────────────────────────
"We use AI tools chaotically"    →    "We have systematic autonomous workflow"
"I don't know where to start"    →    "I have a working prototype"
"This sounds theoretical"        →    "I ran autonomous SDLC today"
"How do I convince my team?"     →    "Let me show them the prototype"
```

## Course Structure

### Module 1: Assessment + Vision (45 min)

**Purpose:** Understand where you stand and where you're going.

**Content:**

**Part 1: The Software Factory Vision (15 min)**
- What autonomous SDLC looks like in 2027
- Why engineering excellence enables AI autonomy
- The shift: from AI-assisted to AI-autonomous
- Case examples of early adopters

**Part 2: The Six Pillars Framework (10 min)**
- Overview of the six pillars that enable Software Factory
- How pillars reinforce each other
- Why most organizations have 1-2 pillars (and struggle with AI)

**Part 3: Self-Assessment (20 min)**
- Interactive assessment across all six pillars
- Score calculation and interpretation
- Identify your biggest gaps
- Your personalized transformation sequence

**Deliverables:**
- Software Factory Readiness Score (0-100)
- Six Pillars breakdown (strengths/gaps)
- Personalized learning path for remaining modules
- Transformation roadmap template

---

### Module 2: Spec-Driven Development (30 min)

**The Pillar:** Define what to build before building it. AI agents need specifications, not vague requests.

**Why It Matters for Autonomous SDLC:**
AI can't read minds. "Build a login feature" produces garbage. "Make these 5 acceptance tests pass" produces working code. Spec-driven development turns vague requirements into executable specifications AI can work against.

**Content:**

**Part 1: The Principle (10 min)**
- Why "write code that does X" fails
- Acceptance criteria as executable specifications
- The specification hierarchy: User Story → Acceptance Criteria → Test Cases
- Involving engineers in discovery (Product Engineering)

**Part 2: Implementation (10 min)**
- Writing specifications AI can execute against
- The GIVEN-WHEN-THEN format for AI
- From business requirement to testable spec
- Common mistakes and how to avoid them

**Part 3: Hands-On Exercise (10 min)**
- Take a real feature from your backlog
- Convert it to executable specifications
- Use Claude to validate your specs are clear enough

**Claude Prompts Included:**

```markdown
SPEC CLARITY CHECKER
────────────────────
I have a feature request: [FEATURE]

Analyze this specification for AI-executability:
1. Is the expected behavior unambiguous?
2. Can success/failure be automatically verified?
3. What clarifying questions would an engineer ask?
4. Rewrite as GIVEN-WHEN-THEN acceptance criteria.
```

```markdown
SPEC GENERATOR
──────────────
Business requirement: [REQUIREMENT]
Domain context: [CONTEXT]

Generate:
1. User story in standard format
2. 3-5 acceptance criteria (GIVEN-WHEN-THEN)
3. Edge cases to consider
4. Suggested test scenarios
```

**Templates:**
- Specification Template (Notion/Markdown)
- Acceptance Criteria Checklist
- Feature Specification Example Library

---

### Module 3: Small Batch Workflow (30 min)

**The Pillar:** Break work into focused chunks AI can execute reliably. Large scope = AI chaos.

**Why It Matters for Autonomous SDLC:**
AI agents have context limits. They excel at focused, well-scoped tasks. They fail at sprawling, multi-day epics. Small batch workflow means AI delivers reliably. Large batches mean constant rework.

**Content:**

**Part 1: The Principle (10 min)**
- Why large prompts produce worse results (context degradation)
- The 30-Minute Rule: if AI can't finish in 30 min, batch is too big
- One batch = one commit = one reviewable unit
- The decomposition skill

**Part 2: Implementation (10 min)**
- Breaking features into AI-sized chunks
- The dependency graph: what order to implement
- Maintaining momentum across batches
- When to combine vs. split batches

**Part 3: Hands-On Exercise (10 min)**
- Take a feature from your roadmap
- Decompose into 5-10 small batches
- Define the implementation sequence
- Estimate AI execution time per batch

**Claude Prompts Included:**

```markdown
BATCH DECOMPOSER
────────────────
Feature: [FEATURE DESCRIPTION]
Codebase context: [ARCHITECTURE NOTES]

Decompose this feature into small batches where each batch:
- Can be completed in <30 minutes
- Results in one reviewable PR
- Has clear done criteria

For each batch provide:
1. Batch name
2. Scope (what's included/excluded)
3. Dependencies (which batches must come first)
4. Done criteria
5. Estimated complexity (S/M/L)
```

```markdown
BATCH EXECUTOR
──────────────
Batch: [BATCH NAME]
Specification: [ACCEPTANCE CRITERIA]
Context: [RELEVANT CODE/ARCHITECTURE]

Execute this batch:
1. List files to modify/create
2. Implement changes
3. Write/update tests
4. Verify done criteria met
```

**Templates:**
- Batch Decomposition Worksheet
- Feature → Batches Planning Template
- Batch Execution Checklist

---

### Module 4: Test-First Practices (30 min)

**The Pillar:** Write tests before implementation. Tests are specifications AI executes against.

**Why It Matters for Autonomous SDLC:**
Without tests, how do you know AI code works? Manual review doesn't scale. Test-first means AI knows exactly what "done" looks like. The test IS the specification. AI implements until tests pass.

**Content:**

**Part 1: The Principle (10 min)**
- Tests as executable specifications
- The Red-Green-Refactor loop with AI
- Why "write tests after" doesn't work for autonomous SDLC
- The Two Agents pattern: one writes tests, one implements

**Part 2: Implementation (10 min)**
- Writing tests AI can implement against
- Test granularity: unit vs. integration vs. e2e
- Setting up the feedback loop
- Handling edge cases and error paths

**Part 3: Hands-On Exercise (10 min)**
- Take one batch from Module 3
- Write the test first (before any implementation)
- Use Claude to implement until test passes
- Experience the Red-Green-Refactor loop

**Claude Prompts Included:**

```markdown
TEST GENERATOR (Run First)
──────────────────────────
Feature: [FEATURE]
Acceptance criteria: [CRITERIA]
Tech stack: [STACK]

Write comprehensive tests that:
1. Cover all acceptance criteria
2. Include happy path and edge cases
3. Are specific enough to verify correct implementation
4. Will FAIL until feature is properly implemented

Do NOT write implementation code.
```

```markdown
IMPLEMENTATION AGENT (Run Second)
─────────────────────────────────
Tests to pass: [PASTE TESTS]
Codebase context: [ARCHITECTURE]
Conventions: [PATTERNS USED]

Implement the minimum code to make all tests pass.
Follow existing patterns and conventions.
Do not modify the tests.
```

```markdown
TWO-AGENT ADVERSARIAL LOOP
──────────────────────────
Agent 1 (Tester): Write tests for [FEATURE]
Agent 2 (Implementer): Make tests pass
Agent 1 (Tester): Review implementation, add edge case tests
Agent 2 (Implementer): Make new tests pass
Repeat until Agent 1 can't find gaps.
```

**Templates:**
- Test-First Workflow Checklist
- Test Coverage Requirements by Feature Type
- Two-Agent Setup Guide

---

### Module 5: Deployment Safety (30 min)

**The Pillar:** Ship changes safely with feature flags and instant rollback. Enable AI to deploy without fear.

**Why It Matters for Autonomous SDLC:**
Autonomous AI will ship many changes. If deployment is scary, you'll never let AI ship autonomously. Feature flags + instant rollback = AI can deploy continuously. You control exposure. Bad change? Toggle off in seconds.

**Content:**

**Part 1: The Principle (10 min)**
- Decoupling deployment from release
- Feature flags: ship dark, enable gradually
- Instant rollback capability
- Why deployment frequency correlates with safety (not risk)

**Part 2: Implementation (10 min)**
- Feature flag implementation patterns
- Flag lifecycle: create → enable → remove
- Percentage rollouts and targeting
- Monitoring and automatic rollback triggers

**Part 3: Hands-On Exercise (10 min)**
- Add a feature flag to your batch from Module 4
- Deploy dark (flag off)
- Enable for yourself only
- Simulate rollback

**Claude Prompts Included:**

```markdown
FEATURE FLAG IMPLEMENTER
────────────────────────
Feature: [FEATURE]
Implementation: [CODE]
Flag system: [LaunchDarkly/Unleash/custom]

Wrap this feature in a feature flag:
1. Add flag check at entry point
2. Provide fallback behavior when flag is off
3. Add flag to configuration
4. Log flag evaluation for monitoring
```

```markdown
SAFE DEPLOYMENT CHECKLIST GENERATOR
───────────────────────────────────
Change: [DESCRIPTION]
Risk level: [LOW/MEDIUM/HIGH]
Rollback strategy: [STRATEGY]

Generate deployment checklist:
1. Pre-deployment verification steps
2. Deployment sequence
3. Post-deployment validation
4. Rollback triggers and procedure
5. Monitoring alerts to enable
```

**Templates:**
- Feature Flag Naming Conventions
- Deployment Safety Checklist
- Rollback Runbook Template

---

### Module 6: Context Management (30 min)

**The Pillar:** Systematize knowledge so AI has the context it needs to make good decisions.

**Why It Matters for Autonomous SDLC:**
AI makes decisions based on context provided. If architectural knowledge lives in people's heads, AI can't access it. Context management means AI has the same information your best engineers have. Bad context = bad decisions. Good context = AI performs like a senior engineer.

**Content:**

**Part 1: The Principle (10 min)**
- Three types of context: architectural, domain, conventional
- Why documentation isn't enough (AI needs structured context)
- The CLAUDE.md file: your project's constitution
- Living documentation that AI can consume

**Part 2: Implementation (10 min)**
- Building a Project Context Document
- Domain glossary: teaching AI your ubiquitous language
- Pattern library: showing AI how you do things
- Architectural Decision Records (ADRs)

**Part 3: Hands-On Exercise (10 min)**
- Create CLAUDE.md for your project
- Document top 5 domain concepts
- Add 3 architectural patterns AI should follow
- Test: ask Claude about your domain and see if it understands

**Claude Prompts Included:**

```markdown
CONTEXT DOCUMENT GENERATOR
──────────────────────────
Project: [NAME]
Tech stack: [STACK]
Key files to analyze: [FILES]

Generate a CLAUDE.md context document including:
1. Project overview and purpose
2. Architecture summary
3. Key domain concepts and terminology
4. Coding conventions and patterns
5. Important files and their purposes
6. Things AI should never do
```

```markdown
DOMAIN GLOSSARY BUILDER
───────────────────────
Codebase: [DESCRIPTION]
Key entities: [LIST]

Build a domain glossary that:
1. Defines each domain term precisely
2. Shows relationships between concepts
3. Provides examples of correct usage
4. Notes common confusions to avoid
```

```markdown
PATTERN EXTRACTOR
─────────────────
Analyze these files: [FILES]

Extract the patterns used:
1. Code organization patterns
2. Naming conventions
3. Error handling approach
4. Testing patterns
5. Common abstractions

Format as a pattern library AI can reference.
```

**Templates:**
- CLAUDE.md Starter Template
- Domain Glossary Template
- Pattern Library Structure
- Architectural Decision Record Template

---

### Module 7: AI Integration (30 min)

**The Pillar:** Systematize AI usage across your workflow. From chaotic to systematic.

**Why It Matters for Autonomous SDLC:**
Chaotic AI adoption = inconsistent results. Some engineers benefit, others struggle. Systematic AI integration means the whole team leverages AI effectively with consistent quality. This is the bridge from AI-assisted to AI-autonomous.

**Content:**

**Part 1: The Principle (10 min)**
- The maturity ladder: ad-hoc → assisted → augmented → autonomous
- Defining AI touchpoints in your SDLC
- Quality gates for AI output
- Measuring AI effectiveness

**Part 2: Implementation (10 min)**
- AI workflow design: where AI participates
- Human checkpoints: where humans review
- Automation triggers: when AI runs autonomously
- Feedback loops: how AI improves over time

**Part 3: Hands-On Exercise (10 min)**
- Map your current SDLC workflow
- Identify AI touchpoints for each stage
- Define quality gates and checkpoints
- Design your target autonomous workflow

**Claude Prompts Included:**

```markdown
SDLC WORKFLOW ANALYZER
──────────────────────
Current workflow: [DESCRIPTION]
Team size: [SIZE]
Pain points: [ISSUES]

Analyze this workflow for AI integration:
1. Which stages can be AI-assisted today?
2. Which stages can be AI-autonomous with proper setup?
3. Where are the quality gates needed?
4. What's blocking full autonomy at each stage?
```

```markdown
AUTONOMOUS WORKFLOW DESIGNER
────────────────────────────
Capabilities: [WHAT AI CAN DO]
Constraints: [WHAT HUMANS MUST DO]
Risk tolerance: [LOW/MEDIUM/HIGH]

Design an autonomous SDLC workflow:
1. Trigger: What initiates the workflow
2. AI actions: What AI does autonomously
3. Checkpoints: Where humans review
4. Quality gates: Automated validation
5. Escalation: When to stop and involve humans
```

**Templates:**
- SDLC Workflow Mapping Template
- AI Integration Checklist
- Quality Gate Definitions
- Autonomous Workflow Blueprint

---

### Module 8: Build Your Prototype (45 min)

**Purpose:** Connect all six pillars and run your first autonomous SDLC workflow.

**Content:**

**Part 1: Connecting the Pillars (15 min)**
- How the six pillars form a complete system
- The autonomous workflow: end-to-end
- Setting up your environment
- The orchestration layer

**Part 2: Your First Autonomous Run (20 min)**
Step-by-step guided exercise:

```
AUTONOMOUS SDLC PROTOTYPE RUN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: SPECIFICATION (Module 2)
  → Pick a small feature from your backlog
  → Write executable specification
  → Validate with Spec Clarity Checker prompt

Step 2: DECOMPOSITION (Module 3)
  → Break into 2-3 small batches
  → Define sequence and dependencies
  → Confirm each batch is <30 min

Step 3: CONTEXT SETUP (Module 6)
  → Ensure CLAUDE.md is loaded
  → Provide relevant domain context
  → Include pattern references

Step 4: TEST-FIRST EXECUTION (Module 4)
  → Run Test Generator prompt
  → Run Implementation Agent prompt
  → Verify tests pass

Step 5: SAFE DEPLOYMENT (Module 5)
  → Wrap in feature flag
  → Deploy dark
  → Enable and validate

Step 6: REVIEW & ITERATE
  → Assess the output quality
  → Note what worked, what didn't
  → Refine prompts and context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTCOME: You just ran autonomous SDLC.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Part 3: What's Next (10 min)**
- Scaling from prototype to team-wide
- The path to full autonomy
- Where consulting helps accelerate
- Resources for continued learning

**Deliverables:**
- Completed prototype workflow
- Customized prompt library for your stack
- CLAUDE.md for your project
- Transformation roadmap with next steps

**The Master Prompt:**

```markdown
SOFTWARE FACTORY ORCHESTRATOR
─────────────────────────────
Project context: [CLAUDE.md contents]
Feature specification: [SPEC]
Batches: [BATCH LIST]

Execute Software Factory workflow:

1. For each batch in sequence:
   a. Load relevant context
   b. Generate tests (Test Generator)
   c. Implement (Implementation Agent)
   d. Verify tests pass
   e. Add feature flag
   f. Prepare deployment

2. After all batches:
   a. Integration verification
   b. Deployment checklist
   c. Documentation update

Report progress after each batch.
Stop and escalate if tests fail after 3 attempts.
```

## What's Included — Summary

### Video Content (4-5 hours)
- Module 1: Assessment + Vision (45 min)
- Module 2: Spec-Driven Development (30 min)
- Module 3: Small Batch Workflow (30 min)
- Module 4: Test-First Practices (30 min)
- Module 5: Deployment Safety (30 min)
- Module 6: Context Management (30 min)
- Module 7: AI Integration (30 min)
- Module 8: Build Your Prototype (45 min)

### Claude Prompts Library (15+ prompts)
- Spec Clarity Checker
- Spec Generator
- Batch Decomposer
- Batch Executor
- Test Generator
- Implementation Agent
- Two-Agent Adversarial Loop
- Feature Flag Implementer
- Safe Deployment Checklist Generator
- Context Document Generator
- Domain Glossary Builder
- Pattern Extractor
- SDLC Workflow Analyzer
- Autonomous Workflow Designer
- Software Factory Orchestrator

### Templates & Tools
- Software Factory Readiness Assessment
- Transformation Roadmap Template
- Specification Template
- Batch Decomposition Worksheet
- Test-First Workflow Checklist
- Feature Flag Implementation Guide
- CLAUDE.md Starter Template
- Domain Glossary Template
- Pattern Library Structure
- SDLC Workflow Mapping Template
- Autonomous Workflow Blueprint

### Outcome
Working Software Factory prototype you can:
- Demonstrate to your team
- Use immediately on real work
- Expand to team-wide implementation

## Target Buyer

**Primary: Engineering Leaders (ICP #1)**

Profile:
- CTOs, VPs of Engineering, Engineering Directors
- Post-PMF B2B SaaS ($1-5M ARR)
- 5-15 engineers
- Already using AI tools, seeing mixed results
- Want systematic approach for the team

**Why they buy ($27):**
"I need to understand this deeply before rolling it out to my team. $27 is nothing. If this gives me a working prototype I can demonstrate, it's worth 100x that."

**What they do after:**
- Show prototype to team: "This is where we're going"
- Book strategy session: "Help us implement team-wide"
- Share course with key engineers: creates internal champions

**Secondary: Senior Engineers who will become champions**

Profile:
- Tech leads, architects who influence leadership
- Want to bring innovation to their company
- Will take course, show results to CTO/VP

**Why they buy:**
"I can learn this, build a prototype, and show my leadership why we need to do this company-wide."

## Positioning & Messaging

### The Promise

**Headline:**
> **Software Factory 2027**
> *Join the movement. Build your autonomous SDLC.*

**Subhead:**
"By 2027, the best engineering organizations will operate as Software Factories. This course gives you the six pillars framework, the Claude prompts, and hands-on exercises to build your working prototype today."

**The Outcome:**
"In 4-5 hours, you'll go from 'interesting concept' to 'working prototype I can demonstrate.'"

### Landing Page Structure

**1. Hero**
> **Software Factory 2027**
> *Join the movement. Build your autonomous SDLC.*
>
> "The engineering organizations building autonomous SDLC now will outpace everyone else. This course gives you the framework, tools, and hands-on practice to build your working prototype."
>
> **$27 — Get Instant Access**

**2. The Shift**
"By 2027, software development changes fundamentally..."
- Visual: Before/After comparison
- AI-assisted → AI-autonomous
- Engineers coding → Engineers supervising
- Ad-hoc tools → Systematic Software Factory

**3. The Problem**
"You've adopted AI tools. Results are... mixed."
- Some engineers 3x productive, others struggling
- No consistency across the team
- Can't measure or systematize
- "We're using AI" but not strategically

**4. The Solution**
"Autonomous SDLC requires six foundational pillars. This course teaches each one — with Claude prompts you can use immediately — and guides you to build a working prototype."

**5. The Six Pillars** (visual overview)
Brief description of each with icons

**6. What You'll Build**
"By Module 8, you'll have:"
- Working autonomous SDLC prototype
- Customized prompt library
- CLAUDE.md for your project
- Clear roadmap for team-wide rollout

**7. Course Curriculum**
Module breakdown with time estimates

**8. What's Included**
- 4-5 hours of video
- 15+ Claude prompts
- Templates and tools
- Hands-on exercises
- Working prototype

**9. Who This Is For**
- Engineering leaders wanting to pioneer autonomous SDLC
- Leaders who need to understand deeply before team rollout
- Tech leads who want to bring innovation to their org

**10. Who This Is NOT For**
- Individual engineers wanting personal productivity (see $47 course)
- People who just want prompts without understanding
- Organizations not ready for change

**11. Guarantee**
"Complete Module 8 and build your prototype. If you don't see the path to autonomous SDLC for your team, email for a full refund."

**12. CTA**
> **$27 — Start Building Your Software Factory**
> *Instant access. Build your prototype today.*

## The Upsell Path

### Immediate (Post-Purchase)

**Order Bump ($17): Extended Prompt Library**
- 30 additional Claude prompts
- Language-specific variations (TypeScript, Python, Go, Java, Ruby)
- Edge case handling
- Advanced orchestration prompts

### During Course (Module 8)

**CTA: Strategy Session**
"You've built your prototype. Ready to roll this out team-wide? Book a free 30-minute strategy session to plan your transformation."

→ Direct to consultation → Consulting engagement

### Post-Course Email Sequence (7 emails, 14 days)

**Email 1 (Day 0):** Congratulations + quick wins checklist

**Email 2 (Day 2):** "How to demonstrate your prototype to your team"

**Email 3 (Day 4):** Case study: "How [Company] went from prototype to team-wide"

**Email 4 (Day 7):** "The 3 mistakes teams make scaling autonomous SDLC"

**Email 5 (Day 9):** "Your 90-day transformation roadmap"

**Email 6 (Day 11):** "When to DIY vs. get help"

**Email 7 (Day 14):** Strategy session offer + consulting overview

### Cross-Sell

**To Engineers on Their Team:**
"Share the $47 Engineering Excellence for Claude Code course with your engineers. Same pillars, individual focus. Creates internal champions."

## Integration With Engineer Tripwire

```
LEADER PATH ($27 Course):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Course → Prototype → Demo to Team → Strategy Session → Consulting
                          ↓
                 Share $47 course with engineers
                          ↓
                 Engineers become champions
                          ↓
                 Reinforces transformation


ENGINEER PATH ($47 Course):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Course → Personal Implementation → Results
                          ↓
                 "We should do this team-wide"
                          ↓
                 Leader buys $27 course
                          ↓
                 Strategy Session → Consulting
```

**Differentiation:**

| Leader Course ($27) | Engineer Course ($47) |
|--------------------|----------------------|
| Strategic overview of all 6 pillars | Deep dive on 3 core practices |
| Team-wide implementation focus | Individual workflow focus |
| Build prototype to demonstrate | Build personal mastery |
| Leads to consulting | Leads to internal advocacy |
| 4-5 hours | 3 hours |

## Implementation Plan

### Phase 1: Content Creation (Weeks 1-4)

**Week 1:**
- [ ] Module 1: Assessment + Vision (script, video, assessment tool)
- [ ] Module 2: Spec-Driven Development (script, video, prompts, templates)

**Week 2:**
- [ ] Module 3: Small Batch Workflow (script, video, prompts, templates)
- [ ] Module 4: Test-First Practices (script, video, prompts, templates)

**Week 3:**
- [ ] Module 5: Deployment Safety (script, video, prompts, templates)
- [ ] Module 6: Context Management (script, video, prompts, templates)

**Week 4:**
- [ ] Module 7: AI Integration (script, video, prompts, templates)
- [ ] Module 8: Build Your Prototype (script, video, orchestration guide)

### Phase 2: Production & Setup (Week 5)

- [ ] Edit all videos
- [ ] Design prompt library document
- [ ] Package all templates
- [ ] Set up course platform
- [ ] Create landing page
- [ ] Set up payment processing
- [ ] Write email sequences

### Phase 3: Beta Test (Week 6)

- [ ] Recruit 10 engineering leaders from network
- [ ] Have them complete full course including prototype
- [ ] Gather feedback on content, prompts, exercises
- [ ] Refine based on feedback
- [ ] Collect testimonials and case studies

### Phase 4: Launch (Week 7)

- [ ] LinkedIn launch campaign
- [ ] Email to existing list
- [ ] Outreach to engineering leader communities
- [ ] Begin "Software Factory 2027" content series
- [ ] Activate cross-promotion with engineer course

## Success Metrics

### Revenue
- Month 1: 100 sales = $2,700
- Month 2: 200 sales = $5,400
- Month 3: 300 sales = $8,100
- Month 6: 1,000 cumulative = $27,000

### Engagement
- Course completion rate: >60%
- Module 8 completion (prototype built): >50%
- Prompt library usage: >80%

### Conversion (Primary Goal)
- Strategy session booking rate: 15-20% of completers
- Session → Proposal rate: 50%
- Proposal → Close rate: 30-40%
- **Target: 100 completers → 15-20 sessions → 8-10 proposals → 3-4 clients**

### Quality
- Refund rate: <5%
- NPS: >50
- "Built working prototype": >50%
- Testimonials collected: 10% of completers

## Competitive Differentiation

**What exists:**
- AI prompt collections (no framework, no system)
- Generic "AI for developers" courses (not SDLC-focused)
- Engineering maturity assessments (diagnostic only, no transformation)
- Consulting discovery calls (require commitment before value)

**What we offer:**
- **Framework + Tools:** Six pillars system with ready-to-use prompts
- **Hands-on Outcome:** Working prototype, not just knowledge
- **Leader-focused:** Team implementation, not personal productivity
- **Vision-led:** Software Factory 2027, not just "use AI better"
- **$27 Price:** Low-risk way to deeply evaluate before team commitment

## Risks and Mitigations

### Risk: Too long, people don't complete
**Mitigation:** Each module is standalone valuable. Prompt library usable immediately. Module 8 pulls it together but earlier modules have immediate value.

### Risk: Prototype exercise too hard
**Mitigation:** Provide starter project option. Detailed walkthrough. Support channel for stuck students.

### Risk: Leaders want quick answer, not 5-hour course
**Mitigation:** Position as "deep evaluation before team rollout." Leaders who won't invest 5 hours won't commit to transformation anyway — they're not our ICP.

### Risk: Competes with $47 engineer course
**Mitigation:** Clear differentiation. Leader course = team-wide prototype. Engineer course = personal mastery. Cross-promote each to the other's audience.

---

## Summary

**"Software Factory 2027"** is a $27 course that takes engineering leaders from "interested in autonomous SDLC" to "I have a working prototype."

**8 modules covering:**
1. Assessment + Vision
2. Spec-Driven Development
3. Small Batch Workflow
4. Test-First Practices
5. Deployment Safety
6. Context Management
7. AI Integration
8. Build Your Prototype

**Includes:**
- 4-5 hours of video
- 15+ Claude prompts (ready to use)
- Templates and tools for each pillar
- Hands-on exercises
- Working prototype by the end

**Outcome:**
Leaders complete the course with a working autonomous SDLC prototype they can demonstrate to their team — and a clear path to team-wide implementation via consulting.

**Price:** $27
**Target:** Engineering leaders at post-PMF startups
**Goal:** Strategy session bookings → Consulting engagements ($5K-15K)
