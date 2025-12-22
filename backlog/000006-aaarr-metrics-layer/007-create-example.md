# Task: Create Example AAARR Metrics File

## User Story Reference
- As a product manager, I want to see a working example of AAARR metrics so that I can model my own customer factory
- As a developer, I want a reference implementation to validate the schema and visualizer

## Description
Create `examples/aaarr-metrics.yaml` with realistic metrics for BLUEPRINT product, including all 5 stages with multiple metrics per stage, demonstrating target imports from lean-viability layer.

## Files to Modify/Create
- `examples/aaarr-metrics.yaml` - Create new example file

## Estimated Lines of Code
~120 lines

## Dependencies
- Task 001: Schema must exist
- Task 006: CLI must support visualization

## Implementation Notes

### Create Example File

Create `examples/aaarr-metrics.yaml`:

```yaml
type: aaarr-metrics
version: "1.0"
last_updated: "2024-01-15"
title: "BLUEPRINT AAARR Metrics"
lean_viability_ref: "lean-viability.yaml"
north_star_ref: "north-star.yaml"

stages:
  acquisition:
    stage_goal: "Get developers to discover BLUEPRINT"
    metrics:
      - id: aaarr.acquisition.signup-rate
        name: "Developer Signups"
        description: "Developers creating BLUEPRINT accounts"
        target:
          rate: 231
          period: month
          imported_from: lean-viability.targets.monthly_acquisition
        current:
          rate: 150
          period: month

      - id: aaarr.acquisition.organic-traffic
        name: "Organic Website Visitors"
        description: "Visitors from search and direct traffic"
        target:
          rate: 11550
          period: month
          imported_from: lean-viability.calculations.monthly_visitors
        current:
          rate: 8000
          period: month

      - id: aaarr.acquisition.conversion-rate
        name: "Visitor-to-Signup Conversion"
        description: "Percentage of visitors who sign up"
        target:
          percentage: 2.0
          imported_from: lean-viability.calculations.conversion_rate
        current:
          percentage: 1.875

  activation:
    stage_goal: "Get developers to complete first blueprint"
    metrics:
      - id: aaarr.activation.first-blueprint
        name: "First Blueprint Completion"
        description: "Users who create their first blueprint within 7 days"
        target:
          percentage: 60
        current:
          percentage: 45

      - id: aaarr.activation.time-to-first-value
        name: "Time to First Value"
        description: "Average hours until first blueprint created"
        target:
          rate: 2
          period: hours
        current:
          rate: 3.5
          period: hours

  retention:
    stage_goal: "Keep developers actively using BLUEPRINT"
    metrics:
      - id: aaarr.retention.monthly-active-users
        name: "Monthly Active Users"
        description: "Users who create or update blueprints monthly"
        target:
          rate: 8334
          period: month
          imported_from: lean-viability.calculations.required_customers
        current:
          rate: 5000
          period: month

      - id: aaarr.retention.churn-rate
        name: "Monthly Churn Rate"
        description: "Percentage of users who stop using BLUEPRINT"
        target:
          percentage: 8.33
          imported_from: lean-viability.calculations.churn_rate
        current:
          percentage: 12.5

      - id: aaarr.retention.weekly-engagement
        name: "Weekly Engagement Rate"
        description: "Percentage of MAU who use BLUEPRINT weekly"
        target:
          percentage: 40
        current:
          percentage: 28

  referral:
    stage_goal: "Turn users into advocates"
    metrics:
      - id: aaarr.referral.nps-score
        name: "Net Promoter Score"
        description: "Likelihood to recommend (scale -100 to +100)"
        target:
          rate: 50
          period: score
        current:
          rate: 35
          period: score

      - id: aaarr.referral.viral-coefficient
        name: "Viral Coefficient"
        description: "Average new users referred per existing user"
        target:
          rate: 0.5
          period: user
        current:
          rate: 0.3
          period: user

  revenue:
    stage_goal: "Convert users to paying customers"
    metrics:
      - id: aaarr.revenue.arr
        name: "Annual Recurring Revenue"
        description: "Total annual revenue from subscriptions"
        target:
          amount: 10000000
          currency: USD
          imported_from: lean-viability.success_criteria.annual_revenue
        current:
          amount: 6000000
          currency: USD

      - id: aaarr.revenue.arpu
        name: "Average Revenue Per User"
        description: "Monthly revenue per active user"
        target:
          amount: 100
          currency: USD
          imported_from: lean-viability.calculations.annual_revenue_per_customer
        current:
          amount: 100
          currency: USD

      - id: aaarr.revenue.conversion-to-paid
        name: "Free-to-Paid Conversion"
        description: "Percentage of free users converting to paid"
        target:
          percentage: 5.0
        current:
          percentage: 3.2
```

### Testing

After creating the file:
```bash
# Validate the example
blueprint validate examples/aaarr-metrics.yaml

# Generate visualization
blueprint visualize examples/aaarr-metrics.yaml

# Open the dashboard
open aaarr-dashboard.html
```

### Expected Output

The visualization should show:
- All 5 stages as connected pipeline
- Acquisition stage: RED (gaps in signup-rate and organic-traffic)
- Activation stage: RED (gaps in completion and time-to-value)
- Retention stage: RED (gaps in MAU, churn, engagement)
- Referral stage: RED (gaps in NPS and viral coefficient)
- Revenue stage: RED (gap in ARR, but ARPU on target)
- Clear visual indication of biggest bottlenecks

## Acceptance Criteria
- [ ] examples/aaarr-metrics.yaml file created
- [ ] All 5 AAARR stages included
- [ ] Each stage has 2-3 metrics with semantic IDs
- [ ] Metrics include name and description
- [ ] Targets import from lean-viability where applicable
- [ ] Current values provided for all metrics
- [ ] Mix of rate, amount, and percentage types
- [ ] File validates successfully
- [ ] Visualization generates successfully
- [ ] Dashboard displays all stages and metrics
- [ ] Gap visualization shows bottlenecks clearly
- [ ] Example is realistic for BLUEPRINT product
