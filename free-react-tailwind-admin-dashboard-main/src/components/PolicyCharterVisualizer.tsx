import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const nodeWidth = 250;
  const levelSpacing = 320;
  const horizontalSpacing = 100;

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    const addedPolicyIds = new Set();
  const addedRiskIds = new Set();

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
        risks: [],
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

    // Add risks to tree
    goals.forEach(goal => {
      const branch = treeStructure[goal.id];
      branch.risks = risks.filter(r => r.mitigation.some(m => branch.policies.some(p => p.id === m)));
    });

    // Calculate widths for each goal branch
    goals.forEach(goal => {
      const branch = treeStructure[goal.id];
      const tacticsCount = Math.max(branch.tactics.length, 1);
      const policiesCount = Math.max(branch.policies.length, 1);
      const risksCount = Math.max(branch.risks.length, 1);
      branch.width = Math.max(
        tacticsCount * (nodeWidth + horizontalSpacing),
        policiesCount * (nodeWidth + horizontalSpacing),
        risksCount * (nodeWidth + horizontalSpacing)
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
          title: goal.title || 'Untitled Goal',
          description: goal.description || '',
        },
        style: { background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: '8px', width: nodeWidth },
      });

      currentX += branchWidth + 300;
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
            title: tactic.title || 'Untitled Tactic',
            description: tactic.description || '',
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
              title: policy.title || 'Untitled Policy',
              rule: policy.rule || '',
              description: policy.rule || '',
            },
            style: { background: '#E9D5FF', border: '2px solid #8B5CF6', borderRadius: '8px', width: nodeWidth },
          });
          addedPolicyIds.add(policy.id);
        });
      }

      // Position risks for this goal
      const risksCount = branch.risks.length;
      if (risksCount > 0) {
        branch.risks.forEach((risk, riskIndex) => {
          let riskX;
          if (risksCount === 1) {
            riskX = goalCenterX - nodeWidth / 2;
          } else {
            const totalWidth = (risksCount - 1) * (nodeWidth + horizontalSpacing);
            const startX = goalCenterX - totalWidth / 2;
            riskX = startX + riskIndex * (nodeWidth + horizontalSpacing);
          }

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
              description: risk.description || 'Untitled Risk',
              probability: risk.probability || 'low',
              impact: risk.impact || 'low',
            },
            style: { background: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px', width: nodeWidth },
          });
          addedRiskIds.add(risk.id);
        });
      }
    });

    // Position any remaining risks not under goals
    const remainingRisks = risks.filter(r => !addedRiskIds.has(r.id));
    if (remainingRisks.length > 0) {
      const centerX = currentX / 2;
      const riskSpacing = 300;
      const totalWidth = (remainingRisks.length - 1) * riskSpacing;
      const startX = centerX - totalWidth / 2;

      remainingRisks.forEach((risk, index) => {
        const riskX = startX + index * riskSpacing;

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
            description: risk.description || 'Untitled Risk',
            probability: risk.probability || 'low',
            impact: risk.impact || 'low',
          },
          style: { background: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px', width: nodeWidth },
        });
      });
    }

    // Add unlinked tactics
    const linkedTacticIds = new Set();
    charter.goals?.forEach(goal => goal.tactics?.forEach(t => linkedTacticIds.add(t)));
    const unlinkedTactics = charter.tactics?.filter(t => !linkedTacticIds.has(t.id)) || [];
    let xOffset = 0;
    unlinkedTactics.forEach(tactic => {
      nodes.push({
        id: tactic.id,
        type: 'default',
        position: { x: xOffset, y: levelSpacing },
        data: {
          label: (
            <div className="node-content">
              <div className="node-type"><span>📝</span> Tactic</div>
              <div className="node-title">{tactic.title}</div>
              <div className="node-description">{tactic.description}</div>
            </div>
          ),
          title: tactic.title || 'Untitled',
          description: tactic.description || '',
        },
        style: { background: '#D1FAE5', border: '2px solid #10B981', borderRadius: '8px', width: nodeWidth },
      });
      xOffset += nodeWidth + horizontalSpacing;
    });

    // Add unlinked policies
    const unlinkedPolicies = charter.policies?.filter(p => !addedPolicyIds.has(p.id)) || [];
    xOffset = 0;
    unlinkedPolicies.forEach(policy => {
      nodes.push({
        id: policy.id,
        type: 'default',
        position: { x: xOffset, y: levelSpacing * 2 },
        data: {
          label: (
            <div className="node-content">
              <div className="node-type"><span>☂️</span> Policy</div>
              <div className="node-title">{policy.title}</div>
              <div className="node-description">{policy.rule}</div>
            </div>
          ),
          title: policy.title || 'Untitled',
          rule: policy.rule || '',
          description: policy.rule || '',
        },
        style: { background: '#E9D5FF', border: '2px solid #8B5CF6', borderRadius: '8px', width: nodeWidth },
      });
      xOffset += nodeWidth + horizontalSpacing;
    });

    // Add unlinked risks
    const linkedRiskIds = new Set();
    charter.policies?.forEach(policy => charter.risks?.forEach(risk => {
      if (risk.mitigation?.includes(policy.id)) linkedRiskIds.add(risk.id);
    }));
    const unlinkedRisks = charter.risks?.filter(r => !linkedRiskIds.has(r.id)) || [];
    xOffset = 0;
    unlinkedRisks.forEach(risk => {
      nodes.push({
        id: risk.id,
        type: 'default',
        position: { x: xOffset, y: levelSpacing * 3 },
        data: {
          label: (
            <div className="node-content">
              <div className="node-type"><span>⛈️</span> Risk</div>
              <div className="node-title">{risk.description}</div>
              <div className="node-description">P: {risk.probability} | I: {risk.impact}</div>
            </div>
          ),
          description: risk.description || 'Untitled',
          probability: risk.probability || 'low',
          impact: risk.impact || 'low',
        },
        style: { background: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px', width: nodeWidth },
      });
      xOffset += nodeWidth + horizontalSpacing;
    });

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

    // Also connect based on policy.driven_by_tactic
    charter.policies?.forEach((policy) => {
      if (policy.driven_by_tactic) {
        const edgeId = `${policy.driven_by_tactic}-${policy.id}`;
        if (!edges.some(e => e.id === edgeId)) {
          edges.push({
            id: edgeId,
            source: policy.driven_by_tactic,
            target: policy.id,
            type: 'smoothstep',
            style: { stroke: '#10B981', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
          });
        }
      }
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

    // Connect tactics to risks (mitigation relationships)
    charter.tactics?.forEach((tactic) => {
      charter.risks?.forEach((risk) => {
        if (risk.mitigation?.includes(tactic.id)) {
          edges.push({
            id: `${tactic.id}-${risk.id}`,
            source: tactic.id,
            target: risk.id,
            type: 'smoothstep',
            style: { stroke: '#10B981', strokeWidth: 2, strokeDasharray: '5,5' },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
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
    (params: Connection) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => setSelectedNode(node), []);

  const addTactic = () => {
    const id = `pc.tactic.${Date.now()}`;
    const tacticCount = nodes.filter(n => n.id.includes('tactic')).length;
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: 300, y: 50 + levelSpacing + tacticCount * 50 },
      data: {
        label: (
          <div className="node-content">
            <div className="node-type"><span>📝</span> Tactic</div>
            <div className="node-title">New Tactic</div>
            <div className="node-description">Description</div>
          </div>
        ),
        title: 'New Tactic',
        description: 'Description',
      },
      style: { background: '#D1FAE5', border: '2px solid #10B981', borderRadius: '8px', width: nodeWidth },
    };
    setNodes(nds => nds.concat(newNode));
  };

  const addPolicy = () => {
    const id = `pc.policy.${Date.now()}`;
    const policyCount = nodes.filter(n => n.id.includes('policy')).length;
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: 400, y: 50 + levelSpacing * 2 + policyCount * 50 },
      data: {
        label: (
          <div className="node-content">
            <div className="node-type"><span>☂️</span> Policy</div>
            <div className="node-title">New Policy</div>
            <div className="node-description">Rule</div>
          </div>
        ),
        title: 'New Policy',
        rule: 'Rule',
        description: 'Rule',
      },
      style: { background: '#E9D5FF', border: '2px solid #8B5CF6', borderRadius: '8px', width: nodeWidth },
    };
    setNodes(nds => nds.concat(newNode));
  };

  const addRisk = () => {
    const id = `pc.risk.${Date.now()}`;
    const riskCount = nodes.filter(n => n.id.includes('risk')).length;
    const newNode: Node = {
      id,
      type: 'default',
      position: { x: 500, y: 50 + levelSpacing * 3 + riskCount * 50 },
      data: {
        label: (
          <div className="node-content">
            <div className="node-type"><span>⛈️</span> Risk</div>
            <div className="node-title">New Risk</div>
            <div className="node-description">P: low | I: low</div>
          </div>
        ),
        description: 'New Risk',
        probability: 'low',
        impact: 'low',
      },
      style: { background: '#FEE2E2', border: '2px solid #EF4444', borderRadius: '8px', width: nodeWidth },
    };
    setNodes(nds => nds.concat(newNode));
  };

  const buildDataFromNodesAndEdges = (nodes: Node[], edges: Edge[]) => {
    const goals: any[] = [];
    const tactics: any[] = [];
    const policies: any[] = [];
    const risks: any[] = [];

    nodes.forEach(node => {
      if (node.id.includes('goal')) {
        goals.push({
          id: node.id,
          title: node.data.title || 'Untitled',
          description: node.data.description || '',
        });
      } else if (node.id.includes('tactic')) {
        tactics.push({
          id: node.id,
          title: node.data.title || 'Untitled',
          description: node.data.description || '',
          drives_policies: [],
        });
      } else if (node.id.includes('policy')) {
        policies.push({
          id: node.id,
          title: node.data.title || 'Untitled',
          rule: node.data.rule || '',
          enforcement: 'manual',
          driven_by_tactic: '',
        });
    } else if (node.id.includes('risk')) {
      const mitigation = edges.filter(e => e.target === node.id && (e.source.includes('policy') || e.source.includes('tactic'))).map(e => e.source);
      risks.push({
        id: node.id,
        description: node.data.description || 'Untitled',
        probability: node.data.probability || 'low',
        impact: node.data.impact || 'low',
        mitigation,
      });
    }
    });

    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (source && target) {
        if (source.id.includes('goal') && target.id.includes('tactic')) {
          const goal = goals.find(g => g.id === source.id);
          if (goal) goal.tactics = goal.tactics || [];
          if (goal && !goal.tactics.includes(target.id)) goal.tactics.push(target.id);
        } else if (source.id.includes('tactic') && target.id.includes('policy')) {
          const tactic = tactics.find(t => t.id === source.id);
          if (tactic && !tactic.drives_policies.includes(target.id)) tactic.drives_policies.push(target.id);
          const policy = policies.find(p => p.id === target.id);
          if (policy) policy.driven_by_tactic = source.id;
        } else if (source.id.includes('policy') && target.id.includes('risk')) {
          const risk = risks.find(r => r.id === target.id);
          if (risk && !risk.mitigation.includes(source.id)) risk.mitigation.push(source.id);
        }
      }
    });

    return {
      type: 'policy-charter',
      version: '1.0',
      last_updated: new Date().toISOString().split('T')[0],
      title: 'Policy Charter',
      goals,
      tactics,
      policies,
      risks,
    };
  };

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
            margin-bottom: 60px;
          }
        `}</style>

        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={addTactic} className="px-3 py-2 bg-green-500 text-white rounded text-sm">Add Tactic</button>
          <button onClick={addPolicy} className="px-3 py-2 bg-purple-500 text-white rounded text-sm">Add Policy</button>
          <button onClick={addRisk} className="px-3 py-2 bg-red-500 text-white rounded text-sm">Add Risk</button>
          <button onClick={() => {
            // Build data and save
            const data = buildDataFromNodesAndEdges(nodes, edges);
            fetch('/api/yaml/policy-charter.yaml', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data }),
            }).then(() => {}).catch(() => alert('Save failed'));
          }} className="px-3 py-2 bg-blue-500 text-white rounded text-sm">Save Changes</button>
        </div>

        {selectedNode && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded shadow" style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 10, width: '300px' }}>
            <h3 className="font-semibold mb-2">Edit {selectedNode.type?.replace('Node', '')}</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={selectedNode.data.title || selectedNode.data.description || ''}
                onChange={(e) => {
                  setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, [n.type === 'riskNode' ? 'description' : 'title']: e.target.value } } : n));
                  setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, [prev.type === 'riskNode' ? 'description' : 'title']: e.target.value } } : null);
                }}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={selectedNode.data.description || selectedNode.data.rule || ''}
                onChange={(e) => {
                  setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, [n.type === 'policyNode' ? 'rule' : 'description']: e.target.value } } : n));
                  setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, [prev.type === 'policyNode' ? 'rule' : 'description']: e.target.value } } : null);
                }}
                className="w-full p-2 border rounded"
              />
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Connections</h4>
                <div className="space-y-2">
                  <div>
                    <h5 className="text-sm font-medium">Outgoing:</h5>
                    {edges.filter(e => e.source === selectedNode.id).map(e => (
                      <div key={e.id} className="flex justify-between items-center text-sm">
                        <span>To: {nodes.find(n => n.id === e.target)?.data.title || e.target}</span>
                        <button 
                          onClick={() => setEdges(eds => eds.filter(edge => edge.id !== e.id))} 
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Incoming:</h5>
                    {edges.filter(e => e.target === selectedNode.id).map(e => (
                      <div key={e.id} className="flex justify-between items-center text-sm">
                        <span>From: {nodes.find(n => n.id === e.source)?.data.title || e.source}</span>
                        <button 
                          onClick={() => setEdges(eds => eds.filter(edge => edge.id !== e.id))} 
                          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                disabled={edges.some(e => e.source === selectedNode.id)}
                onClick={() => {
                  setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
                  setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
                  setSelectedNode(null);
                }} 
                className="w-full px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
              >
                Delete Node
              </button>
              <button onClick={() => setSelectedNode(null)} className="w-full px-4 py-2 bg-gray-500 text-white rounded mt-2">Close</button>
            </div>
          </div>
        )}

        <ReactFlow
          onNodeClick={onNodeClick}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          deleteKeyCode="Delete"
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