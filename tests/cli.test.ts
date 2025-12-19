import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const testDir = path.join(__dirname, 'test-cli');
const outputDir = path.join(testDir, 'output');

beforeAll(() => {
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const validYaml = `type: north-star
version: "2.0"
last_updated: "2025-12-17"
title: "Test North Star"
vision: "Test vision content"
problem: "Test problem content"
solution: "Test solution content"
strategic_goals:
  - title: "Goal 1"
    description: "Description 1"`;

  fs.writeFileSync(path.join(testDir, 'valid.yaml'), validYaml, 'utf8');
  fs.writeFileSync(path.join(testDir, 'north-star.yaml'), validYaml, 'utf8');

  const invalidYaml = `type: wrong-type
version: "2.0"`;

  fs.writeFileSync(path.join(testDir, 'invalid.yaml'), invalidYaml, 'utf8');

  const validArchScope = `type: architectural-scope
version: "1.0"
last_updated: "2025-12-18"
title: "Test Scope"
north_star_ref: "north-star.yaml"
why:
  mission:
    action: "to provide"
    service: "comprehensive testing capabilities"
    beneficiary: "development teams"
  goals:
    - title: "To ensure code quality"
      description: "Maintain high standards through automated testing"
    - title: "To reduce defects"
      description: "Catch issues early in development"
what:
  - title: "Entity 1"
    description: "Description 1"
  - title: "Entity 2"
    description: "Description 2"
  - title: "Entity 3"
    description: "Description 3"
how:
  - title: "Process 1"
    description: "Description 1"
  - title: "Process 2"
    description: "Description 2"
  - title: "Process 3"
    description: "Description 3"`;

  fs.writeFileSync(path.join(testDir, 'architectural-scope.yaml'), validArchScope, 'utf8');
});

afterAll(() => {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
});

describe('CLI Integration Tests', () => {
  test('visualize command generates HTML file', () => {
    const inputPath = path.join(testDir, 'valid.yaml');
    const outputPath = path.join(outputDir, 'test-output.html');

    const result = execSync(`npm run build && node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(result).toContain('successfully');
  });

  test('validate command succeeds for valid file', () => {
    const inputPath = path.join(testDir, 'valid.yaml');

    const result = execSync(`node dist/index.js validate ${inputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(result).toContain('valid');
  });

  test('validate command fails for invalid file', () => {
    const inputPath = path.join(testDir, 'invalid.yaml');

    expect(() => {
      execSync(`node dist/index.js validate ${inputPath}`, {
        encoding: 'utf8',
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
    }).toThrow();
  });

  test('validate command succeeds for architectural scope file', () => {
    const inputPath = path.join(testDir, 'architectural-scope.yaml');

    const result = execSync(`node dist/index.js validate ${inputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(result).toContain('valid');
  });

  test('visualize command generates combined visualization when both files exist', () => {
    const inputPath = path.join(testDir, 'architectural-scope.yaml');
    const outputPath = path.join(outputDir, 'combined.html');

    const result = execSync(`node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(fs.existsSync(outputPath)).toBe(true);
    expect(result).toContain('successfully');

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('North Star');
    expect(content).toContain('Architectural Scope');
  });

  test('visualize command with north star detects architectural scope', () => {
    const inputPath = path.join(testDir, 'north-star.yaml');
    const outputPath = path.join(outputDir, 'auto-detected.html');

    const result = execSync(`node dist/index.js visualize ${inputPath} -o ${outputPath}`, {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..')
    });

    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('North Star');
    expect(content).toContain('Architectural Scope');
  });
});
