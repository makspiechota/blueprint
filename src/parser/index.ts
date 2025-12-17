import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { validateNorthStar } from './validator';
import { NorthStar } from './types';

export function parseNorthStar(filePath: string): NorthStar {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.load(fileContents);

  validateNorthStar(data);

  return data;
}
