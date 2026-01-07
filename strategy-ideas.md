# Business Blueprint Strategy: Supporting Multiple Products per North Star

## Core Challenge
- **One North Star, Multiple Products**: A single North Star (e.g., "Revolutionize customer support") can be achieved through multiple products (e.g., Blueprint SaaS, Software Factory SaaS, Engineering Excellence Trainings, Online Courses). Each product needs its own Architectural Scope (5W framework) and Policy Charters (hierarchical rules and risks), as these are product-specific.
- **Lean Canvas & Customers Factory Dilemma**: These layers are more "business-level" (overall business model and growth metrics). Should products have their own (and link/roll up to business-level) or just inherit from the top? This affects how we model relationships, metrics aggregation, and visualization.

## Key Requirements for the Blueprint
1. **Hierarchical Support**: The system should allow a "business blueprint" (top-level) with "product blueprints" (sub-levels) that contribute to it.
2. **Relationships & Linking**: Products should clearly show how they address the North Star, and their metrics/policies should link to or aggregate into business-level layers where relevant.
3. **Modularity**: Avoid duplication—shared elements (e.g., top-level Lean Canvas) should be referenceable, not copied.
4. **Visualization**: Users should navigate from business → products, seeing how sub-layers contribute (e.g., product AAARR metrics rolling up to business AAARR).
5. **Flexibility**: Some products might not need their own Lean Canvas/AAARR if they're tightly coupled; others (e.g., a new market entry) might.

## Proposed Solution: Hierarchical Blueprint with Selective Sub-Layers
The best approach is a **tree-like structure** where the business blueprint is the root, and products are child nodes. This allows inheritance, aggregation, and selective layering while keeping the blueprint clean and extensible.

### Data Model Structure
- **Root (Business Blueprint)**: Contains the top-level North Star, Lean Canvas, Lean Viability, AAARR Metrics, and optionally shared Architectural Scope/Policy Charter elements.
- **Children (Product Blueprints)**: Each product is a sub-blueprint under the business, with:
  - **Required**: Its own Architectural Scope (5W: Why, What, How, Where, Who, When) and Policy Charter (goals → tactics → policies → risks flow).
  - **Optional/Linked**: Lean Canvas and AAARR Metrics at the product level, which reference or roll up to the business level.
- **YAML Organization**:
  - `business-blueprint.yaml`: Root file with business layers and a `products` array/object listing sub-blueprints.
  - `products/blueprint-saas.yaml`, `products/software-factory.yaml`, etc.: Product-specific files, referencing the parent (e.g., `north_star_ref: "../business-blueprint.yaml"`).
  - Use IDs/references for linking (e.g., a product AAARR stage references a business AAARR metric for roll-up).
- **Inheritance/Aggregation**:
  - Products inherit the North Star but specify how they contribute (e.g., via a "contribution" field in Architectural Scope).
  - Lean Canvas: Business-level for the overall model; products can have their own if their offerings diverge (e.g., SaaS vs. Workshops), with cross-references (e.g., "This product's UVP supports business UVP X").
  - AAARR Metrics: Business-level for holistic growth; products have their own metrics that aggregate up (e.g., product acquisition funnels feed into business acquisition).
  - Policy Charter: Always product-specific, as rules vary by product.
  - Lean Viability: Business-level, as it's about overall financials; products can contribute assumptions (e.g., product-specific CAC).

### How Lean Canvas & Customers Factory Fit In
- **Lean Canvas**:
  - **Business-Level**: The primary canvas for the overall business model (problem, solution, UVP, etc.). This is the "north star" of business strategy.
  - **Product-Level**: Optional. Include only if the product has a distinct business model (e.g., a workshop product might have its own customer segments). If present, it should link to the business canvas (e.g., "This product's solution validates business solution X").
  - **Best for**: Products with independent revenue streams or markets. Avoid if it creates redundancy—use references instead.
- **Customers Factory (AAARR)**:
  - **Business-Level**: Core growth framework (acquisition, activation, retention, referral, revenue) for the entire business.
  - **Product-Level**: Strongly recommended. Each product should have its own AAARR metrics (e.g., separate funnels for SaaS vs. Courses), which roll up to business metrics (e.g., sum of product revenues = business revenue).
  - **Linking**: Use aggregation rules (e.g., product "acquisition" contributes 40% to business "acquisition"). This allows drill-down: Click a business AAARR metric to see contributing product metrics.
  - **Best for**: Ensures products drive measurable business growth without silos.

### Visualization & Navigation Strategy
- **UI Structure**:
  - **Top-Level Dashboard**: Show business blueprint layers. Include a "Products" section with cards for each product, showing high-level status (e.g., "Blueprint SaaS: Contributes 30% to North Star").
  - **Product Pages**: When drilling into a product, show its sub-blueprint (Architectural Scope, Policy Charter) alongside links to business layers (e.g., "This product's AAARR feeds into Business AAARR").
  - **Cross-Linking**: In visualizations, use arrows/badges to show relationships (e.g., product Lean Canvas → business Lean Canvas).
- **Navigation Flow**: Business → Select Product → View Product Layers (with breadcrumbs back to business).
- **Interactive Elements**: Hover/click on aggregated metrics (e.g., business revenue) to see breakdowns by product.

### Pros of This Approach
- **Scalability**: Easy to add/remove products without disrupting the business blueprint.
- **Clarity**: Clear separation—business for strategy, products for execution.
- **Aggregation**: Automatic roll-ups (e.g., total business revenue from product revenues) provide executive insights.
- **Flexibility**: Products can opt into additional layers (e.g., Lean Canvas) only when needed.
- **Maintenance**: Centralized business layers reduce duplication; changes propagate via references.

### Cons & Mitigations
- **Complexity**: Managing references/aggregations could be error-prone. Mitigate with validation rules in the schema (e.g., ensure product AAARR sums match business AAARR).
- **Over-Engineering**: For small businesses, full hierarchies might be overkill. Start with a simple "products" array in the business YAML, and expand as needed.
- **Data Volume**: Large YAML files. Mitigate by keeping references lightweight and using lazy loading in the UI.
- **Visualization Overload**: Too many links could confuse users. Use progressive disclosure (e.g., show relationships on demand).

### Alternative Solutions Considered
- **Flat Structure**: Each product has its own full blueprint (including Lean Canvas/AAARR). Pros: Simple, no linking. Cons: Duplication, hard to see business-level insights. Not ideal for cross-product strategy.
- **Shared Layers Only**: No product-specific Lean Canvas/AAARR; everything rolls up. Pros: Clean. Cons: Loses granularity for diverse products. Good for tightly integrated businesses but not yours.
- **Hybrid**: Force all products to have Lean Canvas/AAARR, with mandatory roll-ups. Pros: Consistency. Cons: Overhead for simple products.

### Recommended Next Steps
- **Prototype Data Model**: Sketch YAML structures for business + 2 products, focusing on references/aggregation.
- **UI Wireframes**: Design the navigation (business → products) and linking (e.g., arrows in AAARR visualization).
- **Schema Updates**: Extend the JSON schemas to support `products` arrays and `ref` fields.
- **Pilot with One Product**: Implement for one product (e.g., Blueprint SaaS) to test the hierarchy before expanding.