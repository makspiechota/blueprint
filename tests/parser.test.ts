import { parseNorthStar, parseArchitecturalScope } from '../src/parser';
import * as fs from 'fs';
import * as path from 'path';

const fixturesDir = path.join(__dirname, 'fixtures');

beforeAll(() => {
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
});

describe('parseNorthStar', () => {
  test('parses valid north star YAML file', () => {
    const validYaml = `type: north-star
version: "2.0"
last_updated: "2025-01-28"
title: "Test North Star"
vision: "Test vision"
problem: "Test problem"
solution: "Test solution"
strategic_goals:
  - title: "Goal 1"
    description: "Description 1"`;

    const filePath = path.join(fixturesDir, 'valid.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseNorthStar(filePath);

    expect(result).toEqual({
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-01-28',
      title: 'Test North Star',
      vision: 'Test vision',
      problem: 'Test problem',
      solution: 'Test solution',
      strategic_goals: [
        { title: 'Goal 1', description: 'Description 1' }
      ]
    });
  });

  test('throws error for missing required field', () => {
    const invalidYaml = `type: north-star
version: "2.0"
title: "Test"`;

    const filePath = path.join(fixturesDir, 'missing-field.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseNorthStar(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid type', () => {
    const invalidYaml = `type: wrong-type
version: "2.0"
last_updated: "2025-01-28"
title: "Test"
vision: "Test"
problem: "Test"
solution: "Test"
strategic_goals: []`;

    const filePath = path.join(fixturesDir, 'invalid-type.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseNorthStar(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid date format', () => {
    const invalidYaml = `type: north-star
version: "2.0"
last_updated: "invalid-date"
title: "Test"
vision: "Test"
problem: "Test"
solution: "Test"
strategic_goals: []`;

    const filePath = path.join(fixturesDir, 'invalid-date.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseNorthStar(filePath)).toThrow('Validation failed');
  });

  test('throws error for non-existent file', () => {
    expect(() => parseNorthStar('non-existent.yaml')).toThrow();
  });
});

describe('parseArchitecturalScope', () => {
  test('parses valid architectural scope with all lists', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test Scope"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "business solutions"
    beneficiary: "enterprise clients"
  goals:
    - title: "To achieve business excellence"
      description: "Why it matters"
what:
  - title: "Entity 1"
    description: "Description 1"
  - title: "Entity 2"
    description: "Description 2"
how:
  - title: "Process 1"
    description: "How it works"
where:
  - title: "Location 1"
    description: "Where it happens"
who:
  - title: "Team 1"
    description: "Who is involved"
when:
  - title: "Timing 1"
    description: "When it occurs"`;

    const filePath = path.join(fixturesDir, 'valid-arch-scope.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.type).toBe('architectural-scope');
    expect(result.title).toBe('Test Scope');
    expect(result.why).toBeDefined();
    expect(result.why.mission).toBeDefined();
    expect(result.why.goals).toHaveLength(1);
    expect(result.what).toHaveLength(2);
    expect(result.how).toHaveLength(1);
    expect(result.where).toHaveLength(1);
    expect(result.who).toHaveLength(1);
    expect(result.when).toHaveLength(1);
  });

  test('parses architectural scope with subset of lists', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Minimal Scope"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to deliver"
    service: "quality software"
    beneficiary: "end users"
what:
  - title: "Entity 1"
    description: "Description 1"
how:
  - title: "Process 1"
    description: "How it works"`;

    const filePath = path.join(fixturesDir, 'minimal-arch-scope.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.type).toBe('architectural-scope');
    expect(result.why).toBeDefined();
    expect(result.why.mission).toBeDefined();
    expect(result.what).toHaveLength(1);
    expect(result.how).toHaveLength(1);
    expect(result.where).toBeUndefined();
    expect(result.who).toBeUndefined();
    expect(result.when).toBeUndefined();
  });

  test('throws error for missing north_star_ref', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test"`;

    const filePath = path.join(fixturesDir, 'missing-north-star-ref.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid type', () => {
    const invalidYaml = `type: wrong-type
version: "1.0"
last_updated: "2025-12-18"
title: "Test"
north_star_ref: "test.yaml"`;

    const filePath = path.join(fixturesDir, 'invalid-arch-type.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid scope list structure', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test"
north_star_ref: "test.yaml"
what:
  - title: "Missing description"`;

    const filePath = path.join(fixturesDir, 'invalid-scope-item.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('throws error for non-existent file', () => {
    expect(() => parseArchitecturalScope('non-existent.yaml')).toThrow();
  });

  // Tests for new WHY structure (mission + goals)
  test('parses valid architectural scope with WHY mission and goals', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test Scope with WHY"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "intelligent course recommendations"
    beneficiary: "students and educators"
  goals:
    - title: "To increase student engagement"
      description: "Improve learning outcomes through personalized recommendations"
    - title: "To reduce course selection time"
      description: "Help students find relevant courses faster"
what:
  - title: "Entity 1"
    description: "Description 1"`;

    const filePath = path.join(fixturesDir, 'valid-why-structure.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.type).toBe('architectural-scope');
    expect(result.why).toBeDefined();
    expect(result.why.mission).toBeDefined();
    expect(result.why.mission.action).toBe('to provide');
    expect(result.why.mission.service).toBe('intelligent course recommendations');
    expect(result.why.mission.beneficiary).toBe('students and educators');
    expect(result.why.goals).toBeDefined();
    expect(result.why.goals).toHaveLength(2);
    expect(result.why.goals![0].title).toBe('To increase student engagement');
    expect(result.why.goals![1].title).toBe('To reduce course selection time');
  });

  test('parses architectural scope with WHY mission but no goals', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test Scope"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to enable"
    service: "seamless payments"
    beneficiary: "online shoppers"
what:
  - title: "Entity 1"
    description: "Description 1"`;

    const filePath = path.join(fixturesDir, 'why-mission-only.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.why).toBeDefined();
    expect(result.why.mission).toBeDefined();
    expect(result.why.mission.action).toBe('to enable');
    expect(result.why.goals).toBeUndefined();
  });

  test('throws error when WHY is missing', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test Without WHY"
north_star_ref: "test-north-star.yaml"
what:
  - title: "Entity 1"
    description: "Description 1"`;

    const filePath = path.join(fixturesDir, 'missing-why.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow('Validation failed');
  });

  test('throws error when mission is missing from WHY', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  goals:
    - title: "To improve something"
      description: "Some goal"`;

    const filePath = path.join(fixturesDir, 'why-missing-mission.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('throws error when mission action is missing', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    service: "some service"
    beneficiary: "customers"`;

    const filePath = path.join(fixturesDir, 'mission-missing-action.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('throws error when mission action does not start with "to "', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "provide service"
    service: "some service"
    beneficiary: "customers"`;

    const filePath = path.join(fixturesDir, 'mission-action-invalid-pattern.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('throws error when mission service is missing', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to provide"
    beneficiary: "customers"`;

    const filePath = path.join(fixturesDir, 'mission-missing-service.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('throws error when mission beneficiary is missing', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "some service"`;

    const filePath = path.join(fixturesDir, 'mission-missing-beneficiary.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('throws error when goal title does not start with "To"', () => {
    const invalidYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "some service"
    beneficiary: "customers"
  goals:
    - title: "Improve customer satisfaction"
      description: "Make customers happier"`;

    const filePath = path.join(fixturesDir, 'goal-invalid-pattern.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseArchitecturalScope(filePath)).toThrow();
  });

  test('accepts goal title starting with lowercase "to"', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "some service"
    beneficiary: "customers"
  goals:
    - title: "to improve customer satisfaction"
      description: "Make customers happier"`;

    const filePath = path.join(fixturesDir, 'goal-lowercase-to.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.why.goals).toBeDefined();
    expect(result.why.goals![0].title).toBe('to improve customer satisfaction');
  });
});
