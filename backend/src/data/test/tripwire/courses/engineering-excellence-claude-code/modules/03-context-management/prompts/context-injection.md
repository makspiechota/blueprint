# Context Injection Prompt

## When to Use

Use this prompt structure when CLAUDE.md isn't enough and you need to provide additional context for a specific task.

## The Prompt

```
## Context for This Task

### Relevant Architecture
[Paste the specific architectural context needed]

### Domain Knowledge
[Paste relevant domain concepts and rules]

### Existing Patterns to Follow
[Paste code examples showing the pattern to use]

### Files You'll Work With
[List files and their purposes]

---

## Task
[Your actual request]

## Tests to Pass
[If applicable]
```

## Example: Adding a New Feature

```
## Context for This Task

### Relevant Architecture
This feature lives in the Order domain. Structure:
- /src/domain/order - Entities and business rules
- /src/application/order - Use cases
- /src/infrastructure/order - Repository and external services

### Domain Knowledge
- Orders have states: draft → pending → confirmed → shipped → delivered
- Only pending orders can be cancelled
- Cancellation triggers refund process (separate bounded context)
- Orders belong to Customers, not Users (Customer is the domain concept)

### Existing Patterns to Follow
```typescript
// Use case pattern from ConfirmOrderUseCase
export class ConfirmOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private paymentService: PaymentService,
  ) {}

  async execute(orderId: string): Promise<Result<Order, OrderError>> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return err(new OrderNotFoundError(orderId));

    const confirmed = order.confirm();
    if (confirmed.isErr()) return confirmed;

    await this.orderRepository.save(confirmed.value);
    return ok(confirmed.value);
  }
}
```

### Files You'll Work With
- /src/domain/order/order.ts - Order entity (modify)
- /src/application/order/cancel-order-use-case.ts - New file
- /src/application/order/index.ts - Export new use case

---

## Task
Implement CancelOrderUseCase following the pattern above.

## Tests to Pass
[paste tests]
```

## Why Structured Context Works

1. **Reduces ambiguity** - Claude Code knows exactly what architecture to follow
2. **Provides examples** - Pattern matching is more reliable than description
3. **Scopes the work** - Lists specific files to work with
4. **Maintains consistency** - Generated code matches existing code
