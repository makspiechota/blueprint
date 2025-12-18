import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { validateNorthStar, validateArchitecturalScope } from './validator';
import { NorthStar, ArchitecturalScope } from './types';

export function parseNorthStar(filePath: string): NorthStar {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateNorthStar(data);

  return data;
}

export function parseArchitecturalScope(filePath: string): ArchitecturalScope {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateArchitecturalScope(data);

  return data;
}
