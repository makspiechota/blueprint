import { parseNorthStar, parseArchitecturalScope, parseOrchestratedBusiness, buildTraceabilityGraph } from '../src/parser';
import { OrchestratedBusiness, TraceabilityGraph } from '../src/parser/types';
import { getNodeById, traverseDownward, findPaths, getGraphStats } from '../src/utils/traceability';
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

describe('parseOrchestratedBusiness - Complete Business Example', () => {
  test('parses complete business example with all layers', () => {
    const businessPath = path.join(__dirname, '..', 'examples', 'business-complete.yaml');

    // This test will fail until we create the complete business example
    expect(() => {
      const result = parseOrchestratedBusiness(businessPath);
      // Verify all layers are loaded
      expect(result.business).toBeDefined();
      expect(result.northStar).toBeDefined();
      expect(result.leanCanvas).toBeDefined();
      expect(result.architecturalScope).toBeDefined();
      expect(result.leanViability).toBeDefined();
      expect(result.aaarr).toBeDefined();
      expect(result.policyCharter).toBeDefined();
    }).not.toThrow();
  });

  test('builds traceability graph for complete business example', () => {
    const businessPath = path.join(__dirname, '..', 'examples', 'business-complete.yaml');

    expect(() => {
      const orchestrated = parseOrchestratedBusiness(businessPath);
      const graph = buildTraceabilityGraph(orchestrated);

      // Verify graph has nodes and edges
      expect(graph.nodes.length).toBeGreaterThan(0);
      expect(graph.edges.length).toBeGreaterThan(0);

      // Verify business node exists
      const businessNode = getNodeById(graph, 'business');
      expect(businessNode).toBeDefined();
      expect(businessNode?.type).toBe('business');
    }).not.toThrow();
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

  test('accepts mission action starting with capital "To"', () => {
    const validYaml = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-19"
title: "Test"
north_star_ref: "test-north-star.yaml"
why:
  mission:
    action: "To provide"
    service: "some service"
    beneficiary: "customers"`;

    const filePath = path.join(fixturesDir, 'mission-action-capital-to.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parseArchitecturalScope(filePath);

    expect(result.why.mission.action).toBe('To provide');
  });
});

describe('parsePolicyCharter', () => {
  test('parses valid policy charter YAML file', () => {
    const { parsePolicyCharter } = require('../src/parser');

    const validYaml = `type: policy-charter
version: "1.0"
last_updated: "2025-12-25"
title: "Test Policy Charter"
architectural_scope_ref: "valid-arch-scope.yaml"
aaarr_metrics_ref: "valid-aaarr-metrics.yaml"
goals:
  - id: pc.goal.test-goal
    title: "Test Goal"
    description: "A test operational goal"
    addresses:
      - arch.goal.test
    aaarr_impact:
      - acquisition
    tactics:
      - pc.tactic.test-tactic
    policies:
      - pc.policy.test-policy
    kpis:
      - pc.kpi.test-kpi
    risks:
      - pc.risk.test-risk
tactics:
  - id: pc.tactic.test-tactic
    title: "Test Tactic"
    description: "A test tactic"
    drives_policies:
      - pc.policy.test-policy
policies:
  - id: pc.policy.test-policy
    title: "Test Policy"
    rule: "Test rule"
    driven_by_tactic: pc.tactic.test-tactic
    enforcement: mandatory
    brackets:
      - condition: "Test condition"
        rule: "Test bracket rule"
risks:
  - id: pc.risk.test-risk
    description: "Test risk"
    probability: medium
    impact: high
    mitigation:
      - pc.tactic.test-tactic
kpis:
  - id: pc.kpi.test-kpi
    name: "Test KPI"
    target:
      rate: 100
    current:
      rate: 80
    measurement_frequency: monthly
    justification: aaarr.acquisition.test-metric`;

    const filePath = path.join(fixturesDir, 'valid-policy-charter.yaml');
    fs.writeFileSync(filePath, validYaml);

    const result = parsePolicyCharter(filePath);

    expect(result.type).toBe('policy-charter');
    expect(result.title).toBe('Test Policy Charter');
    expect(result.goals).toHaveLength(1);
    expect(result.tactics).toHaveLength(1);
    expect(result.policies).toHaveLength(1);
    expect(result.risks).toHaveLength(1);
    expect(result.kpis).toHaveLength(1);
  });

  test('throws error for missing required field', () => {
    const { parsePolicyCharter } = require('../src/parser');

    const invalidYaml = `type: policy-charter
version: "1.0"
last_updated: "2025-12-25"
title: "Test Policy Charter"
architectural_scope_ref: "valid-arch-scope.yaml"
aaarr_metrics_ref: "valid-aaarr-metrics.yaml"`;

    const filePath = path.join(fixturesDir, 'missing-goals.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parsePolicyCharter(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid goal ID pattern', () => {
    const { parsePolicyCharter } = require('../src/parser');

    const invalidYaml = `type: policy-charter
version: "1.0"
last_updated: "2025-12-25"
title: "Test Policy Charter"
architectural_scope_ref: "valid-arch-scope.yaml"
aaarr_metrics_ref: "valid-aaarr-metrics.yaml"
goals:
  - id: invalid-goal-id
    title: "Test Goal"
    description: "Test"
    addresses: []
    aaarr_impact: []
    tactics: []
    policies: []
    kpis: []
    risks: []
tactics: []
policies: []
risks: []
kpis: []`;

    const filePath = path.join(fixturesDir, 'invalid-goal-id.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parsePolicyCharter(filePath)).toThrow('Validation failed');
  });

  test('throws error for non-existent file', () => {
    const { parsePolicyCharter } = require('../src/parser');

    expect(() => parsePolicyCharter('non-existent.yaml')).toThrow();
  });

  test('parses example policy charter file', () => {
    const { parsePolicyCharter } = require('../src/parser');

    const result = parsePolicyCharter('examples/policy-charter.yaml');

    expect(result.type).toBe('policy-charter');
    expect(result.title).toBe('Software Factory Policy Charter');
    expect(result.goals).toHaveLength(3);
    expect(result.tactics).toHaveLength(7);
    expect(result.policies).toHaveLength(11);
    expect(result.risks).toHaveLength(4);
    expect(result.kpis).toHaveLength(8);

    // Verify specific relationships
    const tddTactic = result.tactics.find((t: any) => t.id === 'pc.tactic.tdd-mandate');
    expect(tddTactic.drives_policies).toContain('pc.policy.tdd-required');

    const tddPolicy = result.policies.find((p: any) => p.id === 'pc.policy.tdd-required');
    expect(tddPolicy.driven_by_tactic).toBe('pc.tactic.tdd-mandate');
    expect(tddPolicy.enforcement).toBe('mandatory');
    expect(tddPolicy.brackets).toHaveLength(3);
  });
});

describe('parseBusiness', () => {
  test('parses valid v1.0 business YAML file', () => {
    const { parseBusiness } = require('../src/parser');

    const validV1Yaml = `type: business
version: "1.0"
last_updated: "2025-12-20"
title: "Test Business"
north_star_ref: "sample-north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "sample-architectural-scope.yaml"`;

    const filePath = path.join(fixturesDir, 'valid-business-v1.yaml');
    fs.writeFileSync(filePath, validV1Yaml);

    const result = parseBusiness(filePath);

    expect(result.type).toBe('business');
    expect(result.version).toBe('1.0');
    expect(result.title).toBe('Test Business');
    expect(result.north_star_ref).toBe('sample-north-star.yaml');
    expect(result.lean_canvas_ref).toBe('lean-canvas.yaml');
    expect(result.architectural_scope_ref).toBe('sample-architectural-scope.yaml');
  });

  test('parses valid v2.0 business YAML file with new fields (GREEN phase)', () => {
    const { parseBusiness } = require('../src/parser');

    const v2Yaml = `type: business
version: "2.0"
last_updated: "2025-12-25"
title: "Test Business v2.0"
north_star_ref: "sample-north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "sample-architectural-scope.yaml"
lean_viability_ref: "lean-viability.yaml"
aaarr_ref: "aaarr-metrics.yaml"
policy_charter_ref: "policy-charter.yaml"
backlog_ref: "backlog.yaml"`;

    const filePath = path.join(fixturesDir, 'business-v2.yaml');
    fs.writeFileSync(filePath, v2Yaml);

    const result = parseBusiness(filePath);

    expect(result.type).toBe('business');
    expect(result.version).toBe('2.0');
    expect(result.title).toBe('Test Business v2.0');
    expect(result.north_star_ref).toBe('sample-north-star.yaml');
    expect(result.lean_canvas_ref).toBe('lean-canvas.yaml');
    expect(result.architectural_scope_ref).toBe('sample-architectural-scope.yaml');
    expect(result.lean_viability_ref).toBe('lean-viability.yaml');
    expect(result.aaarr_ref).toBe('aaarr-metrics.yaml');
    expect(result.policy_charter_ref).toBe('policy-charter.yaml');
    expect(result.backlog_ref).toBe('backlog.yaml');
  });

  test('parses current example business file (v2.0)', () => {
    const { parseBusiness } = require('../src/parser');

    const result = parseBusiness('examples/business.yaml');

    expect(result.type).toBe('business');
    expect(result.version).toBe('2.0');
    expect(result.title).toBe('BLUEPRINT');
    expect(result.north_star_ref).toBe('sample-north-star.yaml');
    expect(result.lean_canvas_ref).toBe('lean-canvas.yaml');
    expect(result.architectural_scope_ref).toBe('sample-architectural-scope.yaml');
    expect(result.lean_viability_ref).toBe('lean-viability.yaml');
    expect(result.aaarr_ref).toBe('aaarr-metrics.yaml');
    expect(result.policy_charter_ref).toBe('policy-charter.yaml');
  });

  test('throws error for missing required field', () => {
    const { parseBusiness } = require('../src/parser');

    const invalidYaml = `type: business
version: "1.0"
last_updated: "2025-12-20"
# missing title
north_star_ref: "sample-north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "sample-architectural-scope.yaml"`;

    const filePath = path.join(fixturesDir, 'invalid-business-missing-required.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseBusiness(filePath)).toThrow('Validation failed');
  });

  test('throws error for invalid type', () => {
    const { parseBusiness } = require('../src/parser');

    const invalidYaml = `type: wrong-type
version: "1.0"
last_updated: "2025-12-20"
title: "Test Business"
north_star_ref: "sample-north-star.yaml"
lean_canvas_ref: "lean-canvas.yaml"
architectural_scope_ref: "sample-architectural-scope.yaml"`;

    const filePath = path.join(fixturesDir, 'invalid-business-type.yaml');
    fs.writeFileSync(filePath, invalidYaml);

    expect(() => parseBusiness(filePath)).toThrow('Validation failed');
  });

  test('throws error for non-existent file', () => {
    const { parseBusiness } = require('../src/parser');

    expect(() => parseBusiness('non-existent.yaml')).toThrow();
  });
});

describe('parseOrchestratedBusiness', () => {
  test('loads all referenced layers from examples/business.yaml', () => {
    const result = parseOrchestratedBusiness('examples/business.yaml');

    expect(result.business.type).toBe('business');
    expect(result.business.version).toBe('2.0');
    expect(result.business.title).toBe('BLUEPRINT');

    // Check that all layers are loaded
    expect(result.northStar).toBeDefined();
    expect(result.northStar?.type).toBe('north-star');
    expect(result.northStar?.title).toBe('Software Factory');

    expect(result.leanCanvas).toBeDefined();
    expect(result.leanCanvas?.type).toBe('lean-canvas');
    expect(result.leanCanvas?.title).toBe('BLUEPRINT');

    expect(result.architecturalScope).toBeDefined();
    expect(result.architecturalScope?.type).toBe('architectural-scope');
    expect(result.architecturalScope?.title).toBe('Software Factory');

    expect(result.leanViability).toBeDefined();
    expect(result.leanViability?.type).toBe('lean-viability');
    expect(result.leanViability?.title).toBe('BLUEPRINT Viability Model');

    expect(result.aaarr).toBeDefined();
    expect(result.aaarr?.type).toBe('aaarr-metrics');
    expect(result.aaarr?.title).toBe('BLUEPRINT AAARR Metrics');

    expect(result.policyCharter).toBeDefined();
    expect(result.policyCharter?.type).toBe('policy-charter');
    expect(result.policyCharter?.title).toBe('Software Factory Policy Charter');
  });

  test('handles missing optional layers gracefully', () => {
    // Create a minimal business file with only some references
    const minimalBusinessYaml = [
      'type: business',
      'version: "2.0"',
      'last_updated: "2025-12-25"',
      'title: "Minimal Business"',
      'north_star_ref: "../../examples/sample-north-star.yaml"',
      'lean_canvas_ref: "non-existent.yaml"'
    ].join('\n');

    const filePath = path.join(fixturesDir, 'minimal-orchestrated-business.yaml');
    fs.writeFileSync(filePath, minimalBusinessYaml);

    const result = parseOrchestratedBusiness(filePath);

    expect(result.business.type).toBe('business');
    expect(result.northStar).toBeDefined();
    expect(result.northStar?.title).toBe('Software Factory');

    // Missing layers should be undefined
    expect(result.leanCanvas).toBeUndefined();
    expect(result.architecturalScope).toBeUndefined();
    expect(result.leanViability).toBeUndefined();
    expect(result.aaarr).toBeUndefined();
    expect(result.policyCharter).toBeUndefined();
  });

  test('validates each layer individually during loading', () => {
    // Create a business file that references an invalid layer
    const invalidBusinessYaml = `type: business
version: "2.0"
last_updated: "2025-12-25"
title: "Invalid Layer Business"
north_star_ref: "invalid-north-star.yaml"`;

    const filePath = path.join(fixturesDir, 'invalid-orchestrated-business.yaml');
    fs.writeFileSync(filePath, invalidBusinessYaml);

    // Create an invalid north star file
    const invalidNorthStarYaml = `type: north-star
version: "2.0"
title: "Invalid North Star"
# missing required last_updated and other fields`;

    const invalidNorthStarPath = path.join(fixturesDir, 'invalid-north-star.yaml');
    fs.writeFileSync(invalidNorthStarPath, invalidNorthStarYaml);

    expect(() => parseOrchestratedBusiness(filePath)).toThrow('Validation failed');
  });

  test('returns typed OrchestratedBusiness with all parsed data', () => {
    const result = parseOrchestratedBusiness('examples/business.yaml');

    // Type check - result should have correct structure
    expect(result).toHaveProperty('business');
    expect(result).toHaveProperty('northStar');
    expect(result).toHaveProperty('leanCanvas');
    expect(result).toHaveProperty('architecturalScope');
    expect(result).toHaveProperty('leanViability');
    expect(result).toHaveProperty('aaarr');
    expect(result).toHaveProperty('policyCharter');

    // Business should be fully typed
    expect(result.business.type).toBe('business');
    expect(typeof result.business.version).toBe('string');
    expect(typeof result.business.title).toBe('string');
  });

  test('throws error for non-existent business file', () => {
    expect(() => parseOrchestratedBusiness('non-existent-business.yaml')).toThrow();
  });
});

describe('buildTraceabilityGraph', () => {
  test('builds graph with all entities as nodes', () => {
    const orchestrated = parseOrchestratedBusiness('examples/business.yaml');
    const graph = buildTraceabilityGraph(orchestrated);

    // Should have nodes for business and all layers
    expect(graph.nodes.length).toBeGreaterThan(10);
    expect(graph.nodes.find(n => n.id === 'business')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'north-star')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'lean-canvas')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'architectural-scope')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'lean-viability')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'aaarr-metrics')).toBeDefined();
    expect(graph.nodes.find(n => n.id === 'policy-charter')).toBeDefined();
  });

  test('creates directed edges for all references', () => {
    const orchestrated = parseOrchestratedBusiness('examples/business.yaml');
    const graph = buildTraceabilityGraph(orchestrated);

    // Should have edges from business to all layers
    expect(graph.edges.some(e => e.source === 'business' && e.target === 'north-star' && e.type === 'references')).toBe(true);
    expect(graph.edges.some(e => e.source === 'business' && e.target === 'lean-canvas' && e.type === 'references')).toBe(true);
    expect(graph.edges.some(e => e.source === 'business' && e.target === 'architectural-scope' && e.type === 'references')).toBe(true);
    expect(graph.edges.some(e => e.source === 'business' && e.target === 'lean-viability' && e.type === 'references')).toBe(true);
    expect(graph.edges.some(e => e.source === 'business' && e.target === 'aaarr-metrics' && e.type === 'references')).toBe(true);
    expect(graph.edges.some(e => e.source === 'business' && e.target === 'policy-charter' && e.type === 'references')).toBe(true);
  });

  test('supports bidirectional traversal', () => {
    const orchestrated = parseOrchestratedBusiness('examples/business.yaml');
    const graph = buildTraceabilityGraph(orchestrated);

    const upwardNodes = traverseDownward(graph, 'business');
    expect(upwardNodes.length).toBeGreaterThan(1);

    const downwardNodes = traverseDownward(graph, 'north-star');
    expect(downwardNodes.length).toBeGreaterThan(1);
  });

  test('enables path finding between entities', () => {
    const orchestrated = parseOrchestratedBusiness('examples/business.yaml');
    const graph = buildTraceabilityGraph(orchestrated);

    // Find paths from business to some leaf node
    const paths = findPaths(graph, 'business', 'north-star');
    expect(paths.length).toBeGreaterThan(0);
    expect(paths[0][0].id).toBe('business');
    expect(paths[0][paths[0].length - 1].id).toBe('north-star');
  });

  test('colors nodes by layer', () => {
    const orchestrated = parseOrchestratedBusiness('examples/business.yaml');
    const graph = buildTraceabilityGraph(orchestrated);

    // Check that nodes have layer information
    graph.nodes.forEach(node => {
      expect(node.layer).toBeDefined();
      expect(typeof node.layer).toBe('string');
    });
  });

  test('handles large graphs efficiently', () => {
    const orchestrated = parseOrchestratedBusiness('examples/business.yaml');
    const graph = buildTraceabilityGraph(orchestrated);

    const stats = getGraphStats(graph);

    // Should have reasonable number of nodes and edges
    expect(stats.totalNodes).toBeGreaterThan(10);
    expect(stats.totalEdges).toBeGreaterThan(10);
    expect(Object.keys(stats.nodesByLayer).length).toBeGreaterThan(3);

    // Performance test - should complete quickly
    const startTime = Date.now();
    traverseDownward(graph, 'business');
    const endTime = Date.now();
    expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
  });

  test('handles minimal orchestrated business', () => {
    const minimalOrchestrated: OrchestratedBusiness = {
      business: {
        type: 'business',
        version: '2.0',
        last_updated: '2025-12-25',
        title: 'Minimal Business'
      }
    };

    const graph = buildTraceabilityGraph(minimalOrchestrated);

    expect(graph.nodes.length).toBe(1);
    expect(graph.nodes[0].id).toBe('business');
    expect(graph.edges.length).toBe(0);
  });
});