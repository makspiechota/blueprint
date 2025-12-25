import * as path from 'path';
import * as fs from 'fs';
import {
  parseNorthStar,
  parseLeanCanvas,
  parseArchitecturalScope,
  parseLeanViability,
  parseAARRRMetrics,
  parsePolicyCharter,
  parseBusiness
} from './index';
import { OrchestratedBusiness, ValidationResult, TraceabilityNode, TraceabilityEdge, TraceabilityGraph } from './types';
import { validateCrossLayerReferences } from './validator';

/**
 * Resolves a relative path from the business file's directory
 */
function resolveLayerPath(businessFilePath: string, layerRef?: string): string | undefined {
  if (!layerRef) {
    return undefined;
  }

  const businessDir = path.dirname(businessFilePath);
  return path.resolve(businessDir, layerRef);
}

/**
 * Parses an orchestrated business file, loading and validating all referenced layers
 */
export function parseOrchestratedBusiness(filePath: string): OrchestratedBusiness {
  // Parse the main business file
  const business = parseBusiness(filePath);

  // Prepare the result object
  const result: OrchestratedBusiness = {
    business
  };

  // Resolve and parse each layer if referenced
  if (business.north_star_ref) {
    const northStarPath = resolveLayerPath(filePath, business.north_star_ref);
    if (northStarPath && fs.existsSync(northStarPath)) {
      result.northStar = parseNorthStar(northStarPath);
    }
  }

  if (business.lean_canvas_ref) {
    const leanCanvasPath = resolveLayerPath(filePath, business.lean_canvas_ref);
    if (leanCanvasPath && fs.existsSync(leanCanvasPath)) {
      result.leanCanvas = parseLeanCanvas(leanCanvasPath);
    }
  }

  if (business.architectural_scope_ref) {
    const architecturalScopePath = resolveLayerPath(filePath, business.architectural_scope_ref);
    if (architecturalScopePath && fs.existsSync(architecturalScopePath)) {
      result.architecturalScope = parseArchitecturalScope(architecturalScopePath);
    }
  }

  if (business.lean_viability_ref) {
    const leanViabilityPath = resolveLayerPath(filePath, business.lean_viability_ref);
    if (leanViabilityPath && fs.existsSync(leanViabilityPath)) {
      result.leanViability = parseLeanViability(leanViabilityPath);
    }
  }

  if (business.aaarr_ref) {
    const aaarrPath = resolveLayerPath(filePath, business.aaarr_ref);
    if (aaarrPath && fs.existsSync(aaarrPath)) {
      result.aaarr = parseAARRRMetrics(aaarrPath);
    }
  }

  if (business.policy_charter_ref) {
    const policyCharterPath = resolveLayerPath(filePath, business.policy_charter_ref);
    if (policyCharterPath && fs.existsSync(policyCharterPath)) {
      result.policyCharter = parsePolicyCharter(policyCharterPath);
    }
  }

  return result;
}

/**
 * Validates an orchestrated business for cross-layer consistency
 */
export function validateOrchestratedBusiness(orchestrated: OrchestratedBusiness): ValidationResult {
  return validateCrossLayerReferences(orchestrated);
}

/**
 * Builds a traceability graph from an orchestrated business
 */
