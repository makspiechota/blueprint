import * as fs from 'fs';
import * as path from 'path';

describe('Documentation Tests', () => {
  describe('User Guide', () => {
    let userGuideContent: string;

    beforeAll(() => {
      userGuideContent = fs.readFileSync(path.join(__dirname, '../docs/user-guide.md'), 'utf8');
    });

    test('covers multi-layer orchestration', () => {
      expect(userGuideContent).toContain('multi-layer orchestration');
    });

    test('documents business.yaml v2.0 format', () => {
      expect(userGuideContent).toContain('business.yaml v2.0');
    });

    test('explains orchestration workflow', () => {
      expect(userGuideContent).toContain('Orchestration Workflow');
    });

    test('describes traceability graph usage', () => {
      expect(userGuideContent).toContain('Traceability Graph Usage');
    });

    test('documents sync command', () => {
      expect(userGuideContent).toContain('Sync Command');
    });

    test('documents validate command', () => {
      expect(userGuideContent).toContain('Validate Command');
    });

    test('includes examples', () => {
      expect(userGuideContent).toContain('```yaml');
      expect(userGuideContent).toContain('business.yaml');
    });

    test('documents edge cases', () => {
      expect(userGuideContent).toContain('Edge Cases');
    });
  });

  describe('Layer Orchestration Architecture Guide', () => {
    let orchestrationGuideContent: string;

    beforeAll(() => {
      const filePath = path.join(__dirname, '../docs/architecture/layer-orchestration.md');
      if (fs.existsSync(filePath)) {
        orchestrationGuideContent = fs.readFileSync(filePath, 'utf8');
      } else {
        orchestrationGuideContent = '';
      }
    });

    test('file exists', () => {
      expect(fs.existsSync(path.join(__dirname, '../docs/architecture/layer-orchestration.md'))).toBe(true);
    });

    test('explains multi-layer system', () => {
      expect(orchestrationGuideContent).toContain('multi-layer');
    });

    test('documents business.yaml v2.0 format', () => {
      expect(orchestrationGuideContent).toContain('business.yaml v2.0');
    });

    test('explains orchestration workflow', () => {
      expect(orchestrationGuideContent).toContain('Orchestration Workflow');
    });

    test('describes traceability graph', () => {
      expect(orchestrationGuideContent).toContain('Traceability Graph');
    });

    test('includes examples', () => {
      expect(orchestrationGuideContent).toContain('```yaml');
    });

    test('documents edge cases', () => {
      expect(orchestrationGuideContent).toContain('Edge Cases');
    });
  });

  describe('README', () => {
    let readmeContent: string;

    beforeAll(() => {
      readmeContent = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8');
    });

    test('updated with new commands', () => {
      expect(readmeContent).toContain('sync');
      expect(readmeContent).toContain('validate');
    });

    test('documents business.yaml v2.0', () => {
      expect(readmeContent).toContain('business.yaml');
      expect(readmeContent).toContain('2.0');
    });

    test('includes CLI commands section', () => {
      expect(readmeContent).toContain('CLI Commands');
    });
  });
});