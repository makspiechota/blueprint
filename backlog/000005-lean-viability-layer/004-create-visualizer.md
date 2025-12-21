# Task: Create Lean Viability Visualizer

## User Story Reference
- As a product manager, I want to see calculated AAARR targets derived from viability so that I know what metrics to optimize
- As a business analyst, I want to see transparent calculation formulas so that I can understand how targets were derived

## Description
Create a new visualizer module that generates an HTML dashboard showing viability calculations, formulas, and generated targets in a clear, readable format.

## Files to Modify/Create
- `src/visualizer/lean-viability-visualizer.ts` - Create new visualizer

## Estimated Lines of Code
~90 lines

## Dependencies
- Task 002: Types must be generated
- Task 003: Validator must be available

## Implementation Notes

### Follow Existing Pattern
Use `lean-canvas-visualizer.ts` as a template:
- Export function: `generateLeanViabilityHTML(viability: LeanViability): string`
- Return complete HTML document with embedded CSS
- Use similar styling (white boxes on gray background)
- Include responsive design and print styles

### Layout Design
Dashboard with sections:
1. **Header**: Title, version, last updated
2. **Success Criteria**: Target revenue, time horizon, target year
3. **Assumptions**: Annual revenue per customer with basis explanation
4. **Calculations**: Work-backwards calculations with formulas
   - Required customers (with formula)
   - Customer acquisition rate (with formula)
   - Monthly acquisition target (with formula)
5. **Generated Targets**: What will be imported by AAARR layer
   - Acquisition targets
   - Revenue targets (ARPU)
   - Other stage targets if defined

### Styling
```css
.dashboard { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.section { background: white; padding: 1.5rem; border-radius: 8px; }
.full-width { grid-column: 1 / -1; }
.metric { margin-bottom: 1rem; }
.metric-label { font-size: 0.85rem; color: #666; text-transform: uppercase; }
.metric-value { font-size: 1.5rem; font-weight: bold; color: #333; }
.formula { font-family: monospace; background: #f5f5f5; padding: 0.5rem; border-radius: 4px; font-size: 0.9rem; }
```

### Helper Functions
```typescript
function formatCurrency(amount: CurrencyAmount): string {
  const symbols = { USD: '$', EUR: '€', PLN: 'zł', GBP: '£' };
  return `${symbols[amount.currency]}${amount.amount.toLocaleString()}`;
}

function formatRate(rate: RatePeriod): string {
  return `${rate.rate.toLocaleString()}/${rate.period}`;
}

function formatTimeHorizon(horizon: TimeHorizon): string {
  return `${horizon.duration} ${horizon.unit}`;
}
```

### Calculation Display
Show each calculation with its formula:
```html
<div class="calculation">
  <div class="calc-name">Required Customers</div>
  <div class="calc-value">8,334</div>
  <div class="formula">$10,000,000 / $1,200 per customer</div>
  <div class="calc-formula-ref">Formula: success_revenue / annual_revenue_per_customer</div>
</div>
```

## Acceptance Criteria
- [ ] generateLeanViabilityHTML function created
- [ ] Function accepts LeanViability parameter and returns HTML string
- [ ] Success criteria section displays revenue target and time horizon
- [ ] Assumptions section shows annual revenue per customer with basis
- [ ] Calculations section shows all work-backwards calculations with formulas
- [ ] Generated targets section shows what AAARR will import
- [ ] Currency formatting handles all supported currencies (USD, EUR, PLN, GBP)
- [ ] Rate formatting includes period
- [ ] Responsive design (mobile-friendly)
- [ ] Print-friendly styles included
- [ ] HTML escaping for user-provided strings
