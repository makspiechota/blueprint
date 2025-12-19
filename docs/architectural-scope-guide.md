# Architectural Scope Guide

## Overview

The Architectural Scope layer bridges the gap between strategic vision (North Star) and technical implementation by defining solution boundaries using six scope lists. This methodology follows Ronald Ross's business architecture approach and the Zachman Framework.

**Purpose**: Box the business solution space before diving into technical details.

**Methodology**: Ronald Ross / Zachman Framework six interrogatives (Why, What, How, Where, Who, When)

**WHY-First Approach**: Following Ronald Ross's business motivation framework, WHY (business motivation) comes first as the foundation that informs all other scope dimensions.

## File Structure

Architectural scope files use YAML format with `.yaml` extension.

### Required Fields

```yaml
type: architectural-scope
version: "1.0"
last_updated: YYYY-MM-DD
title: Product or Company Name
north_star_ref: path/to/north-star.yaml
```

- **type**: Must be `architectural-scope`
- **version**: DSL version (currently "1.0")
- **last_updated**: ISO date format (YYYY-MM-DD)
- **title**: Product or company name
- **north_star_ref**: Path to north star YAML file (validates file exists)

## Six Scope Lists

All six scope lists are **optional** but recommended. Lists are presented in WHY-first order following Ronald Ross's business motivation framework.

**Note**: WHY has a unique structure (mission + goals), while other lists follow the 7±2 cognitive principle:

- **Minimum**: 3 items
- **Maximum**: 12 items
- **Optimal**: 7 items

### Why - Business Motivation

**Scope Question**: Why does this capability exist? What motivates decisions?

**ALWAYS FIRST**: WHY informs all other scope dimensions. In Ronald Ross's methodology, business motivation is the foundation that drives what entities you need, how you operate, and where/who/when activities occur.

Defines the business mission (what this capability does) and capability-specific goals (ongoing objectives for this capability).

**Structure**: Unlike other scope lists, WHY has two components:
1. **Mission**: Three-part statement (action + service + beneficiary)
2. **Goals**: Array of capability-specific ongoing objectives (each starts with "To")

**Mission vs Goals**:
- **Mission**: Achieved **directly** through performing this capability
- **Goals**: Achieved **indirectly** by executing the mission well

**Capability-Specific vs Enterprise-Wide**:
- Goals here are specific to this ONE capability
- Enterprise-wide strategic goals belong in North Star layer

```yaml
why:
  mission:
    action: "to provide"
    service: "accessible online learning experiences"
    beneficiary: "students seeking flexible education"
  goals:
    - title: "To increase course completion rates"
      description: "Improve student success through personalized learning paths and timely support"
    - title: "To reduce enrollment barriers"
      description: "Simplify registration process and provide clear prerequisite guidance"
    - title: "To enhance learning outcomes"
      description: "Ensure students achieve measurable skill development aligned with career goals"
```

### What - Business Entities

**Scope Question**: What are the business data, information, or objects?

Defines the key business entities and information objects the solution manages.

```yaml
what:
  - title: Student Profile
    description: Comprehensive academic and demographic data for enrolled students
  - title: Course Catalog
    description: Available courses with prerequisites and learning outcomes
  - title: Enrollment Record
    description: Student course registrations and completion status
```

### How - Business Processes

**Scope Question**: How does the business work?

Describes the essential business processes and mechanisms.

```yaml
how:
  - title: Course Registration
    description: Students browse, select, and enroll in courses each term
  - title: Grade Management
    description: Instructors assess work and assign final grades
  - title: Degree Progress Tracking
    description: Monitor student advancement toward graduation requirements
```

### Where - Geographic Boundaries

**Scope Question**: Where are the business operations?

Identifies geographic locations and operational boundaries.

```yaml
where:
  - title: Main Campus
    description: Primary physical location for in-person instruction
  - title: Online Platform
    description: Digital learning environment accessible globally
  - title: Regional Centers
    description: Satellite locations in key metropolitan areas
```

### Who - Organizational Units

**Scope Question**: Who are the people and organizations involved?

Defines stakeholder groups and organizational units.

```yaml
who:
  - title: Students
    description: Primary users seeking education and credentials
  - title: Faculty
    description: Instructors delivering courses and assessing learning
  - title: Academic Advisors
    description: Staff guiding students through program requirements
```

### When - Timing Constraints

**Scope Question**: When are business processes performed?

Captures critical timing constraints and business cycles.

```yaml
when:
  - title: Registration Period
    description: Two-week window before each term starts
  - title: Grading Deadline
    description: 72 hours after final exam completion
  - title: Graduation Review
    description: Quarterly degree audit for eligible students
```

## Validation Rules

### North Star Reference

The `north_star_ref` field must:
- Point to an existing north star YAML file
- Use relative path from architectural scope file
- Be validated during parsing

### Scope List Item Counts

Each scope list (What, How, Where, Who, When) must contain:
- **Minimum**: 3 items
- **Maximum**: 12 items
- **Optimal**: 7 items

Validators should warn when lists fall outside optimal range (5-9 items).

**Note**: WHY has unique validation (see below).

### WHY Validation

WHY has a different structure and validation rules:

**Mission** (required if WHY present):
- Must have `action`, `service`, `beneficiary` fields
- `action` must start with "to " (lowercase)
- All fields are required strings

**Goals** (optional array):
- Each goal must have `title` and `description`
- `title` should start with "To " (capital T) for consistency
- Goals should be capability-specific (not enterprise-wide)
- Goals should be ongoing objectives (not project objectives like "implement" or "migrate")

