# Spec Generator

Use this prompt to generate executable specifications from business requirements.

---

## Prompt

```markdown
SPEC GENERATOR
--------------
Business requirement: [REQUIREMENT]
Domain context: [CONTEXT]

Generate:

1. **User story** in standard format:
   As a [user type]
   I want [capability]
   So that [benefit]

2. **3-5 acceptance criteria** (GIVEN-WHEN-THEN format):
   Cover the happy path, common error cases, and edge cases.

3. **Edge cases to consider**:
   List potential edge cases that might need additional scenarios.

4. **Suggested test scenarios**:
   For each acceptance criterion, suggest how it would be tested.
```

---

## Example Usage

**Input:**
```
Business requirement: Users should be able to add items to their shopping cart

Domain context: E-commerce platform selling physical products. Users can be
guests or registered. Products have inventory limits.
```

**Expected Output:**
```
1. User Story:
   As a shopper
   I want to add items to my shopping cart
   So that I can purchase multiple products in a single transaction

2. Acceptance Criteria:

   Scenario: Add item to empty cart
   GIVEN I am viewing a product with available inventory
   AND my cart is empty
   WHEN I click "Add to Cart"
   THEN the item appears in my cart with quantity 1
   AND the cart icon shows "1" item
   AND I see a confirmation message "Added to cart"

   Scenario: Add item already in cart
   GIVEN I have product X in my cart with quantity 1
   WHEN I add product X again
   THEN my cart shows product X with quantity 2
   AND the cart total updates accordingly

   Scenario: Add item exceeding inventory
   GIVEN a product has 3 units in stock
   AND I have 3 units in my cart
   WHEN I try to add another unit
   THEN I see error "Maximum quantity available: 3"
   AND the cart quantity remains at 3

   Scenario: Add item as guest user
   GIVEN I am not logged in
   WHEN I add an item to cart
   THEN the item is added to a guest cart
   AND the cart persists via local storage

3. Edge Cases:
   - Product goes out of stock while in cart
   - Price changes while item is in cart
   - Adding zero or negative quantities
   - Cart item limit (max items per cart)

4. Test Scenarios:
   - Integration test: API returns 201 on valid add
   - Unit test: Cart total calculation
   - E2E test: Click flow from product page to cart
```
