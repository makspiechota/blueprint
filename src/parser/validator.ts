import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { loadSchema } from './schema-loader';
import { NorthStar, ArchitecturalScope, LeanCanvas, Business, LeanViability, AARRRMetrics } from './types';
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
// AAARR Metrics Validation
// ============================================================================

export function validateAARRRMetrics(data: any): asserts data is AARRRMetrics {
  validate(data, 'aaarr-metrics');
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