export function buildTraceabilityGraph(orchestrated: OrchestratedBusiness): TraceabilityGraph {
  const nodes: TraceabilityNode[] = [];
  const edges: TraceabilityEdge[] = [];

  // Maps to track references to node IDs
  const archScopeGoalMap: { [title: string]: string } = {};
  const policyTacticMap: { [id: string]: string } = {};
  const policyPolicyMap: { [id: string]: string } = {};
  const policyKpiMap: { [id: string]: string } = {};
  const policyRiskMap: { [id: string]: string } = {};

  // Helper to add node if not exists
  const addNode = (id: string, layer: string, type: string, title: string, description?: string, data?: any) => {
    if (!nodes.find(n => n.id === id)) {
      nodes.push({
        id,
        layer,
        type,
        title,
        description,
        data: data || {}
      });
    }
  };

  // Helper to add edge
  const addEdge = (source: string, target: string, type: string, strength: number = 5, metadata?: any) => {
    edges.push({
      source,
      target,
      type,
      strength,
      metadata
    });
  };

  // Add business node
  addNode('business', 'business', 'business', orchestrated.business.title, 'Main business orchestration', orchestrated.business);

  // Process North Star
  if (orchestrated.northStar) {
    const ns = orchestrated.northStar;
    addNode('north-star', 'north-star', 'north-star', ns.title, `${ns.vision} - ${ns.problem}`, ns);
    addEdge('business', 'north-star', 'references', 10);

    // Add strategic goals
    ns.strategic_goals.forEach((goal, index) => {
      const goalId = `north-star.goal.${index}`;
      addNode(goalId, 'north-star', 'strategic-goal', goal.title, goal.description, goal);
      addEdge('north-star', goalId, 'contains', 10);
    });
  }

  // Process Lean Canvas
  if (orchestrated.leanCanvas) {
    const lc = orchestrated.leanCanvas;
    addNode('lean-canvas', 'lean-canvas', 'lean-canvas', lc.title, 'Lean business model canvas', lc);
    addEdge('business', 'lean-canvas', 'references', 9);

    // Add problem
    if (lc.problem) {
      const problem = lc.problem;
      addNode('lean-canvas.problem', 'lean-canvas', 'problem', 'Problem', problem.existing_alternatives || '', problem);
      addEdge('lean-canvas', 'lean-canvas.problem', 'contains', 9);

      problem.top_3_problems?.forEach((p, index) => {
        const id = `lean-canvas.problem.${index}`;
        addNode(id, 'lean-canvas', 'problem-item', p, '', { problem: p });
        addEdge('lean-canvas.problem', id, 'contains', 8);
      });
    }

    // Add solution
    if (lc.solution) {
      const solution = lc.solution;
      addNode('lean-canvas.solution', 'lean-canvas', 'solution', 'Solution', '', solution);
      addEdge('lean-canvas', 'lean-canvas.solution', 'contains', 9);

      solution.top_3_features?.forEach((f, index) => {
        const id = `lean-canvas.solution.${index}`;
        addNode(id, 'lean-canvas', 'solution-feature', f, '', { feature: f });
        addEdge('lean-canvas.solution', id, 'contains', 8);
      });
    }

    // Add unique value proposition
    if (lc.unique_value_proposition) {
      const uvp = lc.unique_value_proposition;
      addNode('lean-canvas.uvp', 'lean-canvas', 'uvp', uvp.single_clear_message || 'UVP', uvp.high_level_concept || '', uvp);
      addEdge('lean-canvas', 'lean-canvas.uvp', 'contains', 9);
    }

    // Add unfair advantage
    if (lc.unfair_advantage) {
      const ua = lc.unfair_advantage;
      addNode('lean-canvas.ua', 'lean-canvas', 'unfair-advantage', ua.cant_be_copied || 'Unfair Advantage', '', ua);
      addEdge('lean-canvas', 'lean-canvas.ua', 'contains', 9);
    }

    // Add channels
    if (lc.channels) {
      const channels = lc.channels;
      addNode('lean-canvas.channels', 'lean-canvas', 'channels', 'Channels', '', channels);
      addEdge('lean-canvas', 'lean-canvas.channels', 'contains', 8);

      channels.path_to_customers?.forEach((channel, index) => {
        const id = `lean-canvas.channel.${index}`;
        addNode(id, 'lean-canvas', 'channel', channel, '', { channel });
        addEdge('lean-canvas.channels', id, 'contains', 7);
      });
    }

    // Add customer segments
    if (lc.customer_segments) {
      const segments = lc.customer_segments;
      addNode('lean-canvas.segments', 'lean-canvas', 'customer-segments', 'Customer Segments', `${segments.target_customers || ''} - ${segments.early_adopters || ''}`, segments);
      addEdge('lean-canvas', 'lean-canvas.segments', 'contains', 8);
    }

    // Add cost structure
    if (lc.cost_structure) {
      const costs = lc.cost_structure;
      addNode('lean-canvas.costs', 'lean-canvas', 'cost-structure', 'Cost Structure', '', costs);
      addEdge('lean-canvas', 'lean-canvas.costs', 'contains', 7);

      // Add individual cost items
      if (costs.customer_acquisition_cost) {
        addNode('lean-canvas.cost.cac', 'lean-canvas', 'cost-item', 'Customer Acquisition Cost', costs.customer_acquisition_cost, { cost: costs.customer_acquisition_cost });
        addEdge('lean-canvas.costs', 'lean-canvas.cost.cac', 'contains', 7);
      }
      if (costs.distribution_costs) {
        addNode('lean-canvas.cost.distribution', 'lean-canvas', 'cost-item', 'Distribution Costs', costs.distribution_costs, { cost: costs.distribution_costs });
        addEdge('lean-canvas.costs', 'lean-canvas.cost.distribution', 'contains', 7);
      }
      if (costs.hosting_costs) {
        addNode('lean-canvas.cost.hosting', 'lean-canvas', 'cost-item', 'Hosting Costs', costs.hosting_costs, { cost: costs.hosting_costs });
        addEdge('lean-canvas.costs', 'lean-canvas.cost.hosting', 'contains', 7);
      }
      if (costs.people_costs) {
        addNode('lean-canvas.cost.people', 'lean-canvas', 'cost-item', 'People Costs', costs.people_costs, { cost: costs.people_costs });
        addEdge('lean-canvas.costs', 'lean-canvas.cost.people', 'contains', 7);
      }
    }

    // Add revenue streams
    if (lc.revenue_streams) {
      const revenue = lc.revenue_streams;
      addNode('lean-canvas.revenue', 'lean-canvas', 'revenue-streams', 'Revenue Streams', `${revenue.revenue_model || ''} - ${revenue.lifetime_value || ''}`, revenue);
      addEdge('lean-canvas', 'lean-canvas.revenue', 'contains', 7);
    }

    // Add key metrics
    if (lc.key_metrics) {
      const metrics = lc.key_metrics;
      addNode('lean-canvas.metrics', 'lean-canvas', 'key-metrics', 'Key Metrics', '', metrics);
      addEdge('lean-canvas', 'lean-canvas.metrics', 'contains', 8);

      metrics.activities_to_measure?.forEach((metric, index) => {
        const id = `lean-canvas.metric.${index}`;
        addNode(id, 'lean-canvas', 'key-metric', metric, '', { metric });
        addEdge('lean-canvas.metrics', id, 'contains', 8);
      });
    }
  }

  // Process Architectural Scope
  if (orchestrated.architecturalScope) {
    const scope = orchestrated.architecturalScope;
    addNode('architectural-scope', 'architectural-scope', 'architectural-scope', scope.title, 'Architectural scope definition', scope);
    addEdge('business', 'architectural-scope', 'references', 9);

    if (orchestrated.northStar) {
      addEdge('architectural-scope', 'north-star', 'references', 8);
    }

    // Add WHY (mission and goals)
    if (scope.why) {
      if (scope.why.mission) {
        const mission = scope.why.mission;
        const missionId = 'architectural-scope.mission';
        addNode(missionId, 'architectural-scope', 'mission', `Mission: ${mission.action} ${mission.service} for ${mission.beneficiary}`, '', mission);
        addEdge('architectural-scope', missionId, 'contains', 10);
      }

      scope.why.goals?.forEach((goal, index) => {
        const goalId = `architectural-scope.goal.${index}`;
        addNode(goalId, 'architectural-scope', 'scope-goal', goal.title, goal.description, goal);
        addEdge('architectural-scope', goalId, 'contains', 9);

        // Map goal title to node ID for Policy Charter references
        archScopeGoalMap[goal.title] = goalId;
      });
    }

    // Add WHAT
    scope.what?.forEach((item, index) => {
      const id = `architectural-scope.what.${index}`;
      addNode(id, 'architectural-scope', 'what', item.title, item.description, item);
      addEdge('architectural-scope', id, 'contains', 8);
    });

    // Add HOW
    scope.how?.forEach((item, index) => {
      const id = `architectural-scope.how.${index}`;
      addNode(id, 'architectural-scope', 'how', item.title, item.description, item);
      addEdge('architectural-scope', id, 'contains', 8);
    });

    // Add WHERE
    scope.where?.forEach((item, index) => {
      const id = `architectural-scope.where.${index}`;
      addNode(id, 'architectural-scope', 'where', item.title, item.description, item);
      addEdge('architectural-scope', id, 'contains', 8);
    });

    // Add WHO
    scope.who?.forEach((item, index) => {
      const id = `architectural-scope.who.${index}`;
      addNode(id, 'architectural-scope', 'who', item.title, item.description, item);
      addEdge('architectural-scope', id, 'contains', 8);
    });

    // Add WHEN
    scope.when?.forEach((item, index) => {
      const id = `architectural-scope.when.${index}`;
      addNode(id, 'architectural-scope', 'when', item.title, item.description, item);
      addEdge('architectural-scope', id, 'contains', 8);
    });
  }

  // Process Lean Viability
  if (orchestrated.leanViability) {
    const lv = orchestrated.leanViability;
    addNode('lean-viability', 'lean-viability', 'lean-viability', lv.title, 'Lean viability calculations', lv);
    addEdge('business', 'lean-viability', 'references', 8);

    // Add calculations
    Object.keys(lv.calculations || {}).forEach(key => {
      const calc = (lv.calculations as any)[key];
      const id = `lean-viability.calculations.${key}`;
      addNode(id, 'lean-viability', 'calculation', key, `Calculated value: ${calc}`, { key, value: calc });
      addEdge('lean-viability', id, 'contains', 9);
    });

    // Add targets
    Object.keys(lv.targets || {}).forEach(key => {
      const target = (lv.targets as any)[key];
      const id = `lean-viability.target.${key}`;
      addNode(id, 'lean-viability', 'target', key, `Target value: ${target}`, { key, value: target });
      addEdge('lean-viability', id, 'contains', 9);
    });
  }

  // Process AAARR Metrics
  if (orchestrated.aaarr) {
    const aaarr = orchestrated.aaarr;
    addNode('aaarr-metrics', 'aaarr-metrics', 'aaarr-metrics', aaarr.title, 'AAARR customer factory metrics', aaarr);
    addEdge('business', 'aaarr-metrics', 'references', 8);

    // Add stage nodes
    Object.keys(aaarr.stages || {}).forEach(stageKey => {
      const stage = (aaarr.stages as any)[stageKey];
      const stageId = `aaarr-metrics.${stageKey}`;
      addNode(stageId, 'aaarr-metrics', 'stage', stageKey, stage.stage_goal, { stage: stageKey, goal: stage.stage_goal });
      addEdge('aaarr-metrics', stageId, 'contains', 9);
    });

    if (orchestrated.leanViability) {
      addEdge('aaarr-metrics', 'lean-viability', 'references', 7);
    }

    if (orchestrated.northStar) {
      addEdge('aaarr-metrics', 'north-star', 'references', 6);
    }

    // Add metrics by stage
    Object.keys(aaarr.stages || {}).forEach(stageKey => {
      const stage = (aaarr.stages as any)[stageKey];
      stage.metrics?.forEach((metric: any, index: number) => {
        const metricId = metric.id || `aaarr-metrics.${stageKey}.${index}`;
        addNode(metricId, 'aaarr-metrics', 'metric', metric.name, metric.description, metric);
        addEdge(`aaarr-metrics.${stageKey}`, metricId, 'contains', 9);

        // Connect imported_from references
        if (metric.target?.imported_from) {
          addEdge(metricId, metric.target.imported_from, 'imported_from', 8, { imported_from: metric.target.imported_from });
        }
        if (metric.current?.imported_from) {
          addEdge(metricId, metric.current.imported_from, 'imported_from', 8, { imported_from: metric.current.imported_from });
        }
      });
    });
  }

  // Process Policy Charter
  if (orchestrated.policyCharter) {
    const pc = orchestrated.policyCharter;
    addNode('policy-charter', 'policy-charter', 'policy-charter', pc.title, 'Policy charter for operational governance', pc);
    addEdge('business', 'policy-charter', 'references', 8);

    if (orchestrated.architecturalScope) {
      addEdge('policy-charter', 'architectural-scope', 'references', 7);
    }

    if (orchestrated.aaarr) {
      addEdge('policy-charter', 'aaarr-metrics', 'references', 7);
    }

    // Add goals
    pc.goals?.forEach((goal, index) => {
      const goalId = `policy-charter.goal.${index}`;
      addNode(goalId, 'policy-charter', 'policy-goal', goal.title, goal.description, goal);
      addEdge('policy-charter', goalId, 'contains', 10);

      // Connect addresses
      goal.addresses?.forEach(address => {
        const targetId = archScopeGoalMap[address];
        if (targetId) {
          addEdge(goalId, targetId, 'addresses', 9, { addressed_goal: address });
        }
      });

      // Connect aaarr_impact
      goal.aaarr_impact?.forEach(impact => {
        const stageNodeId = `aaarr-metrics.${impact}`;
        addEdge(goalId, stageNodeId, 'impacts', 7, { aaarr_stage: impact });
      });

      // Connect tactics
      goal.tactics?.forEach(tacticId => {
        const tacticNodeId = policyTacticMap[tacticId];
        if (tacticNodeId) {
          addEdge(goalId, tacticNodeId, 'drives', 8, { tactic: tacticId });
        }
      });

      // Connect policies
      goal.policies?.forEach(policyId => {
        const policyNodeId = policyPolicyMap[policyId];
        if (policyNodeId) {
          addEdge(goalId, policyNodeId, 'requires', 8, { policy: policyId });
        }
      });

      // Connect KPIs
      goal.kpis?.forEach(kpiId => {
        const kpiNodeId = policyKpiMap[kpiId];
        if (kpiNodeId) {
          addEdge(goalId, kpiNodeId, 'measures', 7, { kpi: kpiId });
        }
      });

      // Connect risks
      goal.risks?.forEach(riskId => {
        const riskNodeId = policyRiskMap[riskId];
        if (riskNodeId) {
          addEdge(goalId, riskNodeId, 'mitigates', 6, { risk: riskId });
        }
      });
    });

    // Add tactics
    pc.tactics?.forEach((tactic, index) => {
      const tacticId = `policy-charter.tactic.${index}`;
      addNode(tacticId, 'policy-charter', 'tactic', tactic.title, tactic.description, tactic);
      addEdge('policy-charter', tacticId, 'contains', 9);

      // Map tactic ID to node ID
      if (tactic.id) {
        policyTacticMap[tactic.id] = tacticId;
      }
    });

    // Add policies
    pc.policies?.forEach((policy, index) => {
      const policyId = `policy-charter.policy.${index}`;
      addNode(policyId, 'policy-charter', 'policy', policy.title, policy.rule, policy);
      addEdge('policy-charter', policyId, 'contains', 9);

      // Map policy ID to node ID
      if (policy.id) {
        policyPolicyMap[policy.id] = policyId;
      }

      // Connect driven_by_tactic
      if (policy.driven_by_tactic) {
        const tacticId = policyTacticMap[policy.driven_by_tactic];
        if (tacticId) {
          addEdge(policyId, tacticId, 'driven_by', 8, { driven_by_tactic: policy.driven_by_tactic });
        }
      }
    });

    // Add KPIs
    pc.kpis?.forEach((kpi, index) => {
      const kpiId = `policy-charter.kpi.${index}`;
      addNode(kpiId, 'policy-charter', 'kpi', kpi.name, `Target: ${kpi.target}, Current: ${kpi.current}`, kpi);
      addEdge('policy-charter', kpiId, 'contains', 8);

      // Map KPI ID to node ID
      if (kpi.id) {
        policyKpiMap[kpi.id] = kpiId;
      }

      // Connect justification
      if (kpi.justification) {
        // justification is like "aaarr.activation.first-response"
        addEdge(kpiId, kpi.justification, 'justified_by', 7, { justification: kpi.justification });
      }
    });

    // Add risks
    pc.risks?.forEach((risk, index) => {
      const riskId = `policy-charter.risk.${index}`;
      addNode(riskId, 'policy-charter', 'risk', risk.description, `Probability: ${risk.probability}, Impact: ${risk.impact}`, risk);
      addEdge('policy-charter', riskId, 'contains', 7);

      // Map risk ID to node ID
      if (risk.id) {
        policyRiskMap[risk.id] = riskId;
      }
    });
  }

  return { nodes, edges };
}