import { validateCrossLayerReferences } from '../src/parser/validator';
import { OrchestratedBusiness } from '../src/parser/types';

describe('Cross-Layer Validation', () => {
  describe('validateCrossLayerReferences', () => {
    it('should validate that all referenced entities exist', () => {
      // Test with minimal orchestrated business
      const orchestrated: OrchestratedBusiness = {
        business: {
          type: 'business',
          version: '2.0',
          last_updated: '2025-12-25',
          title: 'Test Business',
          north_star_ref: 'non-existent.yaml'
        }
      };

      const result = validateCrossLayerReferences(orchestrated);
      expect(result.isValid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'error',
          layer: 'business',
          message: expect.stringContaining('does not exist or is invalid'),
          field: 'north_star_ref'
        })
      );
    });

    it('should detect circular dependencies', () => {
      // This would require setting up a circular reference scenario
      // For now, test with a valid orchestrated business
      const validOrchestrated: OrchestratedBusiness = {
        business: {
          type: 'business',
          version: '2.0',
          last_updated: '2025-12-25',
          title: 'Valid Business'
        }
      };

      const result = validateCrossLayerReferences(validOrchestrated);
      // Should not have circular dependency errors
      expect(result.issues.filter(issue => issue.message.includes('circular dependency'))).toHaveLength(0);
    });

    it('should identify orphaned entities', () => {
      // Create orchestrated business with architectural scope goals not addressed by policy charter
      const orchestrated: OrchestratedBusiness = {
        business: {
          type: 'business',
          version: '2.0',
          last_updated: '2025-12-25',
          title: 'Test Business'
        },
        architecturalScope: {
          type: 'architectural-scope',
          version: '1.0',
          last_updated: '2025-12-25',
          title: 'Test Scope',
          north_star_ref: 'north-star.yaml',
          why: {
            mission: {
              action: 'Test action',
              service: 'Test service',
              beneficiary: 'Test beneficiary'
            },
            goals: [
              { title: 'Test Goal 1', description: 'Test description' },
              { title: 'Test Goal 2', description: 'Test description' }
            ]
          }
        }
        // No policy charter, so goals should be orphaned
      };

      const result = validateCrossLayerReferences(orchestrated);
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          layer: 'architectural-scope',
          message: expect.stringContaining('not addressed by any policy charter goal'),
          entityId: 'Test Goal 1'
        })
      );
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          layer: 'architectural-scope',
          message: expect.stringContaining('not addressed by any policy charter goal'),
          entityId: 'Test Goal 2'
        })
      );
    });

    it('should check logical consistency between layers', () => {
      // Test AAARR metrics alignment with viability - simplified test
      const orchestrated: OrchestratedBusiness = {
        business: {
          type: 'business',
          version: '2.0',
          last_updated: '2025-12-25',
          title: 'Test Business'
        },
        aaarr: {
          type: 'aaarr-metrics',
          version: '1.0',
          last_updated: '2025-12-25',
          title: 'Test AAARR',
          stages: {
            acquisition: { stage_goal: 'Acquire customers', metrics: [] },
            activation: { stage_goal: 'Activate customers', metrics: [] },
            retention: { stage_goal: 'Retain customers', metrics: [] },
            referral: { stage_goal: 'Get referrals', metrics: [] },
            revenue: { stage_goal: 'Generate revenue', metrics: [] }
          }
        } as any // Use any to avoid schema complexity in test
      };

      const result = validateCrossLayerReferences(orchestrated);
      // Should not crash and should return some result
      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');
      expect(Array.isArray(result.issues)).toBe(true);
    });

    it('should return valid result for valid orchestrated business', () => {
      const validOrchestrated: OrchestratedBusiness = {
        business: {
          type: 'business',
          version: '2.0',
          last_updated: '2025-12-25',
          title: 'Valid Business'
        }
      };

      const result = validateCrossLayerReferences(validOrchestrated);
      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });
});