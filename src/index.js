#!/usr/bin/env node

/**
 * North Star CLI - Main Entry Point
 *
 * Command-line interface for parsing and visualizing North Star DSL files
 */

const { program } = require('commander');

program
  .name('northstar')
  .description('North Star DSL parser and visualization tool')
  .version('0.1.0');

program
  .command('visualize')
  .description('Parse DSL and generate visualization')
  .argument('<input>', 'North Star YAML file')
  .option('-o, --output <file>', 'Output HTML file', 'northstar-visualization.html')
  .action((input, options) => {
    console.log(`Visualize command called with ${input} -> ${options.output}`);
    // Implementation will be added in task 005
  });

program
  .command('validate')
  .description('Validate North Star DSL file')
  .argument('<input>', 'North Star YAML file')
  .action((input) => {
    console.log(`Validate command called with ${input}`);
    // Implementation will be added in task 005
  });

program.parse();
