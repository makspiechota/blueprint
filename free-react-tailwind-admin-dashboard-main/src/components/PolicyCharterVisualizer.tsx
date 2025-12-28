import React, { useCallback, useEffect, useMemo } from 'react';
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
import ChatButton from './ChatButton';
import { useChat } from '../context/ChatContext';

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
    enforcement?: string;
    driven_by_tactic?: string;
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
  const { openChat } = useChat();

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

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
              <div className="node-type"><span>🎯</span> Goal</div>
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
                <div className="node-type"><span>📝</span> Tactic</div>
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
                  <div className="node-type"><span>☂️</span> Policy</div>
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
                <div className="node-type"><span>⛈️</span> Risk</div>
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

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => setNodes(initialNodes), [initialNodes, setNodes]);
  useEffect(() => setEdges(initialEdges), [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="space-y-6">
      <div className="policy-charter-visualizer relative">
        <ChatButton
          resourceType="policy-charter-overview"
          resourceData={{ title: 'Policy Charter Overview', content: charter }}
          onClick={handleChatClick}
        />
        <style>{`
          .policy-charter-visualizer {
            width: 100%;
            height: 600px;
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

      {/* Legend */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Ronald Ross Framework Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span><strong>Goals</strong> - Strategic objectives</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span><strong>Tactics</strong> - Implementation approaches</span>
          </div>
          <div className="flex items-center gap-2">
            <span>☂️</span>
            <span><strong>Policies</strong> - Operational rules</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⛈️</span>
            <span><strong>Risks</strong> - Mitigation targets</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
          <strong>Flow:</strong> Goals drive Tactics → Tactics implement Policies → Policies mitigate Risks
        </div>
      </div>

      {/* Policy Details Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Panel */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🎯</span>
            Strategic Goals
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {charter.goals?.map((goal, index) => (
              <div key={index} className="p-3 border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">{goal.title}</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">{goal.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {goal.tactics?.map((tactic, idx) => (
                    <span key={idx} className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      {tactic.replace('pc.tactic.', '')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactics Panel */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📝</span>
            Implementation Tactics
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {charter.tactics?.map((tactic, index) => (
              <div key={index} className="p-3 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">{tactic.title}</h4>
                <p className="text-sm text-green-700 dark:text-green-300">{tactic.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tactic.drives_policies?.map((policy, idx) => (
                    <span key={idx} className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      {policy.replace('pc.policy.', '')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policies Panel */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>☂️</span>
            Operational Policies
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {charter.policies?.map((policy, index) => (
              <div key={index} className="p-3 border border-purple-200 dark:border-purple-700 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">{policy.title}</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">{policy.rule}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    {policy.enforcement || 'Manual'}
                  </span>
                  <span className="text-xs text-gray-500">
                    From: {policy.driven_by_tactic?.replace('pc.tactic.', '') || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risks Panel */}
        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>⛈️</span>
            Risk Mitigation
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {charter.risks?.map((risk, index) => (
              <div key={index} className="p-3 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
                  Risk: <span>{risk.description}</span>
                </h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-red-700 dark:text-red-300">Probability: {risk.probability}</span>
                  <span className="text-xs text-red-700 dark:text-red-300">Impact: {risk.impact}</span>
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  <strong>Mitigation:</strong>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {risk.mitigation?.map((mitigation, idx) => (
                      <span key={idx} className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        {mitigation.replace('pc.tactic.', '').replace('pc.policy.', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyCharterVisualizer;