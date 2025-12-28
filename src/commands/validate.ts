import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { parseBusiness, parseOrchestratedBusiness, parseNorthStar, parseArchitecturalScope, parseLeanCanvas, parseLeanViability, parseAARRRMetrics, parsePolicyCharter } from '../parser';
import { validateCrossLayerReferences } from '../parser/validator';
import { validateArchitecturalScopeBusinessRules, validateLeanViabilityBusinessRules, validateAARRRMetricsBusinessRules } from '../parser/validator';
import * as logger from '../utils/logger';

interface ValidationResult {
  layer: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface CrossLayerValidationResult {
  isValid: boolean;
  issues: Array<{
    type: 'error' | 'warning';
    layer: string;
    message: string;
    field?: string;
    entityId?: string;
  }>;
}

export function createValidateCommand(): Command {
  const command = new Command('validate')
    .description('Validate North Star, Architectural Scope, Lean Canvas, Lean Viability, AAARR Metrics, Policy Charter, or Business DSL file')
    .argument('<input>', 'DSL YAML file')
    .option('-o, --output <file>', 'Output HTML report file')
    .action(async (input: string, options: { output?: string }) => {
      try {
        if (!fs.existsSync(input)) {
          logger.error(`File not found: ${input}`);
          process.exit(1);
        }

        // Detect file type
        const fileContent = fs.readFileSync(input, 'utf8');
        const data: any = yaml.load(fileContent);
        const inputDir = path.dirname(input);

        if (data.type === 'business') {
          await validateBusiness(input, options.output);
        } else {
          // Existing validation logic
          validateSingleLayer(data.type, input, inputDir);
        }
      } catch (err) {
        logger.error(`Validation failed: ${(err as Error).message}`);
        process.exit(1);
      }
    });

  return command;
}

async function validateBusiness(inputPath: string, outputPath?: string): Promise<void> {
  const inputDir = path.dirname(inputPath);

  try {
    // Parse orchestrated business
    const orchestrated = parseOrchestratedBusiness(inputPath);
    logger.info(`Validating business: ${orchestrated.business.title}`);

    const results: ValidationResult[] = [];
    const crossLayerIssues: CrossLayerValidationResult['issues'] = [];

    // Validate each referenced layer
    const layers = [
      { name: 'North Star', ref: orchestrated.business.north_star_ref, parser: parseNorthStar, validator: null },
      { name: 'Architectural Scope', ref: orchestrated.business.architectural_scope_ref, parser: parseArchitecturalScope, validator: validateArchitecturalScopeBusinessRules },
      { name: 'Lean Canvas', ref: orchestrated.business.lean_canvas_ref, parser: parseLeanCanvas, validator: null },
      { name: 'Lean Viability', ref: orchestrated.business.lean_viability_ref, parser: parseLeanViability, validator: validateLeanViabilityBusinessRules },
      { name: 'AAARR Metrics', ref: orchestrated.business.aaarr_ref, parser: parseAARRRMetrics, validator: validateAARRRMetricsBusinessRules },
      { name: 'Policy Charter', ref: orchestrated.business.policy_charter_ref, parser: parsePolicyCharter, validator: null }
    ];

    let hasErrors = false;
    let referencedLayersCount = 0;

    for (const layer of layers) {
      if (!layer.ref) {
        results.push({
          layer: layer.name,
          valid: true,
          errors: [],
          warnings: [`Layer not referenced in business file`]
        });
        continue;
      }

      referencedLayersCount++;

      try {
        const layerPath = path.isAbsolute(layer.ref) ? layer.ref : path.join(inputDir, layer.ref);
        if (!fs.existsSync(layerPath)) {
          results.push({
            layer: layer.name,
            valid: false,
            errors: [`Referenced file does not exist: ${layer.ref}`],
            warnings: []
          });
          hasErrors = true;
          continue;
        }

        // Load raw YAML for business rules validation
        const layerContent = fs.readFileSync(layerPath, 'utf8');
        const layerData = yaml.load(layerContent) as any;

        // Run business rules validation if available
        let warnings: string[] = [];
        if (layer.validator) {
          warnings = layer.validator(layerData, path.dirname(layerPath));
        }

        results.push({
          layer: layer.name,
          valid: true,
          errors: [],
          warnings
        });

        referencedLayersCount++;
        logger.success(`${layer.name} layer validated successfully`);
      } catch (err) {
        results.push({
          layer: layer.name,
          valid: false,
          errors: [(err as Error).message],
          warnings: []
        });
        hasErrors = true;
        logger.error(`${layer.name} validation failed: ${(err as Error).message}`);
      }
    }

    // Run cross-layer validation
    try {
      const crossResult = validateCrossLayerReferences(orchestrated);
      crossLayerIssues.push(...crossResult.issues);
      if (!crossResult.isValid) {
        hasErrors = true;
      }
    } catch (err) {
      crossLayerIssues.push({
        type: 'error',
        layer: 'cross-layer',
        message: `Cross-layer validation failed: ${(err as Error).message}`
      });
      hasErrors = true;
    }

    // Generate report
    const report = generateValidationReport(orchestrated.business.title, results, crossLayerIssues);

    if (outputPath) {
      const htmlReport = generateHTMLValidationReport(orchestrated.business.title, results, crossLayerIssues);
      fs.writeFileSync(outputPath, htmlReport, 'utf8');
      logger.success(`HTML report generated`);
    }

    console.log(report);

    if (hasErrors) {
      logger.error('Business validation failed with errors');
      process.exit(1);
    } else {
      logger.success('Business validation completed');
      if (referencedLayersCount < layers.length) {
        logger.info('Partial validation');
      } else {
        logger.success('All layers validated successfully');
      }
    }

  } catch (err) {
    logger.error(`Business validation failed: ${(err as Error).message}`);
    process.exit(1);
  }
}

function validateSingleLayer(type: string, input: string, inputDir: string): void {
  // Existing logic from index.ts
  const fileContent = fs.readFileSync(input, 'utf8');
  const data: any = yaml.load(fileContent);

  if (type === 'architectural-scope') {
    parseArchitecturalScope(input);
    const warnings = validateArchitecturalScopeBusinessRules(data, inputDir);

    if (warnings.length > 0) {
      logger.warning('Validation warnings:');
      warnings.forEach(warning => logger.warning(`  - ${warning}`));
    }

    logger.success(`Architectural Scope file is valid: ${input}`);
  } else if (type === 'north-star') {
    parseNorthStar(input);
    logger.success(`North Star file is valid: ${input}`);
  } else if (type === 'lean-canvas') {
    parseLeanCanvas(input);
    logger.success(`Lean Canvas file is valid: ${input}`);
  } else if (type === 'lean-viability') {
    parseLeanViability(input);
    const warnings = validateLeanViabilityBusinessRules(data, inputDir);

    if (warnings.length > 0) {
      logger.warning('Validation warnings:');
      warnings.forEach(warning => logger.warning(`  - ${warning}`));
    }

    logger.success(`Lean Viability file is valid: ${input}`);
  } else if (type === 'aaarr-metrics') {
    parseAARRRMetrics(input);
    const warnings = validateAARRRMetricsBusinessRules(data, inputDir);
    if (warnings.length > 0) {
      logger.warning('Validation warnings:');
      warnings.forEach(warning => logger.warning(`  - ${warning}`));
    }
    logger.success(`AAARR Metrics file is valid: ${input}`);
  } else if (type === 'policy-charter') {
    parsePolicyCharter(input);
    logger.success(`Policy Charter file is valid: ${input}`);
  } else {
    logger.error(`Unknown file type: ${type}`);
    process.exit(1);
  }
}

function generateValidationReport(title: string, results: ValidationResult[], crossIssues: CrossLayerValidationResult['issues']): string {
  let report = `Business Validation Report: ${title}\n`;
  report += '='.repeat(50) + '\n\n';

  results.forEach(result => {
    report += `${result.layer}:\n`;
    if (result.valid) {
      report += '  ✓ Valid\n';
    } else {
      report += '  ✗ Invalid\n';
      result.errors.forEach(error => report += `    Error: ${error}\n`);
    }
    result.warnings.forEach(warning => report += `    Warning: ${warning}\n`);
    report += '\n';
  });

  report += 'Cross-Layer Validation:\n';
  if (crossIssues.length === 0) {
    report += '  ✓ No issues found\n';
  } else {
    crossIssues.forEach(issue => {
      const icon = issue.type === 'error' ? '✗' : '⚠';
      report += `  ${icon} ${issue.layer}: ${issue.message}\n`;
    });
  }

  return report;
}

function generateHTMLValidationReport(title: string, results: ValidationResult[], crossIssues: CrossLayerValidationResult['issues']): string {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Validation Report: ${title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .layer { margin-bottom: 20px; border: 1px solid #ddd; padding: 10px; }
        .valid { color: green; }
        .invalid { color: red; }
        .warning { color: orange; }
        .error { color: red; }
        ul { list-style-type: none; }
    </style>
</head>
<body>
    <h1>Business Validation Report: ${title}</h1>
    
    ${results.map(result => `
    <div class="layer">
        <h2 class="${result.valid ? 'valid' : 'invalid'}">${result.layer}</h2>
        <ul>
            ${result.errors.map(error => `<li class="error">Error: ${error}</li>`).join('')}
            ${result.warnings.map(warning => `<li class="warning">Warning: ${warning}</li>`).join('')}
        </ul>
    </div>
    `).join('')}
    
    <div class="layer">
        <h2>Cross-Layer Validation</h2>
        <ul>
            ${crossIssues.map(issue => `<li class="${issue.type}">${issue.layer}: ${issue.message}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;

  return html;
}