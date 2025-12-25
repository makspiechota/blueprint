import { Command } from 'commander';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { parseLeanViability, parseAARRRMetrics } from '../parser';
import { syncTargetsFromLeanViability, formatSyncChanges } from '../calculator/sync-calculator';
import * as logger from '../utils/logger';

export function createSyncCommand(): Command {
  const command = new Command('sync');

  command
    .description('Sync AAARR targets from Lean Viability calculations')
    .addCommand(
      new Command('aaarr')
        .description('Sync AAARR metrics targets from Lean Viability')
        .argument('<from>', 'Lean Viability YAML file')
        .argument('<to>', 'AAARR Metrics YAML file')
        .option('-y, --yes', 'Skip confirmation and apply changes automatically')
        .option('-v, --verbose', 'Show detailed output')
        .action(async (fromFile: string, toFile: string, options: { yes?: boolean; verbose?: boolean }) => {
          try {
            // Validate input files exist
            if (!fs.existsSync(fromFile)) {
              logger.error(`Lean Viability file not found: ${fromFile}`);
              process.exit(1);
            }

            if (!fs.existsSync(toFile)) {
              logger.error(`AAARR Metrics file not found: ${toFile}`);
              process.exit(1);
            }

            // Parse input files
            const leanViability = parseLeanViability(fromFile);
            const aaarrMetrics = parseAARRRMetrics(toFile);

            // Perform sync
            const syncResult = syncTargetsFromLeanViability(leanViability, aaarrMetrics);

            // Display changes
            console.log('\n' + '='.repeat(60));
            console.log('BLUEPRINT Sync Preview');
            console.log('='.repeat(60));
            console.log(`From: ${fromFile}`);
            console.log(`To: ${toFile}`);
            console.log(`Last synced: ${syncResult.lastSynced}`);
            console.log('');
            console.log(formatSyncChanges(syncResult.changes));

            // Ask for confirmation unless --yes is used
            if (!options.yes) {
              const readline = require('readline');
              const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
              });

              await new Promise<void>((resolve) => {
                rl.question('Apply these changes? (y/N): ', (answer: string) => {
                  rl.close();
                  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    resolve();
                  } else {
                    console.log('Sync cancelled.');
                    process.exit(0);
                  }
                });
              });
            }

            // Apply changes
            const yamlOutput = yaml.dump(syncResult.aaarrMetrics, {
              indent: 2,
              lineWidth: -1,
              sortKeys: false
            });

            fs.writeFileSync(toFile, yamlOutput, 'utf8');

            console.log(`✅ Successfully synced ${syncResult.changes.length} metric target${syncResult.changes.length === 1 ? '' : 's'}`);
            console.log(`📄 Updated: ${toFile}`);

            if (options.verbose) {
              console.log('\nUpdated metrics:');
              syncResult.changes.forEach(change => {
                console.log(`  • ${change.metricId}`);
              });
            }

          } catch (err) {
            logger.error(`Sync failed: ${(err as Error).message}`);
            process.exit(1);
          }
        })
    );

  return command;
}