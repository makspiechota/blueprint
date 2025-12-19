#!/usr/bin/env node

import { program } from 'commander';
import { parseNorthStar, parseArchitecturalScope } from './parser';
import { generateVisualization, generateCombinedVisualization } from './visualizer';
import { validateArchitecturalScopeBusinessRules } from './parser/validator';
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
  .argument('<input>', 'North Star or Architectural Scope YAML file')
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
  .description('Validate North Star or Architectural Scope DSL file')
  .argument('<input>', 'North Star or Architectural Scope YAML file')
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
