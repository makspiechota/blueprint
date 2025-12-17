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

  const invalidYaml = `type: wrong-type
version: "2.0"`;

  fs.writeFileSync(path.join(testDir, 'invalid.yaml'), invalidYaml, 'utf8');
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
});
