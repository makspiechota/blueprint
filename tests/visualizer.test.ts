import { generateVisualization, generateCombinedVisualization } from '../src/visualizer';
import { NorthStar, ArchitecturalScope } from '../src/parser/types';
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

describe('generateCombinedVisualization', () => {
  test('generates tabbed UI with both north star and architectural scope', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-18',
      title: 'Test Product',
      vision: 'Vision text',
      problem: 'Problem text',
      solution: 'Solution text',
      strategic_goals: [{ title: 'Goal 1', description: 'Desc 1' }]
    };

    const architecturalScope: ArchitecturalScope = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test Product',
      north_star_ref: 'north-star.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'test services',
          beneficiary: 'test users'
        },
        goals: [
          { title: 'To achieve goal 1', description: 'Goal desc 1' }
        ]
      },
      what: [
        { title: 'Entity 1', description: 'What desc 1' },
        { title: 'Entity 2', description: 'What desc 2' },
        { title: 'Entity 3', description: 'What desc 3' }
      ],
      how: [
        { title: 'Process 1', description: 'How desc 1' },
        { title: 'Process 2', description: 'How desc 2' },
        { title: 'Process 3', description: 'How desc 3' }
      ]
    };

    const outputPath = path.join(outputDir, 'combined.html');
    generateCombinedVisualization(northStar, architecturalScope, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);

    const content = fs.readFileSync(outputPath, 'utf8');

    // Check for tabbed interface
    expect(content).toContain('North Star');
    expect(content).toContain('Architectural Scope');

    // Check north star content
    expect(content).toContain('Vision text');
    expect(content).toContain('Goal 1');

    // Check architectural scope content
    expect(content).toContain('Entity 1');
    expect(content).toContain('Process 1');
  });

  test('displays all six scope lists in grid layout', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-18',
      title: 'Test',
      vision: 'V',
      problem: 'P',
      solution: 'S',
      strategic_goals: []
    };

    const architecturalScope: ArchitecturalScope = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'ns.yaml',
      why: {
        mission: {
          action: 'to deliver',
          service: 'quality solutions',
          beneficiary: 'customers'
        },
        goals: [
          { title: 'To achieve excellence', description: 'D1' },
          { title: 'To improve efficiency', description: 'D2' },
          { title: 'To enhance satisfaction', description: 'D3' }
        ]
      },
      what: [{ title: 'W1', description: 'D1' }, { title: 'W2', description: 'D2' }, { title: 'W3', description: 'D3' }],
      how: [{ title: 'H1', description: 'D1' }, { title: 'H2', description: 'D2' }, { title: 'H3', description: 'D3' }],
      where: [{ title: 'Wh1', description: 'D1' }, { title: 'Wh2', description: 'D2' }, { title: 'Wh3', description: 'D3' }],
      who: [{ title: 'Who1', description: 'D1' }, { title: 'Who2', description: 'D2' }, { title: 'Who3', description: 'D3' }],
      when: [{ title: 'When1', description: 'D1' }, { title: 'When2', description: 'D2' }, { title: 'When3', description: 'D3' }]
    };

    const outputPath = path.join(outputDir, 'all-lists.html');
    generateCombinedVisualization(northStar, architecturalScope, outputPath);

    const content = fs.readFileSync(outputPath, 'utf8');

    // Check for all scope list headers
    expect(content).toContain('What');
    expect(content).toContain('How');
    expect(content).toContain('Where');
    expect(content).toContain('Who');
    expect(content).toContain('When');
    // WHY is rendered differently now (mission + goals structure)
    // Full WHY visualization will be updated in Task 004
  });

  test('handles architectural scope with no scope lists', () => {
    const northStar: NorthStar = {
      type: 'north-star',
      version: '2.0',
      last_updated: '2025-12-18',
      title: 'Test',
      vision: 'V',
      problem: 'P',
      solution: 'S',
      strategic_goals: []
    };

    const architecturalScope: ArchitecturalScope = {
      type: 'architectural-scope',
      version: '1.0',
      last_updated: '2025-12-18',
      title: 'Test',
      north_star_ref: 'ns.yaml',
      why: {
        mission: {
          action: 'to provide',
          service: 'minimal services',
          beneficiary: 'users'
        }
      }
    };

    const outputPath = path.join(outputDir, 'empty-scope.html');
    generateCombinedVisualization(northStar, architecturalScope, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);
    const content = fs.readFileSync(outputPath, 'utf8');
    expect(content).toContain('<!DOCTYPE html>');
  });
});
