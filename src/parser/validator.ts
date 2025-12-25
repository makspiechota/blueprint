import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { loadSchema } from './schema-loader';
import { NorthStar, ArchitecturalScope, LeanCanvas, Business, LeanViability, AARRRMetrics, PolicyCharter, OrchestratedBusiness, ValidationResult, ValidationIssue } from './types';
import * as fs from 'fs';
import * as path from 'path';

// Initialize AJV with JSON Schema Draft-07 support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Cache for compiled validators
const validatorCache = new Map<string, ValidateFunction>();

function getValidator(schemaName: string): ValidateFunction {
  if (!validatorCache.has(schemaName)) {
    const schema = loadSchema(schemaName);
    const validator = ajv.compile(schema);
    validatorCache.set(schemaName, validator);
  }
  return validatorCache.get(schemaName)!;
}

export function validate(data: any, schemaName: string): void {
  const validator = getValidator(schemaName);
  const valid = validator(data);

  if (!valid) {
    const errors = ajv.errorsText(validator.errors);
    throw new Error(`Validation failed: ${errors}`);
  }
}

// Legacy exports for backward compatibility
export function validateNorthStar(data: any): asserts data is NorthStar {
  validate(data, 'north-star');
}

export function validateArchitecturalScope(data: any): asserts data is ArchitecturalScope {
  validate(data, 'architectural-scope');
}

export function validateLeanCanvas(data: any): asserts data is LeanCanvas {
  validate(data, 'lean-canvas');
}

export function validateBusiness(data: any): asserts data is Business {
  validate(data, 'business');
}

export function validateLeanViability(data: any): asserts data is LeanViability {
  validate(data, 'lean-viability');
}

export function validateAARRRMetrics(data: any): asserts data is AARRRMetrics {
  validate(data, 'aaarr-metrics');
}

export function validatePolicyCharter(data: any): asserts data is PolicyCharter {
  validate(data, 'policy-charter');
}

const SCOPE_LISTS = ['why', 'what', 'how', 'where', 'who', 'when'] as const;
const ARRAY_SCOPE_LISTS = ['what', 'how', 'where', 'who', 'when'] as const;

