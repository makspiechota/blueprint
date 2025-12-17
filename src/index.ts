#!/usr/bin/env node

import { program } from 'commander';
import { parseNorthStar } from './parser';
import { generateVisualization } from './visualizer';
import * as logger from './utils/logger';
import * as fs from 'fs';

program
  .name('blueprint')
  .description('Business knowledge management system with DSL parser and visualization')
  .version('0.1.0');

program
  .command('visualize')
  .description('Parse DSL and generate visualization')
  .argument('<input>', 'North Star YAML file')
  .option('-o, --output <file>', 'Output HTML file', 'northstar-visualization.html')
  .action((input: string, options: { output: string }) => {
    try {
      if (!fs.existsSync(input)) {
        logger.error(`File not found: ${input}`);
        process.exit(1);
      }

      const parsedData = parseNorthStar(input);
      generateVisualization(parsedData, options.output);
      logger.success(`Visualization generated successfully: ${options.output}`);
    } catch (err) {
      logger.error(`Failed to generate visualization: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate North Star DSL file')
  .argument('<input>', 'North Star YAML file')
  .action((input: string) => {
    try {
      if (!fs.existsSync(input)) {
        logger.error(`File not found: ${input}`);
        process.exit(1);
      }

      parseNorthStar(input);
      logger.success(`North Star file is valid: ${input}`);
    } catch (err) {
      logger.error(`Validation failed: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program.parse();
