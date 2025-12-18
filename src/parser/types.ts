// Type definitions for Blueprint DSL
// Re-exports generated types with cleaner names

import { ArchitecturalScopeSchema, NorthStarSchema } from './types.generated';

// Re-export schema types with cleaner names
export type NorthStar = NorthStarSchema;
export type ArchitecturalScope = ArchitecturalScopeSchema;

// Utility types for scope items
export type ScopeItem = {
  title: string;
  description: string;
  [k: string]: unknown;
};

// Type for strategic goals (used in north star)
export type StrategicGoal = {
  title: string;
  description: string;
};

// Type for all six scope lists
export type ScopeListKey = 'what' | 'how' | 'where' | 'who' | 'when' | 'why';

// Helper type for scope list validation
export type ScopeLists = {
  [K in ScopeListKey]?: ScopeItem[];
};
