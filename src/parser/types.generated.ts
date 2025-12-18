// Auto-generated types from JSON schemas
// DO NOT EDIT MANUALLY - Run `npm run generate-types` to regenerate

/**
 * Solution boundaries layer using six scope lists to box the business solution space
 */
export interface ArchitecturalScopeSchema {
  /**
   * Layer type identifier
   */
  type: 'architectural-scope';
  /**
   * DSL version
   */
  version: string;
  /**
   * Last update date in ISO format (YYYY-MM-DD)
   */
  last_updated: string;
  /**
   * Product or company name
   */
  title: string;
  /**
   * Path to north star YAML file
   */
  north_star_ref: string;
  /**
   * Business entities and information objects
   */
  what?: {
    title: string;
    description: string;
    [k: string]: unknown;
  }[];
  /**
   * Business processes and mechanisms
   */
  how?: {
    title: string;
    description: string;
    [k: string]: unknown;
  }[];
  /**
   * Geographic locations and operational boundaries
   */
  where?: {
    title: string;
    description: string;
    [k: string]: unknown;
  }[];
  /**
   * Organizational units and stakeholder groups
   */
  who?: {
    title: string;
    description: string;
    [k: string]: unknown;
  }[];
  /**
   * Critical timing constraints and business cycles
   */
  when?: {
    title: string;
    description: string;
    [k: string]: unknown;
  }[];
  /**
   * Business mission and ongoing business goals
   */
  why?: {
    title: string;
    description: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

/**
 * Strategic vision layer defining enterprise mission and strategic goals
 */
export interface NorthStarSchema {
  /**
   * Layer type identifier
   */
  type: 'north-star';
  /**
   * DSL version
   */
  version: string;
  /**
   * Last update date in ISO format (YYYY-MM-DD)
   */
  last_updated: string;
  /**
   * Product or company name
   */
  title: string;
  /**
   * Future state and transformation you're working toward
   */
  vision: string;
  /**
   * High-level challenges and pain points you're addressing
   */
  problem: string;
  /**
   * High-level approach to solving the problem
   */
  solution: string;
  /**
   * Top-level objectives (3-5 recommended)
   */
  strategic_goals: {
    /**
     * Short, memorable goal name
     */
    title: string;
    /**
     * What success looks like for this goal
     */
    description: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}

