#!/usr/bin/env node

import { program } from 'commander';

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
    console.log(`Visualize command called with ${input} -> ${options.output}`);
  });

program
  .command('validate')
  .description('Validate North Star DSL file')
  .argument('<input>', 'North Star YAML file')
  .action((input: string) => {
    console.log(`Validate command called with ${input}`);
  });

program.parse();
