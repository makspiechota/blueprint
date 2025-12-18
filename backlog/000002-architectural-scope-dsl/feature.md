# Feature: Architectural Scope DSL

## Problem

After defining the north star (enterprise mission), teams need to "box the business solution space" by defining architectural scope using Ronald Ross's methodology. Without this structured second layer, teams jump directly from high-level strategy to detailed implementation, missing the critical step of defining solution boundaries in business terms. This leads to scope creep, misaligned stakeholders, and solutions that don't match business needs.

The architectural scope layer bridges the gap between strategic vision (north star) and technical implementation by answering six fundamental questions: What, How, Where, Who, When, and Why.

## What is Architectural Scope?

Architectural scope is a **structural representation of a business solution** that defines clear boundaries for what will be built, following the [Zachman Framework](https://www.visual-paradigm.com/guide/enterprise-architecture/what-is-zachman-framework/)'s enterprise architecture approach and [Ronald Ross's business architecture methodology](https://www.brcommunity.com/articles.php?id=b873).

### Purpose and Definition

Architectural scope serves to **"box the business solution space"** by creating bounded lists that answer six fundamental interrogatives. As Ross explains, this provides a "ballpark view" of what the business capability will become, establishing clear inclusion/exclusion boundaries **before** technical design begins.

**Key Distinction:**
- **North Star (Enterprise Mission)** = Strategic vision defining *why* the business exists and *what effect* it aims to achieve
- **Architectural Scope** = Concrete definition of *what will be built* to realize that mission, sized and bounded in business terms

### The Six Scope Lists (Based on Zachman Framework)

Following John Zachman's enterprise ontology, architectural scope uses six interrogatives to comprehensively define the solution space:

#### 1. **What (Data/Things)**
*"What are the business data, information, or objects?"*

**Scope Items:** Core business entities and information that the solution must handle.

**Examples:**
- Customer Accounts
- Orders and Transactions
- Product Catalog
- Inventory Records
- User Profiles

**Size:** 3-12 items representing the key "nouns" of the business domain.

#### 2. **How (Function/Processes)**
*"How does the business work? What are the business processes?"*

**Scope Items:** Key business processes and mechanisms the solution must support.

**Examples:**
- Order Fulfillment Process
- Customer Onboarding Workflow
- Payment Processing
- Inventory Management
- Returns and Refunds

**Size:** 3-12 items representing the critical "verbs" or activities.

#### 3. **Where (Network/Locations)**
*"Where are the business operations located?"*

**Scope Items:** Geographic locations, distribution points, or operational boundaries.

**Examples:**
- North American Markets
- European Distribution Centers
- Remote Work Locations
- Cloud Infrastructure Regions
- Retail Storefronts

**Size:** 3-12 items defining geographical or logical boundaries.

#### 4. **Who (People/Organizations)**
*"Who are the people and organizational units involved?"*

**Scope Items:** Organizational units, roles, or stakeholder groups.

**Examples:**
- Sales Team
- Customer Support Organization
- Partner Network
- End Customers
- Third-Party Vendors

**Size:** 3-12 items representing key organizational actors.

#### 5. **When (Time/Events)**
*"When are business processes performed? What are the schedules and workflows?"*

**Scope Items:** Critical timing constraints, business cycles, or event triggers.

**Examples:**
- Real-time Order Processing
- Monthly Billing Cycles
- Seasonal Campaigns
- Annual Planning Windows
- Regulatory Reporting Deadlines

**Size:** 3-12 items capturing temporal aspects.

#### 6. **Why (Motivation/Goals)**
*"Why is this solution chosen? What motivates these decisions?"*

**Scope Items:** Business mission and ongoing business goals (not project objectives).

**Key Concepts from [Ross's business motivation framework](https://www.brcommunity.com/articles.php?id=b876):**

**Business Mission:** What the business capability is responsible for doing in day-to-day operations. Must include:
1. **The Action** — what is being done (e.g., "to provide")
2. **Service Differentiation** — what specifically (e.g., "retirement savings products")
3. **Beneficiary** — who benefits (e.g., "customers of all ages")

**Business Goals:** Effects the capability must achieve **indirectly** through executing the mission. These are ongoing, never-ending objectives that guide operational decisions.

**Examples:**
- Mission: "To provide secure online payment processing for e-commerce merchants globally"
- Goal: "Maintain 99.99% transaction reliability"
- Goal: "Minimize payment fraud exposure"
- Goal: "Ensure regulatory compliance across all markets"

**Size:** 1 mission + 2-5 ongoing business goals.

### The 7±2 Principle

Ross emphasizes that each scope list should contain **3-12 items**, with 7 being optimal. This follows cognitive science research showing humans can effectively hold "seven plus or minus two" chunks of information.

**Why this matters:**
- **Too few items (<3):** Scope may be under-defined or too abstract
- **Too many items (>12):** Solution is likely too complex or poorly factored
- **Sweet spot (5-9):** Clear, manageable, well-bounded solution

**Total scope:** Approximately **50 items across all six lists** defines a well-sized business capability.

### Relationship to North Star

The architectural scope **builds upon and references** the north star (enterprise mission):

```
North Star (Layer 1)
├── Vision: Future state transformation
├── Problem: High-level challenges
├── Solution: Strategic approach
└── Strategic Goals: Top objectives
    ↓
Architectural Scope (Layer 2)
├── What: Business entities needed to realize the vision
├── How: Processes that execute the solution approach
├── Where: Locations for delivering the solution
├── Who: Organizations implementing the strategic goals
├── When: Timing aligned with transformation roadmap
└── Why: Mission and goals that operationalize the vision
```

### Sources and Methodology

This approach combines:
- **[Zachman Framework](https://www.leanix.net/en/wiki/ea/zachman-framework)** — Six interrogatives for enterprise architecture
- **[Ronald Ross's Business Architecture](https://www.brcommunity.com/articles.php?id=b873)** — Scope lists for "boxing" solution space
- **[Business Motivation Model](https://www.brcommunity.com/articles.php?id=b876)** — Mission and goals framework
- **[Roger Burlton's Value Chain Perspective](https://www.brcommunity.com/articles.php?id=b905)** — Scope definition via value creation

## Users

- Business analysts defining solution boundaries and scope
- Solution architects planning system design based on business capabilities
- Project managers scoping work and preventing scope creep
- Product strategists translating north star into actionable architecture
- Stakeholders reviewing and approving solution boundaries

## User Stories

1. As a business analyst, I want to define architectural scope using the six scope lists (What, How, Where, Who, When, Why) so that I can establish clear solution boundaries before technical design begins

2. As a solution architect, I want to reference the north star and build upon it with architectural scope so that my technical decisions align with enterprise mission and strategic goals

3. As a project manager, I want to validate that each scope list contains 3-12 items so that the solution space is appropriately sized and bounded (following Ross's 7±2 principle)

4. As a stakeholder, I want to visualize the north star and architectural scope together so that I can see how strategic vision translates into concrete business capabilities

5. As a collaborative team, I want to version control architectural scope alongside the north star so that we can track how solution boundaries evolve over time

6. As a product strategist, I want the architectural scope to require a reference to an existing north star so that scope is always grounded in enterprise mission

## Expected Behavior

- **YAML DSL Format**: Users can write architectural scope specifications in YAML following the six-list structure (What, How, Where, Who, When, Why)
- **North Star Reference**: Each architectural scope must reference an existing north star file and validation ensures it exists
- **Optional Lists**: All six scope lists are optional - teams can define only the lists relevant to their context
- **Item Validation**: When a scope list is present, it must contain 3-12 items (following Ross's principle of "boxing" the solution space)
- **Structured Items**: Each scope item has a title and description explaining its role in the solution
- **Integrated Visualization**: The visualization tool displays north star and architectural scope together in separate tabs, showing the relationship between strategic vision and solution boundaries
- **Version Control**: YAML files are plain text that can be committed to git alongside north star files

## Edge Cases

- **Missing North Star**: If referenced north star file doesn't exist, validation should fail with clear error message
- **Empty Scope Lists**: If a scope list is defined but empty (0 items), validation should fail
- **List Size Violations**: If a scope list has <3 or >12 items, validation should warn (soft validation) but not fail, since context may justify exceptions
- **All Lists Empty**: If architectural scope file has no scope lists defined at all, validation should warn that at least one list is recommended
- **Orphaned Scope**: If north star is deleted but architectural scope still references it, validation should detect this

## Success Criteria

- Business analysts can define solution boundaries using the six scope lists without requiring technical knowledge
- Validation catches missing north star references and enforces 3-12 item ranges for defined lists
- The visualization clearly shows both north star (strategic vision) and architectural scope (solution boundaries) in an integrated tabbed interface
- Teams adopt architectural scope as the standard bridge between strategy and implementation
- Scope definitions prevent scope creep by establishing clear inclusion/exclusion boundaries before development

## Business Value

- **Solution Boundaries**: Provides teams with clear, agreed-upon boundaries for what's in scope and what's excluded, preventing costly scope creep
- **Strategic Alignment**: Ensures architectural decisions trace back to enterprise mission and strategic goals
- **Stakeholder Agreement**: Creates a collaborative artifact where business and technical stakeholders align on solution space before implementation
- **Communication Tool**: Enables effective communication of solution scope using business language (not technical jargon)
- **Planning Foundation**: The architectural scope becomes the input for technical design, development planning, and project estimation
- **Methodology Differentiation**: Implements proven Ronald Ross methodology, providing a structured approach that sets BLUEPRINT apart from ad-hoc documentation tools
