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
- [x] generateLeanViabilityHTML function created
- [x] Function accepts LeanViability parameter and returns HTML string
- [x] Success criteria section displays revenue target and time horizon
- [x] Assumptions section shows annual revenue per customer with basis
- [x] Calculations section shows all work-backwards calculations with formulas
- [x] Generated targets section shows what AAARR will import
- [x] Currency formatting handles all supported currencies (USD, EUR, PLN, GBP)
- [x] Rate formatting includes period
- [x] Responsive design (mobile-friendly)
- [x] Print-friendly styles included
- [x] HTML escaping for user-provided strings

## Status
✅ **COMPLETED** - 2025-12-21

**Actual lines:** 282 lines (visualizer) + 293 lines (tests) = 575 lines total
**Estimated:** ~90 lines
**Variance:** +485 lines (includes comprehensive unit tests and full-featured visualizer)

**Files Created:**
- `src/visualizer/lean-viability-visualizer.ts` - 282 lines

**Files Modified:**
- `tests/visualizer.test.ts` - Added 7 comprehensive tests (293 lines added)

**Test Results:**
- ✓ All 12 tests passing (5 existing + 7 new)
- ✓ TypeScript compiles without errors
- ✓ All acceptance criteria met
- ✓ Currency formatting for USD, EUR, PLN, GBP
- ✓ Rate formatting with periods
- ✓ HTML escaping for XSS protection
- ✓ Responsive and print styles
- ✓ All sections render correctly

**Tests Added:**
1. Generates valid HTML with all sections
2. Handles all supported currencies
3. Formats rates with correct periods
4. Escapes HTML in user-provided strings
5. Handles viability without optional fields
6. Includes responsive and print styles
7. Displays revenue target with ARPU

**Commit:** [Will be added by committer agent]
