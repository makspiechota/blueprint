import { generateVisualization } from '../src/visualizer';
import { NorthStar } from '../src/parser/types';
import * as fs from 'fs';
import * as path from 'path';

const outputDir = path.join(__dirname, 'output');

beforeAll(() => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
});

afterAll(() => {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
});

describe('generateVisualization', () => {
  test('generates valid HTML file', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '1.0',
      last_updated: '2025-12-17',
      title: 'Test North Star',
      vision: 'Test vision content',
      problem: 'Test problem content',
      solution: 'Test solution content',
      strategic_goals: [
        { title: 'Goal 1', description: 'Description 1' },
        { title: 'Goal 2', description: 'Description 2' }
      ]
    };

    const outputPath = path.join(outputDir, 'test-output.html');
    generateVisualization(northStar, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('Test North Star');
    expect(content).toContain('Test vision content');
    expect(content).toContain('Test problem content');
    expect(content).toContain('Test solution content');
    expect(content).toContain('Goal 1');
    expect(content).toContain('Goal 2');
  });

  test('includes all north star sections', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-17',
      title: 'Complete North Star',
      vision: 'Vision text',
      problem: 'Problem text',
      solution: 'Solution text',
      strategic_goals: [{ title: 'Goal', description: 'Desc' }]
    };

    const outputPath = path.join(outputDir, 'complete.html');
    generateVisualization(northStar, outputPath);

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('Vision');
    expect(content).toContain('Problem');
    expect(content).toContain('Solution');
    expect(content).toContain('Strategic Goals');
  });
});
