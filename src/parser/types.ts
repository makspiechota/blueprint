// Type definitions for Blueprint DSL
// Re-exports generated types with cleaner names

import { Schemas } from './types.generated';

// Re-export schema types with cleaner names
export type NorthStar = Schemas.NorthStar;
export type ArchitecturalScope = Schemas.ArchitecturalScope;
export type LeanCanvas = Schemas.LeanCanvas;
export type Business = Schemas.Business;
export type LeanViability = Schemas.LeanViability;
export type AARRRMetrics = Schemas.AaarrMetrics;
export type PolicyCharter = Schemas.PolicyCharter;

// Orchestrated business with all parsed layers
export interface OrchestratedBusiness {
  business: Business;
  northStar?: NorthStar;
  leanCanvas?: LeanCanvas;
  architecturalScope?: ArchitecturalScope;
  leanViability?: LeanViability;
  aaarr?: AARRRMetrics;
  policyCharter?: PolicyCharter;
}

// Validation result for cross-layer validation
export interface ValidationIssue {
  type: 'error' | 'warning';
  layer: string;
  message: string;
  field?: string;
  entityId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
}

// Traceability Graph Types
export interface TraceabilityNode {
  id: string;
  layer: string;
  type: string;
  title: string;
  description?: string;
  data: any; // Raw entity data
}

export interface TraceabilityEdge {
  source: string; // Node ID
  target: string; // Node ID
  type: string; // Reference type (e.g., 'addresses', 'references', 'imported_from')
  strength: number; // 1-10, how strong the connection is
  metadata?: any;
}

export interface TraceabilityGraph {
  nodes: TraceabilityNode[];
  edges: TraceabilityEdge[];
}
