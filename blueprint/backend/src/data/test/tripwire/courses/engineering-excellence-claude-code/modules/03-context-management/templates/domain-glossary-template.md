# Domain Glossary Template

A domain glossary defines the ubiquitous language of your project. This ensures Claude Code (and your team) uses terms consistently.

---

# [Project Name] Domain Glossary

## Core Concepts

### [Term 1]
**Definition:** [What this term means in your domain]

**NOT to be confused with:** [Similar terms that mean different things]

**Examples:**
- [Example of correct usage]
- [Example of correct usage]

**Related terms:** [Term A], [Term B]

---

### [Term 2]
**Definition:** [What this term means in your domain]

**NOT to be confused with:** [Similar terms that mean different things]

**Examples:**
- [Example of correct usage]
- [Example of correct usage]

**Related terms:** [Term A], [Term B]

---

## Entity Definitions

| Entity | Definition | Key Behaviors |
|--------|------------|---------------|
| User | [Definition] | [What it can do] |
| Account | [Definition] | [What it can do] |
| [Entity] | [Definition] | [What it can do] |

---

## State Definitions

### [Entity] States

| State | Meaning | Transitions To |
|-------|---------|----------------|
| draft | [When entity is in this state] | pending |
| pending | [When entity is in this state] | confirmed, cancelled |
| confirmed | [When entity is in this state] | shipped |
| [state] | [When entity is in this state] | [valid transitions] |

---

## Action Definitions

| Action | Meaning | Preconditions | Postconditions |
|--------|---------|---------------|----------------|
| confirm | [What this action does] | [What must be true] | [What becomes true] |
| cancel | [What this action does] | [What must be true] | [What becomes true] |
| [action] | [What this action does] | [What must be true] | [What becomes true] |

---

## Common Confusions

### [Term A] vs [Term B]
**[Term A]:** [Definition]
**[Term B]:** [Definition]
**Key difference:** [What distinguishes them]

### [Term C] vs [Term D]
**[Term C]:** [Definition]
**[Term D]:** [Definition]
**Key difference:** [What distinguishes them]

---

## Usage Examples

### Correct
```
// Good: Uses domain language correctly
const subscription = organization.getActiveSubscription();
```

### Incorrect
```
// Bad: Uses wrong term
const subscription = user.getSubscription(); // Users don't have subscriptions!
```
