import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { validateNorthStar, validateArchitecturalScope, validateLeanCanvas, validateBusiness, validateLeanViability, validateAARRRMetrics, validatePolicyCharter } from './validator';
import { NorthStar, ArchitecturalScope, LeanCanvas, Business, LeanViability, AARRRMetrics, PolicyCharter } from './types';

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

export function parseLeanCanvas(filePath: string): LeanCanvas {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateLeanCanvas(data);

  return data;
}

export function parseBusiness(filePath: string): Business {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateBusiness(data);

  return data;
}

export function parseLeanViability(filePath: string): LeanViability {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateLeanViability(data);

  return data;
}

export function parseAARRRMetrics(filePath: string): AARRRMetrics {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateAARRRMetrics(data);

  return data;
}

export function parsePolicyCharter(filePath: string): PolicyCharter {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validatePolicyCharter(data);

  return data;
}
