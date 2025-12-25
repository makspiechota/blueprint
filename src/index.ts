#!/usr/bin/env node

import { program } from 'commander';
import { parseNorthStar, parseArchitecturalScope, parseLeanCanvas, parseBusiness, parseLeanViability, parseAARRRMetrics, parsePolicyCharter } from './parser';
import { generateVisualization, generateCombinedVisualization, visualizeBusiness, visualizePolicyCharter, generatePolicyCharterHTML } from './visualizer';
import { generateLeanCanvasHTML } from './visualizer/lean-canvas-visualizer';
import { generateLeanViabilityHTML } from './visualizer/lean-viability-visualizer';
import { generateAARRRMetricsHTML } from './visualizer/aaarr-visualizer';
import { validateArchitecturalScopeBusinessRules, validateLeanViabilityBusinessRules, validateAARRRMetricsBusinessRules } from './parser/validator';
import { LeanViability } from './parser/types';
import * as logger from './utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

program
  .name('blueprint')
  .description('Business knowledge management system with DSL parser and visualization')
  .version('0.1.0');

program
  .command('visualize')
  .description('Parse DSL and generate visualization')
  .argument('<input>', 'North Star, Architectural Scope, Lean Canvas, Lean Viability, AAARR Metrics, or Business YAML file')
  .option('-o, --output <file>', 'Output HTML file', 'northstar-visualization.html')
  .action((input: string, options: { output: string }) => {
    try {
      if (!fs.existsSync(input)) {
        logger.error(`File not found: ${input}`);
        process.exit(1);
      }

      // Detect file type
      const fileContent = fs.readFileSync(input, 'utf8');
      const data: any = yaml.load(fileContent);
      const inputDir = path.dirname(input);

      if (data.type === 'architectural-scope') {
        // Parse architectural scope
        const architecturalScope = parseArchitecturalScope(input);

        // Load referenced north star
        const northStarPath = path.isAbsolute(architecturalScope.north_star_ref)
          ? architecturalScope.north_star_ref
          : path.join(inputDir, architecturalScope.north_star_ref);

        const northStar = parseNorthStar(northStarPath);
        generateCombinedVisualization(northStar, architecturalScope, options.output);
        logger.success(`Combined visualization generated successfully: ${options.output}`);
      } else if (data.type === 'north-star') {
        // Parse north star
        const northStar = parseNorthStar(input);

        // Check for architectural scope in same directory
        const archScopePath = path.join(inputDir, 'architectural-scope.yaml');

        if (fs.existsSync(archScopePath)) {
          const architecturalScope = parseArchitecturalScope(archScopePath);
          generateCombinedVisualization(northStar, architecturalScope, options.output);
          logger.success(`Combined visualization generated successfully: ${options.output}`);
        } else {
          generateVisualization(northStar, options.output);
          logger.success(`Visualization generated successfully: ${options.output}`);
        }
      } else if (data.type === 'lean-canvas') {
        // Parse lean canvas
        const leanCanvas = parseLeanCanvas(input);
        const html = generateLeanCanvasHTML(leanCanvas);
        fs.writeFileSync(options.output, html, 'utf8');
        logger.success(`Lean Canvas visualization generated successfully: ${options.output}`);
      } else if (data.type === 'business') {
        // Parse business and orchestrate layers
        visualizeBusiness(input, options.output);
        logger.success(`Business visualization generated successfully: ${options.output}`);
      } else if (data.type === 'lean-viability') {
        // Parse lean viability
        const leanViability = parseLeanViability(input);

        // Run business rules validation
        const viabilityWarnings = validateLeanViabilityBusinessRules(data, inputDir);
        if (viabilityWarnings.length > 0) {
          console.log('\nWarnings:');
          viabilityWarnings.forEach(warning => console.log(`  ⚠ ${warning}`));
        }

        // Generate viability dashboard
        const viabilityHtml = generateLeanViabilityHTML(leanViability);
        const viabilityOutputPath = options.output || path.join(inputDir, 'viability-dashboard.html');
        fs.writeFileSync(viabilityOutputPath, viabilityHtml);

        logger.success(`Lean Viability visualization generated successfully: ${viabilityOutputPath}`);
      } else if (data.type === 'aaarr-metrics') {
        const aarrr = parseAARRRMetrics(input);
        const aarrrWarnings = validateAARRRMetricsBusinessRules(data, inputDir);
        if (aarrrWarnings.length > 0) {
          console.log('\nWarnings:');
          aarrrWarnings.forEach(warning => console.log(`  ⚠ ${warning}`));
        }
        const aarrrHtml = generateAARRRMetricsHTML(aarrr, inputDir);
        const aarrrOutputPath = options.output || path.join(inputDir, 'aaarr-dashboard.html');
        fs.writeFileSync(aarrrOutputPath, aarrrHtml);
        logger.success(`AAARR Metrics visualization generated successfully: ${aarrrOutputPath}`);
      } else if (data.type === 'policy-charter') {
        // Parse policy charter
        const policyCharter = parsePolicyCharter(input);

        // Generate policy charter visualization
        const policyCharterOutputPath = options.output || path.join(inputDir, 'policy-charter.html');
        visualizePolicyCharter(input, policyCharterOutputPath);

        logger.success(`Policy Charter visualization generated successfully: ${policyCharterOutputPath}`);
      } else {
        logger.error(`Unknown file type: ${data.type}`);
        process.exit(1);
      }
    } catch (err) {
      logger.error(`Failed to generate visualization: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate North Star, Architectural Scope, Lean Canvas, Lean Viability, AAARR Metrics, or Business DSL file')
  .argument('<input>', 'North Star, Architectural Scope, Lean Canvas, Lean Viability, AAARR Metrics, or Business YAML file')
  .action((input: string) => {
    try {
      if (!fs.existsSync(input)) {
        logger.error(`File not found: ${input}`);
        process.exit(1);
      }

      // Detect file type
      const fileContent = fs.readFileSync(input, 'utf8');
      const data: any = yaml.load(fileContent);
      const inputDir = path.dirname(input);

      if (data.type === 'architectural-scope') {
        parseArchitecturalScope(input);
        const warnings = validateArchitecturalScopeBusinessRules(data, inputDir);

        if (warnings.length > 0) {
          logger.warning('Validation warnings:');
          warnings.forEach(warning => logger.warning(`  - ${warning}`));
        }

        logger.success(`Architectural Scope file is valid: ${input}`);
      } else if (data.type === 'north-star') {
        parseNorthStar(input);
        logger.success(`North Star file is valid: ${input}`);
      } else if (data.type === 'lean-canvas') {
        parseLeanCanvas(input);
        logger.success(`Lean Canvas file is valid: ${input}`);
      } else if (data.type === 'business') {
        parseBusiness(input);
        logger.success(`Business file is valid: ${input}`);
      } else if (data.type === 'lean-viability') {
        parseLeanViability(input);
        const warnings = validateLeanViabilityBusinessRules(data, inputDir);

        if (warnings.length > 0) {
          logger.warning('Validation warnings:');
          warnings.forEach(warning => logger.warning(`  - ${warning}`));
        }

        logger.success(`Lean Viability file is valid: ${input}`);
      } else if (data.type === 'aaarr-metrics') {
        parseAARRRMetrics(input);
        const warnings = validateAARRRMetricsBusinessRules(data, inputDir);
        if (warnings.length > 0) {
          logger.warning('Validation warnings:');
          warnings.forEach(warning => logger.warning(`  - ${warning}`));
        }
        logger.success(`AAARR Metrics file is valid: ${input}`);
      } else if (data.type === 'policy-charter') {
        parsePolicyCharter(input);
        logger.success(`Policy Charter file is valid: ${input}`);
      } else {
        logger.error(`Unknown file type: ${data.type}`);
        process.exit(1);
      }
    } catch (err) {
      logger.error(`Validation failed: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
