import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  MarkerType,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface PolicyCharterData {
  goals?: Array<{
    id: string;
    title?: string;
    description?: string;
    tactics?: string[];
  }>;
  tactics?: Array<{
    id: string;
    title?: string;
    description?: string;
    drives_policies?: string[];
  }>;
  policies?: Array<{
    id: string;
    title?: string;
    rule?: string;
  }>;
  risks?: Array<{
    id: string;
    description?: string;
    probability?: number;
    impact?: number;
    mitigation?: string[];
  }>;
}

interface PolicyCharterVisualizerProps {
  charter: PolicyCharterData;
}

const PolicyCharterVisualizer: React.FC<PolicyCharterVisualizerProps> = ({ charter }) => {
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    const levelSpacing = 280;
    const nodeWidth = 250;
    const horizontalSpacing = 100;

    const goals = charter.goals || [];
    const tactics = charter.tactics || [];
    const policies = charter.policies || [];
    const risks = charter.risks || [];

    // Create a tree structure to organize nodes
    const treeStructure: Record<string, { tactics: any[]; policies: any[]; width: number }> = {};

    // Initialize goals in tree
    goals.forEach(goal => {
      treeStructure[goal.id] = {
        tactics: tactics.filter(tactic => goal.tactics?.includes(tactic.id)) || [],
        policies: [],
        width: 0
      };
    });

    // Add policies to tactics
    tactics.forEach(tactic => {
      const tacticPolicies = policies.filter(policy => tactic.drives_policies?.includes(policy.id)) || [];
      const parentGoal = goals.find(goal => goal.tactics?.includes(tactic.id));
      if (parentGoal) {
        treeStructure[parentGoal.id].policies.push(...tacticPolicies);
      }
    });

    // Calculate widths for each goal branch
    goals.forEach(goal => {
      const branch = treeStructure[goal.id];
      const tacticsCount = Math.max(branch.tactics.length, 1);
      const policiesCount = Math.max(branch.policies.length, 1);
      const risksCount = risks.length;
      branch.width = Math.max(
        tacticsCount * (nodeWidth + horizontalSpacing),
        policiesCount * (nodeWidth + horizontalSpacing),
        risksCount > 0 ? risksCount * (nodeWidth + horizontalSpacing) : 0
      );
    });

    // Position goals at the top (Level 0)
    let currentX = 0;
    goals.forEach((goal) => {
      const branchWidth = treeStructure[goal.id].width;
      const x = currentX + branchWidth / 2 - nodeWidth / 2;

      nodes.push({
        id: goal.id,
        type: 'default',
        position: { x, y: 50 },
        data: {
          label: (
            <div className="node-content">
              <div className="node-type">Goal</div>
              <div className="node-title">{goal.title}</div>
              <div className="node-description">{goal.description}</div>
            </div>
          ),
        },
        style: { background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: '8px', width: nodeWidth },
      });

      currentX += branchWidth + 150;
    });

    // Position tactics (Level 1)
    goals.forEach((goal) => {
      const branch = treeStructure[goal.id];
      const goalNode = nodes.find(n => n.id === goal.id);
      if (!goalNode) return;

      const goalCenterX = goalNode.position.x + nodeWidth / 2;
      const tacticsCount = branch.tactics.length;

      branch.tactics.forEach((tactic, tacticIndex) => {
        let tacticX;
        if (tacticsCount === 1) {
          tacticX = goalCenterX - nodeWidth / 2;
        } else {
          const totalWidth = (tacticsCount - 1) * (nodeWidth + horizontalSpacing);
          const startX = goalCenterX - totalWidth / 2;
          tacticX = startX + tacticIndex * (nodeWidth + horizontalSpacing);
        }

        nodes.push({
          id: tactic.id,
          type: 'default',
          position: { x: tacticX, y: 50 + levelSpacing },
          data: {
            label: (
              <div className="node-content">
                <div className="node-type">Tactic</div>
                <div className="node-title">{tactic.title}</div>
                <div className="node-description">{tactic.description}</div>
              </div>
            ),
          },
          style: { background: '#D1FAE5', border: '2px solid #10B981', borderRadius: '8px', width: nodeWidth },
        });
      });
    });

    // Position policies (Level 2)
    goals.forEach((goal) => {
      const branch = treeStructure[goal.id];
      const goalNode = nodes.find(n => n.id === goal.id);
      if (!goalNode) return;

      const goalCenterX = goalNode.position.x + nodeWidth / 2;
      const policiesCount = branch.policies.length;

      if (policiesCount > 0) {
        branch.policies.forEach((policy, policyIndex) => {
          let policyX;
          if (policiesCount === 1) {
            policyX = goalCenterX - nodeWidth / 2;
          } else {
            const totalWidth = (policiesCount - 1) * (nodeWidth + horizontalSpacing);
            const startX = goalCenterX - totalWidth / 2;
            policyX = startX + policyIndex * (nodeWidth + horizontalSpacing);
          }

          nodes.push({
            id: policy.id,
            type: 'default',
            position: { x: policyX, y: 50 + levelSpacing * 2 },
            data: {
              label: (
                <div className="node-content">
                  <div className="node-type">Policy</div>
                  <div className="node-title">{policy.title}</div>
                  <div className="node-description">{policy.rule}</div>
                </div>
              ),
            },
            style: { background: '#E9D5FF', border: '2px solid #8B5CF6', borderRadius: '8px', width: nodeWidth },
          });
        });
      }
    });

    // Position risks at the bottom (Level 3)
    if (risks.length > 0) {
      const totalWidth = (risks.length - 1) * (nodeWidth + horizontalSpacing);
      const startX = (currentX - 150 - totalWidth) / 2;

      risks.forEach((risk, index) => {
        const riskX = startX + index * (nodeWidth + horizontalSpacing);

        nodes.push({
          id: risk.id,
          type: 'default',
          position: { x: riskX, y: 50 + levelSpacing * 3 },
          data: {
            label: (
              <div className="node-content">
                <div className="node-type">Risk</div>
                <div className="node-title">{risk.description}</div>
                <div className="node-description">P: {risk.probability} | I: {risk.impact}</div>
              </div>
            ),
          },
          style: { background: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px', width: nodeWidth },
        });
      });
    }

    return nodes;
  }, [charter]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    // Connect goals to tactics
    charter.goals?.forEach((goal) => {
      goal.tactics?.forEach((tacticId) => {
        edges.push({
          id: `${goal.id}-${tacticId}`,
          source: goal.id,
          target: tacticId,
          type: 'smoothstep',
          style: { stroke: '#3B82F6', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
        });
      });
    });

    // Connect tactics to policies
    charter.tactics?.forEach((tactic) => {
      tactic.drives_policies?.forEach((policyId) => {
        edges.push({
          id: `${tactic.id}-${policyId}`,
          source: tactic.id,
          target: policyId,
          type: 'smoothstep',
          style: { stroke: '#10B981', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
        });
      });
    });

    // Connect policies to risks (mitigation relationships)
    charter.policies?.forEach((policy) => {
      charter.risks?.forEach((risk) => {
        if (risk.mitigation?.includes(policy.id)) {
          edges.push({
            id: `${policy.id}-${risk.id}`,
            source: policy.id,
            target: risk.id,
            type: 'smoothstep',
            style: { stroke: '#EF4444', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
            label: 'mitigates',
          });
        }
      });
    });

    return edges;
  }, [charter]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="policy-charter-visualizer">
      <style>{`
        .policy-charter-visualizer {
          width: 100%;
          height: 600px;
        }
        .policy-charter-visualizer .react-flow {
          background: #f8fafc;
          border-radius: 8px;
        }
        .policy-charter-visualizer .node-content {
          padding: 8px;
          max-width: 230px;
          text-align: left;
        }
        .policy-charter-visualizer .node-type {
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 4px;
        }
        .policy-charter-visualizer .node-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 4px;
          line-height: 1.3;
          color: #1a1a1a;
        }
        .policy-charter-visualizer .node-description {
          font-size: 10px;
          color: #666;
          line-height: 1.2;
        }
        .policy-charter-visualizer .react-flow__node {
          cursor: grab;
        }
        .policy-charter-visualizer .react-flow__node:active {
          cursor: grabbing;
        }
        .policy-charter-visualizer .react-flow__controls {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .policy-charter-visualizer .react-flow__minimap {
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.id.includes('goal')) return '#3B82F6';
            if (node.id.includes('tactic')) return '#10B981';
            if (node.id.includes('policy')) return '#8B5CF6';
            if (node.id.includes('risk')) return '#EF4444';
            return '#6B7280';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default PolicyCharterVisualizer;