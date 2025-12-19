declare namespace Schemas {
    /**
     * Architectural Scope Schema
     * Solution boundaries layer using six scope lists to box the business solution space
     */
    export interface ArchitecturalScope {
        /**
         * Layer type identifier
         */
        type: "architectural-scope";
        /**
         * DSL version
         */
        version: string;
        /**
         * Last update date in ISO format (YYYY-MM-DD)
         */
        last_updated: string; // ^\d{4}-\d{2}-\d{2}$
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
        }[];
        /**
         * Business processes and mechanisms
         */
        how?: {
            title: string;
            description: string;
        }[];
        /**
         * Geographic locations and operational boundaries
         */
        where?: {
            title: string;
            description: string;
        }[];
        /**
         * Organizational units and stakeholder groups
         */
        who?: {
            title: string;
            description: string;
        }[];
        /**
         * Critical timing constraints and business cycles
         */
        when?: {
            title: string;
            description: string;
        }[];
        /**
         * Business motivation: mission and goals for this capability
         */
        why: {
            /**
             * Business mission: what this capability does in day-to-day operations
             */
            mission: {
                /**
                 * Action verb (e.g., 'to provide', 'to enable')
                 */
                action: string; // ^[Tt]o 
                /**
                 * The service or offering provided
                 */
                service: string;
                /**
                 * Who benefits from this service
                 */
                beneficiary: string;
            };
            /**
             * Capability-specific business goals (ongoing objectives, not project goals)
             */
            goals?: {
                /**
                 * Goal title starting with 'To' (e.g., 'To increase customer satisfaction')
                 */
                title: string; // ^[Tt]o 
                /**
                 * Ongoing effect to achieve continuously for this capability
                 */
                description: string;
            }[];
        };
    }
    /**
     * North Star Schema
     * Strategic vision layer defining enterprise mission and strategic goals
     */
    export interface NorthStar {
        /**
         * Layer type identifier
         */
        type: "north-star";
        /**
         * DSL version
         */
        version: string;
        /**
         * Last update date in ISO format (YYYY-MM-DD)
         */
        last_updated: string; // ^\d{4}-\d{2}-\d{2}$
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
        }[];
    }
}

export { Schemas };