**Soft Warnings**:
- Validator warns if goal title doesn't start with "To "
- Validator warns if goal contains project-oriented words (implement, migrate, deploy, etc.)
- Validator warns if goal sounds enterprise-wide instead of capability-specific

### Item Structure

Each scope list item (What, How, Where, Who, When) requires:
- **title**: Short, descriptive name (string)
- **description**: Clear explanation of scope element (string)

## Complete Example

```yaml
type: architectural-scope
version: "1.0"
last_updated: 2025-12-19
title: CourseIQ Learning Platform
north_star_ref: ../north-star.yaml

why:
  mission:
    action: "to provide"
    service: "accessible online learning experiences"
    beneficiary: "students seeking flexible education"
  goals:
    - title: "To increase course completion rates"
      description: "Improve student success through personalized learning paths and timely support"
    - title: "To reduce enrollment barriers"
      description: "Simplify registration process and provide clear prerequisite guidance"
    - title: "To enhance learning outcomes"
      description: "Ensure students achieve measurable skill development aligned with career goals"
    - title: "To improve instructor effectiveness"
      description: "Provide data-driven insights about student engagement and comprehension"
    - title: "To enable scalable education delivery"
      description: "Support growing student populations without compromising quality"

what:
  - title: Student Profile
    description: Comprehensive academic and demographic data for enrolled students
  - title: Course Catalog
    description: Available courses with prerequisites and learning outcomes
  - title: Enrollment Record
    description: Student course registrations and completion status
  - title: Learning Materials
    description: Digital content including videos, readings, and assessments
  - title: Grade Book
    description: Assignment scores and final course grades
  - title: Degree Requirements
    description: Program completion criteria and graduation rules
  - title: Transcript
    description: Official academic record of completed coursework

how:
  - title: Course Registration
    description: Students browse, select, and enroll in courses each term
  - title: Content Delivery
    description: Instructors publish materials for student access
  - title: Assignment Submission
    description: Students complete and submit work for evaluation
  - title: Grade Management
    description: Instructors assess work and assign final grades
  - title: Degree Progress Tracking
    description: Monitor student advancement toward graduation requirements
  - title: Communication
    description: Discussion forums and messaging between students and faculty
  - title: Payment Processing
    description: Tuition collection and financial aid disbursement

where:
  - title: Main Campus
    description: Primary physical location for in-person instruction
  - title: Online Platform
    description: Digital learning environment accessible globally
  - title: Regional Centers
    description: Satellite locations in key metropolitan areas
  - title: Mobile Apps
    description: iOS and Android applications for on-the-go learning

who:
  - title: Students
    description: Primary users seeking education and credentials
  - title: Faculty
    description: Instructors delivering courses and assessing learning
  - title: Academic Advisors
    description: Staff guiding students through program requirements
  - title: Administrators
    description: Staff managing operations and compliance
  - title: IT Support
    description: Technical team maintaining platform infrastructure

when:
  - title: Registration Period
    description: Two-week window before each term starts
  - title: Term Duration
    description: 10-week academic quarters throughout the year
  - title: Grading Deadline
    description: 72 hours after final exam completion
  - title: Graduation Review
    description: Quarterly degree audit for eligible students
  - title: Financial Aid Disbursement
    description: Funds released one week before term begins
```

## Relationship to North Star

The architectural scope **requires** and **extends** the north star layer:

- **Requires**: Must reference an existing north star file via `north_star_ref`
- **Extends**: Translates strategic vision into concrete solution boundaries
- **WHY Alignment**: Architectural scope WHY defines capability-specific mission and goals, while North Star defines enterprise-wide strategic goals

**Key Distinction**:
- **North Star strategic goals** = Enterprise-wide objectives (e.g., "Become market leader in online education")
- **Architectural Scope WHY goals** = Capability-specific objectives (e.g., "To increase course completion rates for this learning platform")

The north star defines *what effect* the business aims to achieve enterprise-wide. The architectural scope defines *what this specific capability does* and *what goals it pursues* to contribute to that enterprise effect.

## Technical Details

- **Schema**: See `schemas/architectural-scope.schema.json` for JSON Schema validation rules
- **Schema Registry**: See `schemas/schema.json` for layer registration
- **Methodology Sources**:
  - Ronald Ross, "The Business Rule Approach" (BRCommunity)
  - Zachman Framework for Enterprise Architecture
  - George Miller, "The Magical Number Seven, Plus or Minus Two" (cognitive limits)

## Error Messages

**Missing North Star Reference**
```
Error: north_star_ref is required for architectural scope
```

**Invalid North Star Path**
```
Error: North star file not found: path/to/north-star.yaml
```

**Scope List Too Small**
```
Warning: 'what' list has 2 items (minimum 3 recommended)
```

**Scope List Too Large**
```
Warning: 'who' list has 15 items (maximum 12 recommended, optimal 7)
```

**Missing Required Item Fields**
```
Error: Scope list item missing required field 'description' in what[2]
```

**WHY Mission Missing Action**
```
Error: WHY mission requires 'action' field starting with 'to '
```

**WHY Goal Missing "To" Prefix**
```
Warning: WHY goal "Reduce cart abandonment" should start with "To"
```

**WHY Goal Appears Project-Oriented**
```
Warning: WHY goal "Implement faster checkout" appears to be a project objective, not an ongoing goal
```

**WHY Goal Appears Enterprise-Wide**
```
Warning: WHY goal "Become market leader" sounds enterprise-wide, consider moving to North Star strategic goals
```
