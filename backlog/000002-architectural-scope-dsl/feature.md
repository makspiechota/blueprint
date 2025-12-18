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

## Schema and Definition Management

### The Challenge

The detailed definitions and conceptual explanations above (What is Architectural Scope, the six scope lists, examples, etc.) are essential for users and AI agents to understand and correctly use the DSL. However, this information can't live in the user's YAML files themselves because:

1. **User files are volatile** — Users modify them freely for their specific business context
2. **Definitions are universal** — The meaning of "What" or "How" scope lists doesn't change per user
3. **AI needs consistent reference** — AI agents processing Blueprint files need authoritative definitions without web searches

### Proposed Solution: Pluggable Schema Architecture

Blueprint should use a **pluggable schema system** where each layer has its own schema file containing:
- Field definitions and validation rules
- Conceptual explanations of what each field means
- Examples and usage guidance
- Relationships to other layers

**Structure:**
```
schemas/
├── schema.json                 # Root schema registry
├── north-star.schema.json      # Layer 1: North Star definitions
├── architectural-scope.schema.json  # Layer 2: Architectural Scope definitions
└── [future-layer].schema.json  # Layer 3+: Additional layers
```

**Benefits:**
- **Pluggable**: Each layer is self-contained and can be added/removed independently
- **Versioned**: Schemas evolve with the DSL, tracked in git
- **AI-readable**: AI agents can load schema files to understand Blueprint structure
- **User-friendly**: Tools can generate contextual help from schema metadata
- **Extensible**: New layers can be added without modifying existing schemas

**Schema Content Example (architectural-scope.schema.json):**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "layer": "architectural-scope",
  "description": "Architectural scope boxes the business solution space using six scope lists",
  "metadata": {
    "methodology": "Ronald Ross / Zachman Framework",
    "purpose": "Define solution boundaries before technical implementation"
  },
  "properties": {
    "what": {
      "type": "array",
      "description": "Business entities and information objects",
      "scopeQuestion": "What are the business data, information, or objects?",
      "examples": ["Customer Accounts", "Orders", "Product Catalog"],
      "sizing": {
        "min": 3,
        "max": 12,
        "optimal": 7
      }
    },
    "how": {
      "type": "array",
      "description": "Business processes and mechanisms",
      "scopeQuestion": "How does the business work?",
      "examples": ["Order Fulfillment", "Payment Processing"]
    }
    // ... other scope lists
  },
  "relationships": {
    "requires": ["north-star"],
    "description": "Architectural scope builds upon and references a north star"
  }
}
```

**Implementation Implications:**
- Parser must load and reference appropriate schema for each layer
- Validation uses schema rules (3-12 items, required references, etc.)
- Visualization can extract metadata from schemas for tooltips and help text
- Documentation can be auto-generated from schema definitions
- AI agents receive schema as context when processing Blueprint files

This approach ensures that definitional knowledge is preserved, accessible to both humans and AI, version-controlled, and doesn't pollute user's business documents.

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
- **Version Control**: YAML files are plain text that can be committed to git alongside north star files

### Integrated Visualization Design

The visualization tool must display north star and architectural scope together, showing how strategic vision translates into concrete solution boundaries.

**UI Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│  Product Name - Blueprint                                    │
├─────────────────────────────────────────────────────────────┤
│  [North Star Tab] [Architectural Scope Tab]                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  TAB CONTENT AREA                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**North Star Tab:**
- Displays vision, problem, solution, strategic goals (existing visualization from feature 000001)
- Add subtle "View Architectural Scope →" link at bottom that switches to second tab
- Shows north star file path and last updated timestamp

**Architectural Scope Tab:**
- Header section:
  - Reference to north star (clickable link to switch to North Star tab)
  - Total scope item count (e.g., "48 scope items across 6 lists")
  - Visual indicator if scope size is optimal (green: 40-60 items, yellow: 30-70, red: <30 or >70)

- Six scope lists displayed as cards in 2x3 grid:

```
┌─────────────────────┬─────────────────────┐
│ What (Data)         │ How (Processes)     │
│ 8 items ✓           │ 7 items ✓           │
│                     │                     │
│ • Customer Accounts │ • Order Fulfillment │
│ • Orders            │ • Payment Process   │
│ • Product Catalog   │ • Inventory Mgmt    │
│ ...                 │ ...                 │
├─────────────────────┼─────────────────────┤
│ Where (Locations)   │ Who (Organizations) │
│ 5 items ⚠️          │ 9 items ✓           │
├─────────────────────┼─────────────────────┤
│ When (Time/Events)  │ Why (Motivation)    │
│ 6 items ✓           │ 1 mission + 4 goals │
└─────────────────────┴─────────────────────┘
```

**Scope List Card Details:**
- **Header**: Scope question (e.g., "What are the business data and objects?")
- **Item count badge**: Green (3-12 items), Yellow (<3 or >12), Red (empty)
- **Item list**: Each item shows title, with expandable description on click
- **Tooltip on hover**: Shows the conceptual definition from schema (e.g., "Business entities and information that the solution must handle")

**Why (Motivation) Card - Special Treatment:**
- **Business Mission** displayed prominently at top with icon
- Shows the three components: Action + Service + Beneficiary
- **Business Goals** listed below as ongoing objectives
- Visual distinction from other scope lists (different background color)

**Interactive Features:**
- **Click item**: Expands to show full description
- **Search/filter**: Search box to filter scope items across all lists
- **Export**: Button to download combined visualization as PDF
- **Schema help**: Info icon on each card that shows schema definitions when clicked
- **Traceability**: Visual connection indicators showing which scope items relate to which strategic goals (hover interaction)

**Responsive Design:**
- Desktop: 2x3 grid of scope list cards
- Tablet: 2x3 grid with horizontal scroll
- Mobile: Single column, cards stack vertically

**Empty State Handling:**
- If a scope list is not defined (optional): Show card with dashed border and "Not defined" message
- If scope list is defined but empty (validation error): Show red warning "Empty list - add 3-12 items"
- If no architectural scope exists yet: Show helpful message "Create architectural-scope.yaml to define solution boundaries"

**Technical Implementation:**
- Single HTML file output (like north star visualization)
- Tabs implemented with CSS/vanilla JavaScript (no external dependencies)
- Schema definitions embedded in HTML for tooltips and help text
- Responsive CSS grid layout
- Print-friendly CSS for PDF export

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
