declare namespace Schemas {
    /**
     * AAARR Metrics Schema
     * Customer lifecycle metrics across 5 stages (Acquisition, Activation, Retention, Referral, Revenue)
     */
    export interface AaarrMetrics {
        type: "aaarr-metrics";
        version: string;
        last_updated: string; // date
        last_synced?: string; // date
        title: string;
        lean_viability_ref?: string;
        north_star_ref?: string;
        stages: {
            acquisition: AaarrMetrics.Definitions.AARRRStage;
            activation: AaarrMetrics.Definitions.AARRRStage;
            retention: AaarrMetrics.Definitions.AARRRStage;
            referral: AaarrMetrics.Definitions.AARRRStage;
            revenue: AaarrMetrics.Definitions.AARRRStage;
        };
    }
    namespace AaarrMetrics {
        namespace Definitions {
            export interface AARRRStage {
                stage_goal: string;
                metrics: Metric[];
            }
            export interface GapValue {
                rate?: number;
                amount?: number;
                percentage?: number;
            }
            export interface Metric {
                id: string; // ^aaarr\.(acquisition|activation|retention|referral|revenue)\.[a-z][a-z0-9-]*$
                name: string;
                description?: string;
                target?: MetricValue;
                current?: MetricValue;
                gap?: GapValue;
            }
            export interface MetricValue {
                rate?: number;
                period?: "day" | "week" | "month" | "quarter" | "year" | "hour";
                amount?: number;
                currency?: "USD" | "EUR" | "PLN" | "GBP";
                percentage?: number;
                imported_from?: string;
            }
        }
    }
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
     * Business Schema
     * Entry point orchestrating all business and architectural layers
     */
    export interface Business {
        type: "business";
        version: string;
        last_updated: string; // date
        title: string;
        north_star_ref?: string;
        lean_canvas_ref?: string;
        architectural_scope_ref?: string;
        lean_viability_ref?: string;
        aaarr_ref?: string;
        policy_charter_ref?: string;
        backlog_ref?: string;
    }
    /**
     * Lean Canvas Schema
     * Business model layer using 9-box Lean Canvas framework
     */
    export interface LeanCanvas {
        type: "lean-canvas";
        version: string;
        last_updated: string; // date
        title: string;
        north_star_ref?: string;
        problem?: {
            top_3_problems?: string[];
            existing_alternatives?: string;
        };
        customer_segments?: {
            target_customers?: string;
            early_adopters?: string;
        };
        unique_value_proposition?: {
            single_clear_message?: string;
            high_level_concept?: string;
        };
        solution?: {
            top_3_features?: string[];
        };
        channels?: {
            path_to_customers?: string[];
        };
        revenue_streams?: {
            revenue_model?: string;
            lifetime_value?: string;
        };
        cost_structure?: {
            customer_acquisition_cost?: string;
            distribution_costs?: string;
            hosting_costs?: string;
            people_costs?: string;
        };
        key_metrics?: {
            activities_to_measure?: string[];
        };
        unfair_advantage?: {
            cant_be_copied?: string;
        };
    }
    /**
     * Lean 1-2-3 Viability Schema
     * Viability layer using Ash Maurya's Lean 1-2-3 framework for work-backwards calculations
     */
    export interface LeanViability {
        type: "lean-viability";
        version: string;
        last_updated: string; // date
        title: string;
        lean_canvas_ref?: string;
        time_horizon: LeanViability.Definitions.TimeHorizon;
        success_criteria: {
            annual_revenue: LeanViability.Definitions.CurrencyAmount;
            target_year: number;
        };
        calculations: {
            annual_revenue_per_customer: {
                amount: number;
                currency: "USD" | "EUR" | "PLN" | "GBP";
                basis: string;
            };
            required_customers: {
                count: number;
                formula: string;
            };
            customer_acquisition_rate: {
                rate: number;
                period: "day" | "week" | "month" | "quarter" | "year";
                formula: string;
            };
            monthly_acquisition_target: {
                rate: number;
                period: "day" | "week" | "month" | "quarter" | "year";
                formula: string;
            };
            customer_lifetime_value?: {
                years?: number;
                formula?: string;
            };
            churn_rate?: {
                monthly_rate?: number;
                formula?: string;
            };
            conversion_rate?: {
                rate?: number;
                basis?: string;
            };
            monthly_visitors?: {
                rate: number;
                period: "day" | "week" | "month" | "quarter" | "year";
                formula?: string;
            };
        };
        targets: {
            acquisition?: {
                monthly_signups?: LeanViability.Definitions.RatePeriod;
            };
            activation?: {
                [key: string]: any;
            };
            retention?: {
                [key: string]: any;
            };
            referral?: {
                [key: string]: any;
            };
            revenue?: {
                arpu?: {
                    amount: number;
                    currency: "USD" | "EUR" | "PLN" | "GBP";
                    period: "day" | "week" | "month" | "quarter" | "year";
                };
            };
        };
    }
    namespace LeanViability {
        namespace Definitions {
            export interface CurrencyAmount {
                amount: number;
                currency: "USD" | "EUR" | "PLN" | "GBP";
            }
            export interface RatePeriod {
                rate: number;
                period: "day" | "week" | "month" | "quarter" | "year";
            }
            export interface TimeHorizon {
                duration: number;
                unit: "years" | "months";
            }
        }
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
    /**
     * Policy Charter Schema
     * Operational goals, tactics, policies, risks, and KPIs using Ronald Ross Policy Charter framework
     */
    export interface PolicyCharter {
        type: "policy-charter";
        version: string;
        last_updated: string; // ^\d{4}-\d{2}-\d{2}$
        title: string;
        architectural_scope_ref: string;
        aaarr_metrics_ref: string;
        goals: PolicyCharter.Definitions.Goal[];
        tactics?: PolicyCharter.Definitions.Tactic[];
        policies?: PolicyCharter.Definitions.Policy[];
        risks?: PolicyCharter.Definitions.Risk[];
        kpis?: PolicyCharter.Definitions.KPI[];
    }
    namespace PolicyCharter {
        namespace Definitions {
            export interface Goal {
                id: string; // ^pc\.goal\.[a-z][a-z0-9-]*$
                title: string;
                description: string;
                /**
                 * Architectural Scope goal IDs this addresses
                 */
                addresses: string[];
                /**
                 * AAARR stages impacted
                 */
                aaarr_impact: string[];
                /**
                 * Tactic IDs that achieve this goal
                 */
                tactics: string[];
                /**
                 * Policy IDs that support this goal
                 */
                policies?: string[];
                /**
                 * KPI IDs that measure this goal
                 */
                kpis?: string[];
                /**
                 * Risk IDs that threaten this goal
                 */
                risks?: string[];
            }
            export interface KPI {
                id: string; // ^pc\.kpi\.[a-z][a-z0-9-]*$
                name: string;
                description?: string;
                target: KPIValue;
                current: KPIValue;
                measurement_frequency: "daily" | "weekly" | "monthly" | "quarterly";
                justification: string;
            }
            export interface KPIValue {
                rate?: number;
                amount?: number;
                percentage?: number;
            }
            export interface Policy {
                id: string; // ^pc\.policy\.[a-z][a-z0-9-]*$
                title: string;
                rule: string;
                driven_by_tactic: string;
                enforcement: "mandatory" | "guideline";
                brackets?: PolicyBracket[];
            }
            export interface PolicyBracket {
                condition: string;
                rule: string;
            }
            export interface Risk {
                id: string; // ^pc\.risk\.[a-z][a-z0-9-]*$
                description: string;
                probability: "low" | "medium" | "high";
                impact: "low" | "medium" | "high";
                /**
                 * Tactic or policy IDs that mitigate this risk
                 */
                mitigation: string[];
            }
            export interface Tactic {
                id: string; // ^pc\.tactic\.[a-z][a-z0-9-]*$
                title: string;
                description: string;
                /**
                 * Policy IDs driven by this tactic
                 */
                drives_policies: string[];
            }
        }
    }
}

export { Schemas };