export function validateArchitecturalScopeBusinessRules(
  data: any,
  baseDir: string = process.cwd()
): string[] {
  const warnings: string[] = [];

  // Validate north star reference exists
  const northStarPath = path.isAbsolute(data.north_star_ref)
    ? data.north_star_ref
    : path.join(baseDir, data.north_star_ref);

  if (!fs.existsSync(northStarPath)) {
    throw new Error(`North star file not found: ${data.north_star_ref}`);
  }

  // Validate north star file is valid
  try {
    const northStarContent = fs.readFileSync(northStarPath, 'utf8');
    const yaml = require('js-yaml');
    const northStarData = yaml.load(northStarContent);
    validateNorthStar(northStarData);
  } catch (error) {
    throw new Error(`North star file is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Check if at least one scope list is defined (excluding WHY which is always present)
  const definedLists = ARRAY_SCOPE_LISTS.filter(list =>
    list in data && Array.isArray(data[list]) && data[list].length > 0
  );

  if (definedLists.length === 0) {
    warnings.push('No scope lists defined (at least one is recommended)');
  }

  // Validate scope list sizes (3-12 items, optimal: 7)
  // WHY is not validated for size since it has a different structure
  for (const listName of ARRAY_SCOPE_LISTS) {
    if (listName in data && Array.isArray(data[listName])) {
      const count = data[listName].length;
      if (count < 3 || count > 12) {
        warnings.push(`${listName} list has ${count} items (recommended: 3-12, optimal: 7)`);
      }
    }
  }

  // WHY-specific validation
  if (data.why && data.why.goals && Array.isArray(data.why.goals)) {
    const projectKeywords = [
      'implement', 'migrate', 'upgrade', 'deploy', 'install',
      'create', 'build', 'develop', 'add'
    ];

    const enterpriseKeywords = [
      'maximize shareholder', 'market leader', 'company', 'enterprise',
      'organization', 'dominate', 'industry leader', 'global', 'worldwide'
    ];

    for (const goal of data.why.goals) {
      const titleLower = goal.title.toLowerCase();
      const descLower = goal.description.toLowerCase();
      const combined = `${titleLower} ${descLower}`;

      // Check for project objective wording
      const hasProjectWording = projectKeywords.some(keyword =>
        combined.includes(keyword)
      );

      if (hasProjectWording) {
        warnings.push(
          `Goal '${goal.title}' may be a project objective rather than ongoing business goal`
        );
      }

      // Check for enterprise-wide wording
      const hasEnterpriseWording = enterpriseKeywords.some(keyword =>
        combined.includes(keyword)
      );

      if (hasEnterpriseWording) {
        warnings.push(
          `Goal '${goal.title}' appears enterprise-wide; capability goals should be specific to this capability`
        );
      }
    }
  }

   return warnings;
}

export function validateLeanViabilityBusinessRules(
  data: any,
  baseDir: string = process.cwd()
): string[] {
  const warnings: string[] = [];

  // 1. Validate lean_canvas_ref exists
  if (data.lean_canvas_ref) {
    const leanCanvasPath = path.isAbsolute(data.lean_canvas_ref)
      ? data.lean_canvas_ref
      : path.join(baseDir, data.lean_canvas_ref);

    if (!fs.existsSync(leanCanvasPath)) {
      throw new Error(`Lean canvas file not found: ${data.lean_canvas_ref}`);
    }

    // Validate lean canvas file is valid
    try {
      const leanCanvasContent = fs.readFileSync(leanCanvasPath, 'utf8');
      const yaml = require('js-yaml');
      const leanCanvasData = yaml.load(leanCanvasContent);
      validateLeanCanvas(leanCanvasData);
    } catch (error) {
      throw new Error(`Lean canvas file is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 2. Validate time horizon (warn if < 2 or > 5 years)
  if (data.time_horizon) {
    const horizonYears = data.time_horizon.unit === 'years'
      ? data.time_horizon.duration
      : data.time_horizon.duration / 12;

    if (horizonYears < 2) {
      warnings.push(`Time horizon of ${horizonYears} years may be too short (recommended: 2-5 years)`);
    } else if (horizonYears > 5) {
      warnings.push(`Time horizon of ${horizonYears} years may be too long (recommended: 2-5 years)`);
    }
  }

  // 3. Currency consistency check
  const currencies = new Set<string>();
  if (data.success_criteria?.annual_revenue) {
    currencies.add(data.success_criteria.annual_revenue.currency);
  }
  if (data.calculations?.annual_revenue_per_customer) {
    currencies.add(data.calculations.annual_revenue_per_customer.currency);
  }

  if (currencies.size > 1) {
    throw new Error(`All currency amounts must use the same currency. Found: ${Array.from(currencies).join(', ')}`);
  }

  // 4. Sanity check: required customers should be reasonable
  if (data.calculations?.required_customers?.count > 1000000) {
    warnings.push(`Required customers (${data.calculations.required_customers.count}) is very high. Consider validating against TAM.`);
  }

  return warnings;
}

// ============================================================================
// Cross-Layer Validation
// ============================================================================

/**
 * Validates cross-layer references, consistency, and detects issues
 */
export function validateCrossLayerReferences(orchestrated: OrchestratedBusiness): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1. Validate all references point to existing entities
  validateReferenceExistence(orchestrated, issues);

  // 2. Detect circular dependencies (using topological sort)
  detectCircularDependencies(orchestrated, issues);

  // 3. Identify orphaned entities
  identifyOrphanedEntities(orchestrated, issues);

  // 4. Check logical consistency between layers
  checkLogicalConsistency(orchestrated, issues);

  const isValid = !issues.some(issue => issue.type === 'error');

  return {
    isValid,
    issues
  };
}

/**
 * Validates that all referenced entities exist
 */
function validateReferenceExistence(orchestrated: OrchestratedBusiness, issues: ValidationIssue[]): void {
  const { business } = orchestrated;

  // Check business layer references
  if (business.north_star_ref && !orchestrated.northStar) {
    issues.push({
      type: 'error',
      layer: 'business',
      message: `North star reference '${business.north_star_ref}' does not exist or is invalid`,
      field: 'north_star_ref'
    });
  }

  if (business.lean_canvas_ref && !orchestrated.leanCanvas) {
    issues.push({
      type: 'error',
      layer: 'business',
      message: `Lean canvas reference '${business.lean_canvas_ref}' does not exist or is invalid`,
      field: 'lean_canvas_ref'
    });
  }

  if (business.architectural_scope_ref && !orchestrated.architecturalScope) {
    issues.push({
      type: 'error',
      layer: 'business',
      message: `Architectural scope reference '${business.architectural_scope_ref}' does not exist or is invalid`,
      field: 'architectural_scope_ref'
    });
  }

  if (business.lean_viability_ref && !orchestrated.leanViability) {
    issues.push({
      type: 'error',
      layer: 'business',
      message: `Lean viability reference '${business.lean_viability_ref}' does not exist or is invalid`,
      field: 'lean_viability_ref'
    });
  }

  if (business.aaarr_ref && !orchestrated.aaarr) {
    issues.push({
      type: 'error',
      layer: 'business',
      message: `AAARR metrics reference '${business.aaarr_ref}' does not exist or is invalid`,
      field: 'aaarr_ref'
    });
  }

  if (business.policy_charter_ref && !orchestrated.policyCharter) {
    issues.push({
      type: 'error',
      layer: 'business',
      message: `Policy charter reference '${business.policy_charter_ref}' does not exist or is invalid`,
      field: 'policy_charter_ref'
    });
  }

  // Check architectural scope references
  if (orchestrated.architecturalScope && orchestrated.architecturalScope.north_star_ref && !orchestrated.northStar) {
    issues.push({
      type: 'error',
      layer: 'architectural-scope',
      message: `North star reference '${orchestrated.architecturalScope.north_star_ref}' does not exist or is invalid`,
      field: 'north_star_ref'
    });
  }

  // Check lean canvas references
  if (orchestrated.leanCanvas && orchestrated.leanCanvas.north_star_ref && !orchestrated.northStar) {
    issues.push({
      type: 'error',
      layer: 'lean-canvas',
      message: `North star reference '${orchestrated.leanCanvas.north_star_ref}' does not exist or is invalid`,
      field: 'north_star_ref'
    });
  }

  // Check lean viability references
  if (orchestrated.leanViability && orchestrated.leanViability.lean_canvas_ref && !orchestrated.leanCanvas) {
    issues.push({
      type: 'error',
      layer: 'lean-viability',
      message: `Lean canvas reference '${orchestrated.leanViability.lean_canvas_ref}' does not exist or is invalid`,
      field: 'lean_canvas_ref'
    });
  }

  // Check AAARR metrics references
  if (orchestrated.aaarr) {
    if (orchestrated.aaarr.lean_viability_ref && !orchestrated.leanViability) {
      issues.push({
        type: 'error',
        layer: 'aaarr-metrics',
        message: `Lean viability reference '${orchestrated.aaarr.lean_viability_ref}' does not exist or is invalid`,
        field: 'lean_viability_ref'
      });
    }

    if (orchestrated.aaarr.north_star_ref && !orchestrated.northStar) {
      issues.push({
        type: 'error',
        layer: 'aaarr-metrics',
        message: `North star reference '${orchestrated.aaarr.north_star_ref}' does not exist or is invalid`,
        field: 'north_star_ref'
      });
    }
  }

  // Check policy charter references
  if (orchestrated.policyCharter) {
    if (orchestrated.policyCharter.architectural_scope_ref && !orchestrated.architecturalScope) {
      issues.push({
        type: 'error',
        layer: 'policy-charter',
        message: `Architectural scope reference '${orchestrated.policyCharter.architectural_scope_ref}' does not exist or is invalid`,
        field: 'architectural_scope_ref'
      });
    }

    if (orchestrated.policyCharter.aaarr_metrics_ref && !orchestrated.aaarr) {
      issues.push({
        type: 'error',
        layer: 'policy-charter',
        message: `AAARR metrics reference '${orchestrated.policyCharter.aaarr_metrics_ref}' does not exist or is invalid`,
        field: 'aaarr_metrics_ref'
      });
    }
  }
}

/**
 * Detects circular dependencies using topological sort
 */
function detectCircularDependencies(orchestrated: OrchestratedBusiness, issues: ValidationIssue[]): void {
  // Build dependency graph
  const graph: Record<string, string[]> = {};
  const layers = ['business', 'north-star', 'lean-canvas', 'architectural-scope', 'lean-viability', 'aaarr-metrics', 'policy-charter'];

  layers.forEach(layer => {
    graph[layer] = [];
  });

  // Add dependencies based on references
  if (orchestrated.business.north_star_ref) graph.business.push('north-star');
  if (orchestrated.business.lean_canvas_ref) graph.business.push('lean-canvas');
  if (orchestrated.business.architectural_scope_ref) graph.business.push('architectural-scope');
  if (orchestrated.business.lean_viability_ref) graph.business.push('lean-viability');
  if (orchestrated.business.aaarr_ref) graph.business.push('aaarr-metrics');
  if (orchestrated.business.policy_charter_ref) graph.business.push('policy-charter');

  if (orchestrated.architecturalScope?.north_star_ref) graph['architectural-scope'].push('north-star');
  if (orchestrated.leanCanvas?.north_star_ref) graph['lean-canvas'].push('north-star');
  if (orchestrated.leanViability?.lean_canvas_ref) graph['lean-viability'].push('lean-canvas');
  if (orchestrated.aaarr?.lean_viability_ref) graph['aaarr-metrics'].push('lean-viability');
  if (orchestrated.aaarr?.north_star_ref) graph['aaarr-metrics'].push('north-star');
  if (orchestrated.policyCharter?.architectural_scope_ref) graph['policy-charter'].push('architectural-scope');
  if (orchestrated.policyCharter?.aaarr_metrics_ref) graph['policy-charter'].push('aaarr-metrics');

  // Detect cycles using DFS
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(node: string): boolean {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    for (const neighbor of graph[node] || []) {
      if (hasCycle(neighbor)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  for (const layer of layers) {
    if (hasCycle(layer)) {
      issues.push({
        type: 'error',
        layer: 'cross-layer',
        message: `Circular dependency detected involving layer '${layer}'`
      });
      break; // Only report once
    }
  }
}

/**
 * Identifies entities that are not referenced by higher layers
 */
function identifyOrphanedEntities(orchestrated: OrchestratedBusiness, issues: ValidationIssue[]): void {
  // Check for orphaned goals in architectural scope
  if (orchestrated.architecturalScope && orchestrated.architecturalScope.why?.goals) {
    const referencedGoals = new Set<string>();

    // Collect goals referenced by policy charter
    if (orchestrated.policyCharter?.goals) {
      orchestrated.policyCharter.goals.forEach(goal => {
        if (goal.addresses) {
          goal.addresses.forEach(addr => referencedGoals.add(addr));
        }
      });
    }

    // Check for orphaned goals
    orchestrated.architecturalScope.why.goals.forEach(goal => {
      if (!referencedGoals.has(goal.title)) {
        issues.push({
          type: 'warning',
          layer: 'architectural-scope',
          message: `Goal '${goal.title}' is not addressed by any policy charter goal`,
          entityId: goal.title
        });
      }
    });
  }

  // Check for orphaned policies in policy charter
  if (orchestrated.policyCharter?.policies) {
    const drivenPolicies = new Set<string>();

    // Collect policies driven by tactics
    if (orchestrated.policyCharter.tactics) {
      orchestrated.policyCharter.tactics.forEach(tactic => {
        if (tactic.drives_policies) {
          tactic.drives_policies.forEach(policyId => drivenPolicies.add(policyId));
        }
      });
    }

    // Check for orphaned policies
    orchestrated.policyCharter.policies.forEach(policy => {
      if (!drivenPolicies.has(policy.id)) {
        issues.push({
          type: 'warning',
          layer: 'policy-charter',
          message: `Policy '${policy.id}' is not driven by any tactic`,
          entityId: policy.id
        });
      }
    });
  }
}

/**
 * Checks logical consistency between layers
 */
function checkLogicalConsistency(orchestrated: OrchestratedBusiness, issues: ValidationIssue[]): void {
  // Check AAARR metrics alignment with viability targets
  if (orchestrated.aaarr && orchestrated.leanViability) {
    // Check revenue targets alignment
    const viabilityRevenue = orchestrated.leanViability.success_criteria?.annual_revenue;
    if (viabilityRevenue) {
      // Find revenue metrics in AAARR
      const revenueMetrics = findRevenueMetrics(orchestrated.aaarr);
      if (revenueMetrics.length === 0) {
        issues.push({
          type: 'warning',
          layer: 'aaarr-metrics',
          message: 'No revenue metrics defined, but lean viability has revenue targets'
        });
      }
    }
  }

  // Check strategic goals alignment
  if (orchestrated.northStar?.strategic_goals && orchestrated.architecturalScope?.why?.goals) {
    const northStarTitles = new Set(orchestrated.northStar.strategic_goals.map(g => g.title.toLowerCase()));
    const archScopeTitles = new Set(orchestrated.architecturalScope.why.goals.map(g => g.title.toLowerCase()));

    // Check for missing alignment
    const alignedGoals = new Set<string>();
    northStarTitles.forEach(title => {
      archScopeTitles.forEach(archTitle => {
        if (title.includes(archTitle) || archTitle.includes(title)) {
          alignedGoals.add(title);
        }
      });
    });

    if (alignedGoals.size === 0) {
      issues.push({
        type: 'warning',
        layer: 'cross-layer',
        message: 'No clear alignment between north star strategic goals and architectural scope goals'
      });
    }
  }
}

/**
 * Helper to find revenue-related metrics in AAARR
 */
function findRevenueMetrics(aaarr: AARRRMetrics): any[] {
  const revenueMetrics: any[] = [];

  const stages = ['acquisition', 'activation', 'retention', 'referral', 'revenue'] as const;
  stages.forEach(stage => {
    const stageData = aaarr.stages?.[stage];
    if (stageData?.metrics) {
      stageData.metrics.forEach((metric: any) => {
        if (metric.id && metric.id.includes('revenue')) {
          revenueMetrics.push(metric);
        }
      });
    }
  });

  return revenueMetrics;
}

export function validateAARRRMetricsBusinessRules(
  data: any,
  baseDir: string = process.cwd()
): string[] {
  const warnings: string[] = [];

  // 1. Validate lean_viability_ref exists (if provided)
  if (data.lean_viability_ref) {
    const viabilityPath = path.isAbsolute(data.lean_viability_ref)
      ? data.lean_viability_ref
      : path.join(baseDir, data.lean_viability_ref);

    if (!fs.existsSync(viabilityPath)) {
      throw new Error(`Lean viability file not found: ${data.lean_viability_ref}`);
    }
  }

  // 2. Validate metric IDs are unique across all stages
  const metricIds = new Set<string>();
  const stages = ['acquisition', 'activation', 'retention', 'referral', 'revenue'];

  stages.forEach(stageName => {
    const stage = data.stages?.[stageName];
    if (stage?.metrics) {
      stage.metrics.forEach((metric: any) => {
        if (metricIds.has(metric.id)) {
          throw new Error(`Duplicate metric ID: ${metric.id}`);
        }
        metricIds.add(metric.id);

        // Validate ID matches stage
        if (!metric.id.startsWith(`aaarr.${stageName}.`)) {
          throw new Error(`Metric ID '${metric.id}' does not match stage '${stageName}'`);
        }
      });
    }
  });

  // 3. Validate target/current type consistency
  stages.forEach(stageName => {
    const stage = data.stages?.[stageName];
    if (stage?.metrics) {
      stage.metrics.forEach((metric: any) => {
        if (metric.target && metric.current) {
          const targetType = getMetricType(metric.target);
          const currentType = getMetricType(metric.current);

          if (targetType !== currentType) {
            throw new Error(
              `Metric '${metric.id}': target type '${targetType}' does not match current type '${currentType}'`
            );
          }

          // Currency consistency
          if (targetType === 'amount' && metric.target.currency !== metric.current.currency) {
            throw new Error(
              `Metric '${metric.id}': currency mismatch (target: ${metric.target.currency}, current: ${metric.current.currency})`
            );
          }
        }
      });
    }
  });

  // 4. Warn if no viability reference
  if (!data.lean_viability_ref) {
    warnings.push('No lean_viability_ref provided - targets will not be imported automatically');
  }

  return warnings;
}

function getMetricType(value: any): 'rate' | 'amount' | 'percentage' | 'unknown' {
  if (value.rate !== undefined && value.period !== undefined) return 'rate';
  if (value.amount !== undefined && value.currency !== undefined) return 'amount';
  if (value.percentage !== undefined) return 'percentage';
  return 'unknown';
}

// ============================================================================
// Policy Charter Validation
// ============================================================================

export function validatePolicyCharterBusinessRules(
  data: any,
  baseDir: string = process.cwd()
): string[] {
  const warnings: string[] = [];

  // Level 1: Reference Existence
  // Validate architectural_scope_ref exists
  if (data.architectural_scope_ref) {
    const archScopePath = path.isAbsolute(data.architectural_scope_ref)
      ? data.architectural_scope_ref
      : path.join(baseDir, data.architectural_scope_ref);

    if (!fs.existsSync(archScopePath)) {
      throw new Error(`Architectural scope file not found: ${data.architectural_scope_ref}`);
    }

    // Validate architectural scope file is valid
    try {
      const archScopeContent = fs.readFileSync(archScopePath, 'utf8');
      const yaml = require('js-yaml');
      const archScopeData = yaml.load(archScopeContent);
      validateArchitecturalScope(archScopeData);
    } catch (error) {
      throw new Error(`Architectural scope file is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate aaarr_metrics_ref exists
  if (data.aaarr_metrics_ref) {
    const aaarrMetricsPath = path.isAbsolute(data.aaarr_metrics_ref)
      ? data.aaarr_metrics_ref
      : path.join(baseDir, data.aaarr_metrics_ref);

    if (!fs.existsSync(aaarrMetricsPath)) {
      throw new Error(`AAARR metrics file not found: ${data.aaarr_metrics_ref}`);
    }

    // Validate AAARR metrics file is valid
    try {
      const aaarrMetricsContent = fs.readFileSync(aaarrMetricsPath, 'utf8');
      const yaml = require('js-yaml');
      const aaarrMetricsData = yaml.load(aaarrMetricsContent);
      validateAARRRMetrics(aaarrMetricsData);
    } catch (error) {
      throw new Error(`AAARR metrics file is invalid: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Level 2: Type Consistency
  // Validate goal addresses reference architectural scope goals
  if (data.goals && Array.isArray(data.goals)) {
    const validGoalIds = new Set<string>();
    // TODO: Load and extract goal IDs from architectural scope file

    for (const goal of data.goals) {
      if (goal.addresses && Array.isArray(goal.addresses)) {
        for (const address of goal.addresses) {
          // TODO: Check if address exists in architectural scope goals
          // For now, just validate it's a string
          if (typeof address !== 'string') {
            throw new Error(`Goal '${goal.id}' addresses must be strings`);
          }
        }
      }
    }
  }

  // Validate tactic drives_policies reference policy IDs
  if (data.tactics && Array.isArray(data.tactics)) {
    const policyIds = new Set((data.policies || []).map((p: any) => p.id));

    for (const tactic of data.tactics) {
      if (tactic.drives_policies && Array.isArray(tactic.drives_policies)) {
        for (const policyId of tactic.drives_policies) {
          if (!policyIds.has(policyId)) {
            throw new Error(`Tactic '${tactic.id}' references non-existent policy '${policyId}'`);
          }
        }
      }
    }
  }

  // Validate policy driven_by_tactic references tactic IDs
  if (data.policies && Array.isArray(data.policies)) {
    const tacticIds = new Set((data.tactics || []).map((t: any) => t.id));

    for (const policy of data.policies) {
      if (policy.driven_by_tactic && !tacticIds.has(policy.driven_by_tactic)) {
        throw new Error(`Policy '${policy.id}' references non-existent tactic '${policy.driven_by_tactic}'`);
      }
    }
  }

  // Level 3: Logical Consistency
  // Validate goals address at least one architectural scope goal
  if (data.goals && Array.isArray(data.goals)) {
    for (const goal of data.goals) {
      if (!goal.addresses || goal.addresses.length === 0) {
        warnings.push(`Goal '${goal.id}' should address at least one architectural scope goal`);
      }
    }
  }

  // Validate tactics drive at least one policy
  if (data.tactics && Array.isArray(data.tactics)) {
    for (const tactic of data.tactics) {
      if (!tactic.drives_policies || tactic.drives_policies.length === 0) {
        warnings.push(`Tactic '${tactic.id}' should drive at least one policy`);
      }
    }
  }

  // Validate policies are driven by exactly one tactic (already checked in Level 2)
  // This is enforced by the schema requiring driven_by_tactic to be a single string

  // Additional logical checks can be added here

  return warnings;
}
