import React, { useCallback, useMemo, useState } from 'react';
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
import { useBusinessData } from '../context/BusinessDataContext';

type ViewMode = 'graph' | 'list';

interface Task {
  id: string;
  name: string;
  status?: string;
  estimated_hours?: number;
  description?: string;
}

interface UserStory {
  id: string;
  name: string;
  status?: string;
  story_points?: number;
  description?: string;
  tasks?: Task[];
}

interface Feature {
  id: string;
  name: string;
  status?: string;
  description?: string;
  user_stories?: UserStory[];
}

interface Epic {
  id: string;
  name: string;
  status?: string;
  target_quarter?: string;
  description?: string;
  features?: Feature[];
}

interface RoadmapData {
  type?: string;
  productName?: string;
  title?: string;
  description?: string;
  epics?: Epic[];
}

interface RoadmapVisualizerProps {
  data: RoadmapData;
}

const nodeWidth = 220;
const levelSpacing = 150;
const horizontalSpacing = 40;

const getStatusStyle = (status?: string) => {
  switch (status) {
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'planned':
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const nodeStyles = {
  roadmap: { background: '#F3F4F6', border: '2px solid #6B7280' },
  epic: { background: '#DBEAFE', border: '2px solid #3B82F6' },
  feature: { background: '#D1FAE5', border: '2px solid #10B981' },
  story: { background: '#FEF3C7', border: '2px solid #F59E0B' },
  task: { background: '#E9D5FF', border: '2px solid #8B5CF6' },
};

const nodeIcons = {
  roadmap: '📋',
  epic: '🎯',
  feature: '⚡',
  story: '📖',
  task: '✓',
};

const edgeColors = {
  roadmap: '#6B7280',
  epic: '#3B82F6',
  feature: '#10B981',
  story: '#F59E0B',
  task: '#8B5CF6',
};

// Helper to create node label
const createNodeLabel = (type: string, name: string, status?: string, extra?: React.ReactNode) => (
  <div className="text-center p-2">
    <div className="text-xs text-gray-500">{nodeIcons[type as keyof typeof nodeIcons]} {type.charAt(0).toUpperCase() + type.slice(1)}</div>
    <div className="font-semibold text-sm truncate">{name}</div>
    <div className="flex justify-center gap-1 mt-1">
      <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusStyle(status)}`}>
        {status || 'planned'}
      </span>
      {extra}
    </div>
  </div>
);

// Tree item for list view
interface TreeItem {
  id: string;
  type: 'roadmap' | 'epic' | 'feature' | 'story' | 'task';
  name: string;
  status?: string;
  description?: string;
  target_quarter?: string;
  story_points?: number;
  estimated_hours?: number;
  children?: TreeItem[];
}

// Expandable tree node component
const TreeNode: React.FC<{
  item: TreeItem;
  level: number;
  selectedItem: TreeItem | null;
  onSelect: (item: TreeItem) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (id: string) => void;
}> = ({ item, level, selectedItem, onSelect, expandedNodes, onToggleExpand }) => {
  const isExpanded = expandedNodes.has(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedItem?.id === item.id;

  const typeColors = {
    roadmap: 'text-gray-600 dark:text-gray-300',
    epic: 'text-blue-600 dark:text-blue-400',
    feature: 'text-green-600 dark:text-green-400',
    story: 'text-amber-600 dark:text-amber-400',
    task: 'text-purple-600 dark:text-purple-400',
  };

  const bgColors = {
    roadmap: 'bg-gray-100 dark:bg-gray-700',
    epic: 'bg-blue-50 dark:bg-blue-900/30',
    feature: 'bg-green-50 dark:bg-green-900/30',
    story: 'bg-amber-50 dark:bg-amber-900/30',
    task: 'bg-purple-50 dark:bg-purple-900/30',
  };

  return (
    <div>
      <div
        className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
          isSelected ? bgColors[item.type] : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(item)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(item.id);
            }}
            className="w-5 h-5 flex items-center justify-center mr-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isExpanded ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        ) : (
          <span className="w-5 h-5 mr-1" />
        )}
        <span className={`mr-2 ${typeColors[item.type]}`}>
          {nodeIcons[item.type]}
        </span>
        <span className={`text-sm flex-1 truncate text-gray-900 dark:text-white ${isSelected ? 'font-medium' : ''}`}>
          {item.name}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusStyle(item.status)}`}>
          {item.status || 'planned'}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              selectedItem={selectedItem}
              onSelect={onSelect}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RoadmapVisualizer: React.FC<RoadmapVisualizerProps> = ({ data }) => {
  const { openChat } = useChat();
  const { productName, reloadRoadmap } = useBusinessData();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedListItem, setSelectedListItem] = useState<TreeItem | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['roadmap-root']));
  const [isSaving, setIsSaving] = useState(false);

  const handleChatClick = (resourceType: string, resourceData: any) => {
    openChat(resourceType, resourceData);
  };

  // Build tree data for list view
  const treeData: TreeItem | null = useMemo(() => {
    if (!data) return null;

    const buildTaskItem = (task: Task, epicId: string, featureId: string, storyId: string): TreeItem => ({
      id: `task-${epicId}-${featureId}-${storyId}-${task.id}`,
      type: 'task',
      name: task.name,
      status: task.status,
      description: task.description,
      estimated_hours: task.estimated_hours,
    });

    const buildStoryItem = (story: UserStory, epicId: string, featureId: string): TreeItem => ({
      id: `story-${epicId}-${featureId}-${story.id}`,
      type: 'story',
      name: story.name,
      status: story.status,
      description: story.description,
      story_points: story.story_points,
      children: story.tasks?.map((t) => buildTaskItem(t, epicId, featureId, story.id)),
    });

    const buildFeatureItem = (feature: Feature, epicId: string): TreeItem => ({
      id: `feature-${epicId}-${feature.id}`,
      type: 'feature',
      name: feature.name,
      status: feature.status,
      description: feature.description,
      children: feature.user_stories?.map((s) => buildStoryItem(s, epicId, feature.id)),
    });

    const buildEpicItem = (epic: Epic): TreeItem => ({
      id: `epic-${epic.id}`,
      type: 'epic',
      name: epic.name,
      status: epic.status,
      description: epic.description,
      target_quarter: epic.target_quarter,
      children: epic.features?.map((f) => buildFeatureItem(f, epic.id)),
    });

    return {
      id: 'roadmap-root',
      type: 'roadmap',
      name: data.title || 'Product Roadmap',
      description: data.description,
      children: data.epics?.map(buildEpicItem),
    };
  }, [data]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (!treeData) return;
    const allIds = new Set<string>();
    const collectIds = (item: TreeItem) => {
      allIds.add(item.id);
      item.children?.forEach(collectIds);
    };
    collectIds(treeData);
    setExpandedNodes(allIds);
  }, [treeData]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set(['roadmap-root']));
  }, []);

  // Calculate initial layout from data
  const calculateLayout = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!data) {
      return { nodes, edges };
    }

    const epics = data.epics || [];

    // Calculate subtree widths
    const calculateSubtreeWidth = (epic: Epic): number => {
      if (!epic.features || epic.features.length === 0) return nodeWidth;
      let totalWidth = 0;
      epic.features.forEach(feature => {
        const storiesWidth = feature.user_stories
          ? feature.user_stories.reduce((acc, story) => {
              const tasksWidth = story.tasks
                ? Math.max(story.tasks.length * (nodeWidth + horizontalSpacing), nodeWidth)
                : nodeWidth;
              return acc + tasksWidth + horizontalSpacing;
            }, 0)
          : nodeWidth;
        totalWidth += Math.max(storiesWidth, nodeWidth) + horizontalSpacing;
      });
      return Math.max(totalWidth, nodeWidth);
    };

    const epicWidths = epics.map(epic => calculateSubtreeWidth(epic));
    const totalWidth = Math.max(epicWidths.reduce((a, b) => a + b, 0) + (epics.length - 1) * horizontalSpacing * 2, nodeWidth);

    // Root node
    const rootX = totalWidth / 2 - nodeWidth / 2;
    nodes.push({
      id: 'roadmap-root',
      type: 'default',
      position: { x: rootX, y: 0 },
      data: {
        label: createNodeLabel('roadmap', data.title || 'Product Roadmap'),
        title: data.title,
        description: data.description,
        type: 'roadmap',
        name: data.title || 'Product Roadmap',
      },
      style: { ...nodeStyles.roadmap, borderRadius: '8px', width: nodeWidth },
    });

    // Position epics and their children
    let epicStartX = 0;
    epics.forEach((epic, epicIndex) => {
      const epicWidth = epicWidths[epicIndex];
      const epicX = epicStartX + epicWidth / 2 - nodeWidth / 2;
      const epicY = levelSpacing;
      const epicId = `epic-${epic.id}`;

      nodes.push({
        id: epicId,
        type: 'default',
        position: { x: epicX, y: epicY },
        data: {
          label: createNodeLabel('epic', epic.name, epic.status,
            epic.target_quarter && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {epic.target_quarter}
              </span>
            )
          ),
          ...epic,
          type: 'epic',
        },
        style: { ...nodeStyles.epic, borderRadius: '8px', width: nodeWidth },
      });

      edges.push({
        id: `roadmap-${epicId}`,
        source: 'roadmap-root',
        target: epicId,
        type: 'smoothstep',
        style: { stroke: edgeColors.roadmap, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: edgeColors.roadmap },
      });

      if (epic.features && epic.features.length > 0) {
        let featureStartX = epicStartX;

        epic.features.forEach((feature) => {
          const storiesWidth = feature.user_stories
            ? feature.user_stories.reduce((acc, story) => {
                const tasksWidth = story.tasks
                  ? Math.max(story.tasks.length * (nodeWidth + horizontalSpacing), nodeWidth)
                  : nodeWidth;
                return acc + tasksWidth + horizontalSpacing;
              }, 0)
            : nodeWidth;
          const featureWidth = Math.max(storiesWidth, nodeWidth);
          const featureX = featureStartX + featureWidth / 2 - nodeWidth / 2;
          const featureY = levelSpacing * 2;
          const featureId = `feature-${epic.id}-${feature.id}`;

          nodes.push({
            id: featureId,
            type: 'default',
            position: { x: featureX, y: featureY },
            data: {
              label: createNodeLabel('feature', feature.name, feature.status),
              ...feature,
              type: 'feature',
              parentEpicId: epic.id,
            },
            style: { ...nodeStyles.feature, borderRadius: '8px', width: nodeWidth },
          });

          edges.push({
            id: `${epicId}-${featureId}`,
            source: epicId,
            target: featureId,
            type: 'smoothstep',
            style: { stroke: edgeColors.epic, strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: edgeColors.epic },
          });

          if (feature.user_stories && feature.user_stories.length > 0) {
            let storyStartX = featureStartX;

            feature.user_stories.forEach((story) => {
              const tasksWidth = story.tasks
                ? Math.max(story.tasks.length * (nodeWidth + horizontalSpacing), nodeWidth)
                : nodeWidth;
              const storyWidth = Math.max(tasksWidth, nodeWidth);
              const storyX = storyStartX + storyWidth / 2 - nodeWidth / 2;
              const storyY = levelSpacing * 3;
              const storyId = `story-${epic.id}-${feature.id}-${story.id}`;

              nodes.push({
                id: storyId,
                type: 'default',
                position: { x: storyX, y: storyY },
                data: {
                  label: createNodeLabel('story', story.name, story.status,
                    story.story_points && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        {story.story_points} pts
                      </span>
                    )
                  ),
                  ...story,
                  type: 'story',
                  parentFeatureId: feature.id,
                  parentEpicId: epic.id,
                },
                style: { ...nodeStyles.story, borderRadius: '8px', width: nodeWidth },
              });

              edges.push({
                id: `${featureId}-${storyId}`,
                source: featureId,
                target: storyId,
                type: 'smoothstep',
                style: { stroke: edgeColors.feature, strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: edgeColors.feature },
              });

              if (story.tasks && story.tasks.length > 0) {
                story.tasks.forEach((task, taskIndex) => {
                  const taskX = storyStartX + taskIndex * (nodeWidth + horizontalSpacing);
                  const taskY = levelSpacing * 4;
                  const taskId = `task-${epic.id}-${feature.id}-${story.id}-${task.id}`;

                  nodes.push({
                    id: taskId,
                    type: 'default',
                    position: { x: taskX, y: taskY },
                    data: {
                      label: createNodeLabel('task', task.name, task.status),
                      ...task,
                      type: 'task',
                      parentStoryId: story.id,
                      parentFeatureId: feature.id,
                      parentEpicId: epic.id,
                    },
                    style: { ...nodeStyles.task, borderRadius: '8px', width: nodeWidth, minHeight: 60 },
                  });

                  edges.push({
                    id: `${storyId}-${taskId}`,
                    source: storyId,
                    target: taskId,
                    type: 'smoothstep',
                    style: { stroke: edgeColors.story, strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: edgeColors.story },
                  });
                });
              }

              storyStartX += storyWidth + horizontalSpacing;
            });
          }

          featureStartX += featureWidth + horizontalSpacing;
        });
      }

      epicStartX += epicWidth + horizontalSpacing * 2;
    });

    return { nodes, edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(calculateLayout.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(calculateLayout.edges);

  React.useEffect(() => {
    setNodes(calculateLayout.nodes);
    setEdges(calculateLayout.edges);
  }, [calculateLayout, setNodes, setEdges]);

  // Update list item data (must be after useNodesState)
  const updateListItemData = useCallback((field: string, value: string | number) => {
    if (!selectedListItem) return;
    setSelectedListItem((prev) => prev ? { ...prev, [field]: value } : null);
    // Also update the node if it exists
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedListItem.id) {
          const newData = { ...n.data, [field]: value };
          newData.label = createNodeLabel(
            newData.type,
            newData.name || newData.title || 'Untitled',
            newData.status,
            newData.type === 'epic' && newData.target_quarter && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {newData.target_quarter}
              </span>
            )
          );
          return { ...n, data: newData };
        }
        return n;
      })
    );
  }, [selectedListItem, setNodes]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find(n => n.id === params.source);
      const color = sourceNode?.data?.type ? edgeColors[sourceNode.data.type as keyof typeof edgeColors] || '#6B7280' : '#6B7280';
      setEdges((eds) => addEdge({
        ...params,
        type: 'smoothstep',
        style: { stroke: color, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color },
      }, eds));
    },
    [setEdges, nodes]
  );

  // Add new nodes
  const addEpic = () => {
    const id = `epic-new-${Date.now()}`;
    const existingEpics = nodes.filter(n => n.data.type === 'epic');
    const xPos = existingEpics.length > 0
      ? Math.max(...existingEpics.map(n => n.position.x)) + nodeWidth + horizontalSpacing * 2
      : 0;

    const newNode: Node = {
      id,
      type: 'default',
      position: { x: xPos, y: levelSpacing },
      data: {
        label: createNodeLabel('epic', 'New Epic', 'planned'),
        id: `new-${Date.now()}`,
        name: 'New Epic',
        status: 'planned',
        type: 'epic',
      },
      style: { ...nodeStyles.epic, borderRadius: '8px', width: nodeWidth },
    };

    setNodes(nds => nds.concat(newNode));
    setEdges(eds => eds.concat({
      id: `roadmap-${id}`,
      source: 'roadmap-root',
      target: id,
      type: 'smoothstep',
      style: { stroke: edgeColors.roadmap, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeColors.roadmap },
    }));
  };

  const addFeature = () => {
    const id = `feature-new-${Date.now()}`;
    const existingFeatures = nodes.filter(n => n.data.type === 'feature');
    const xPos = existingFeatures.length > 0
      ? Math.max(...existingFeatures.map(n => n.position.x)) + nodeWidth + horizontalSpacing
      : 0;

    const newNode: Node = {
      id,
      type: 'default',
      position: { x: xPos, y: levelSpacing * 2 },
      data: {
        label: createNodeLabel('feature', 'New Feature', 'planned'),
        id: `new-${Date.now()}`,
        name: 'New Feature',
        status: 'planned',
        type: 'feature',
      },
      style: { ...nodeStyles.feature, borderRadius: '8px', width: nodeWidth },
    };

    setNodes(nds => nds.concat(newNode));
  };

  const addStory = () => {
    const id = `story-new-${Date.now()}`;
    const existingStories = nodes.filter(n => n.data.type === 'story');
    const xPos = existingStories.length > 0
      ? Math.max(...existingStories.map(n => n.position.x)) + nodeWidth + horizontalSpacing
      : 0;

    const newNode: Node = {
      id,
      type: 'default',
      position: { x: xPos, y: levelSpacing * 3 },
      data: {
        label: createNodeLabel('story', 'New Story', 'planned'),
        id: `new-${Date.now()}`,
        name: 'New Story',
        status: 'planned',
        type: 'story',
      },
      style: { ...nodeStyles.story, borderRadius: '8px', width: nodeWidth },
    };

    setNodes(nds => nds.concat(newNode));
  };

  const addTask = () => {
    const id = `task-new-${Date.now()}`;
    const existingTasks = nodes.filter(n => n.data.type === 'task');
    const xPos = existingTasks.length > 0
      ? Math.max(...existingTasks.map(n => n.position.x)) + nodeWidth + horizontalSpacing
      : 0;

    const newNode: Node = {
      id,
      type: 'default',
      position: { x: xPos, y: levelSpacing * 4 },
      data: {
        label: createNodeLabel('task', 'New Task', 'planned'),
        id: `new-${Date.now()}`,
        name: 'New Task',
        status: 'planned',
        type: 'task',
      },
      style: { ...nodeStyles.task, borderRadius: '8px', width: nodeWidth, minHeight: 60 },
    };

    setNodes(nds => nds.concat(newNode));
  };

  // Add child item to a parent (for list view)
  const addChildToParent = (parentId: string, parentType: string) => {
    const childTypes: Record<string, { type: string; style: typeof nodeStyles.epic; yLevel: number }> = {
      roadmap: { type: 'epic', style: nodeStyles.epic, yLevel: 1 },
      epic: { type: 'feature', style: nodeStyles.feature, yLevel: 2 },
      feature: { type: 'story', style: nodeStyles.story, yLevel: 3 },
      story: { type: 'task', style: nodeStyles.task, yLevel: 4 },
    };

    const childConfig = childTypes[parentType];
    if (!childConfig) return;

    const timestamp = Date.now();
    const id = `${childConfig.type}-new-${timestamp}`;
    const childName = `New ${childConfig.type.charAt(0).toUpperCase() + childConfig.type.slice(1)}`;

    // Find parent node position
    const parentNode = nodes.find(n => n.id === parentId);
    const xPos = parentNode ? parentNode.position.x + 50 : 0;

    const newNode: Node = {
      id,
      type: 'default',
      position: { x: xPos, y: levelSpacing * childConfig.yLevel },
      data: {
        label: createNodeLabel(childConfig.type, childName, 'planned'),
        id: `new-${timestamp}`,
        name: childName,
        status: 'planned',
        type: childConfig.type,
      },
      style: { ...childConfig.style, borderRadius: '8px', width: nodeWidth },
    };

    const color = edgeColors[parentType as keyof typeof edgeColors] || '#6B7280';
    const newEdge: Edge = {
      id: `${parentId}-${id}`,
      source: parentId,
      target: id,
      type: 'smoothstep',
      style: { stroke: color, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color },
    };

    setNodes(nds => nds.concat(newNode));
    setEdges(eds => eds.concat(newEdge));

    // Expand the parent in tree view and select the new item
    setExpandedNodes(prev => new Set([...prev, parentId]));
  };

  const deleteNode = (nodeId: string) => {
    // Don't allow deleting the root
    if (nodeId === 'roadmap-root') return;

    setNodes(nds => nds.filter(n => n.id !== nodeId));
    setEdges(eds => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  };

  const deleteEdge = (edgeId: string) => {
    setEdges(eds => eds.filter(e => e.id !== edgeId));
  };

  // Update node data
  const updateNodeData = (nodeId: string, field: string, value: string) => {
    setNodes(nds => nds.map(n => {
      if (n.id === nodeId) {
        const newData = { ...n.data, [field]: value };
        // Update label
        newData.label = createNodeLabel(
          newData.type,
          newData.name || newData.title || 'Untitled',
          newData.status,
          newData.type === 'epic' && newData.target_quarter && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {newData.target_quarter}
            </span>
          )
        );
        return { ...n, data: newData };
      }
      return n;
    }));

    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, [field]: value } } : null);
    }
  };

  // Build roadmap data from nodes and edges for saving
  const buildRoadmapData = () => {
    const roadmapNode = nodes.find(n => n.id === 'roadmap-root');

    // Get all epics connected to roadmap
    const epicEdges = edges.filter(e => e.source === 'roadmap-root');
    const epics: Epic[] = epicEdges.map(epicEdge => {
      const epicNode = nodes.find(n => n.id === epicEdge.target);
      if (!epicNode) return null;

      // Get features connected to this epic
      const featureEdges = edges.filter(e => e.source === epicNode.id);
      const features: Feature[] = featureEdges.map(featureEdge => {
        const featureNode = nodes.find(n => n.id === featureEdge.target && n.data.type === 'feature');
        if (!featureNode) return null;

        // Get stories connected to this feature
        const storyEdges = edges.filter(e => e.source === featureNode.id);
        const stories: UserStory[] = storyEdges.map(storyEdge => {
          const storyNode = nodes.find(n => n.id === storyEdge.target && n.data.type === 'story');
          if (!storyNode) return null;

          // Get tasks connected to this story
          const taskEdges = edges.filter(e => e.source === storyNode.id);
          const tasks: Task[] = taskEdges.map(taskEdge => {
            const taskNode = nodes.find(n => n.id === taskEdge.target && n.data.type === 'task');
            if (!taskNode) return null;
            return {
              id: taskNode.data.id || taskNode.id.replace('task-', ''),
              name: taskNode.data.name || 'Untitled Task',
              status: taskNode.data.status || 'planned',
              description: taskNode.data.description,
              estimated_hours: taskNode.data.estimated_hours,
            };
          }).filter(Boolean) as Task[];

          return {
            id: storyNode.data.id || storyNode.id.replace('story-', ''),
            name: storyNode.data.name || 'Untitled Story',
            status: storyNode.data.status || 'planned',
            description: storyNode.data.description,
            story_points: storyNode.data.story_points,
            tasks: tasks.length > 0 ? tasks : undefined,
          };
        }).filter(Boolean) as UserStory[];

        return {
          id: featureNode.data.id || featureNode.id.replace('feature-', ''),
          name: featureNode.data.name || 'Untitled Feature',
          status: featureNode.data.status || 'planned',
          description: featureNode.data.description,
          user_stories: stories.length > 0 ? stories : undefined,
        };
      }).filter(Boolean) as Feature[];

      return {
        id: epicNode.data.id || epicNode.id.replace('epic-', ''),
        name: epicNode.data.name || 'Untitled Epic',
        status: epicNode.data.status || 'planned',
        description: epicNode.data.description,
        target_quarter: epicNode.data.target_quarter,
        features: features.length > 0 ? features : undefined,
      };
    }).filter(Boolean) as Epic[];

    return {
      type: 'roadmap',
      productName: productName || 'blueprint',
      version: '1.0',
      last_updated: new Date().toISOString().split('T')[0],
      title: roadmapNode?.data.title || roadmapNode?.data.name || 'Product Roadmap',
      description: roadmapNode?.data.description || '',
      epics,
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const roadmapData = buildRoadmapData();
      const response = await fetch(`http://localhost:3001/api/roadmap/${productName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: roadmapData }),
      });

      if (!response.ok) {
        throw new Error('Failed to save roadmap');
      }

      // Reload roadmap data to refresh the UI
      if (reloadRoadmap) {
        await reloadRoadmap();
      }

      alert('Roadmap saved successfully!');
    } catch (error) {
      console.error('Error saving roadmap:', error);
      alert('Failed to save roadmap. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        No roadmap data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            List
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'graph'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Graph
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* List View */}
      {viewMode === 'list' && treeData && (
        <div className="flex gap-4 h-[700px]">
          {/* Tree Panel */}
          <div className="w-1/2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">Roadmap Structure</h3>
                <button
                  onClick={() => handleChatClick('roadmap-discussion', { title: 'Roadmap Discussion', content: data })}
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full"
                  title="Discuss roadmap with AI"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Collapse All
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <TreeNode
                item={treeData}
                level={0}
                selectedItem={selectedListItem}
                onSelect={setSelectedListItem}
                expandedNodes={expandedNodes}
                onToggleExpand={toggleExpand}
              />
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-1/2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedListItem
                  ? `${nodeIcons[selectedListItem.type]} ${selectedListItem.type.charAt(0).toUpperCase() + selectedListItem.type.slice(1)} Properties`
                  : 'Properties'
                }
              </h3>
              {selectedListItem && (
                <button
                  onClick={() => handleChatClick(`roadmap-${selectedListItem.type}`, {
                    title: `${selectedListItem.type.charAt(0).toUpperCase() + selectedListItem.type.slice(1)}: ${selectedListItem.name}`,
                    content: selectedListItem
                  })}
                  className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full"
                  title={`Discuss this ${selectedListItem.type} with AI`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedListItem ? (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={selectedListItem.name}
                      onChange={(e) => updateListItemData('name', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={selectedListItem.description || ''}
                      onChange={(e) => updateListItemData('description', e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={selectedListItem.status || 'planned'}
                      onChange={(e) => updateListItemData('status', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Type-specific fields */}
                  {selectedListItem.type === 'epic' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Target Quarter
                      </label>
                      <input
                        type="text"
                        value={selectedListItem.target_quarter || ''}
                        onChange={(e) => updateListItemData('target_quarter', e.target.value)}
                        placeholder="e.g., Q1-2026"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {selectedListItem.type === 'story' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Story Points
                      </label>
                      <input
                        type="number"
                        value={selectedListItem.story_points || ''}
                        onChange={(e) => updateListItemData('story_points', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {selectedListItem.type === 'task' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estimated Hours
                      </label>
                      <input
                        type="number"
                        value={selectedListItem.estimated_hours || ''}
                        onChange={(e) => updateListItemData('estimated_hours', parseInt(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Item info */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Information</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{selectedListItem.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ID:</span>
                        <span className="font-mono text-xs">{selectedListItem.id}</span>
                      </div>
                      {selectedListItem.children && (
                        <div className="flex justify-between">
                          <span>Children:</span>
                          <span className="font-medium">{selectedListItem.children.length}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Child Actions */}
                  {selectedListItem.type !== 'task' && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Actions</h4>
                      {selectedListItem.type === 'roadmap' && (
                        <button
                          onClick={() => addChildToParent(selectedListItem.id, 'roadmap')}
                          className="w-full px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900 flex items-center justify-center gap-2"
                        >
                          <span>{nodeIcons.epic}</span> Add Epic
                        </button>
                      )}
                      {selectedListItem.type === 'epic' && (
                        <button
                          onClick={() => addChildToParent(selectedListItem.id, 'epic')}
                          className="w-full px-3 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900 flex items-center justify-center gap-2"
                        >
                          <span>{nodeIcons.feature}</span> Add Feature
                        </button>
                      )}
                      {selectedListItem.type === 'feature' && (
                        <button
                          onClick={() => addChildToParent(selectedListItem.id, 'feature')}
                          className="w-full px-3 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900 flex items-center justify-center gap-2"
                        >
                          <span>{nodeIcons.story}</span> Add User Story
                        </button>
                      )}
                      {selectedListItem.type === 'story' && (
                        <button
                          onClick={() => addChildToParent(selectedListItem.id, 'story')}
                          className="w-full px-3 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900 flex items-center justify-center gap-2"
                        >
                          <span>{nodeIcons.task}</span> Add Task
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>Select an item to view properties</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Graph View */}
      {viewMode === 'graph' && (
      <>
        <div className="roadmap-visualizer relative">
          <ChatButton
            resourceType="roadmap-overview"
            resourceData={{ title: 'Roadmap Overview', content: data }}
            onClick={handleChatClick}
          />

          <style>{`
            .roadmap-visualizer {
              width: 100%;
              height: 700px;
              margin-bottom: 60px;
            }
          `}</style>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={addEpic} className="px-3 py-2 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-white rounded text-sm hover:bg-blue-300 dark:hover:bg-blue-700">
              + Epic
            </button>
            <button onClick={addFeature} className="px-3 py-2 bg-green-200 dark:bg-green-800 text-green-800 dark:text-white rounded text-sm hover:bg-green-300 dark:hover:bg-green-700">
              + Feature
            </button>
            <button onClick={addStory} className="px-3 py-2 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-white rounded text-sm hover:bg-amber-300 dark:hover:bg-amber-700">
              + Story
            </button>
            <button onClick={addTask} className="px-3 py-2 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-white rounded text-sm hover:bg-purple-300 dark:hover:bg-purple-700">
              + Task
            </button>
          </div>

        {/* Selected node details panel */}
        {selectedNode && (
          <div
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 10, width: '340px', maxHeight: '500px', overflow: 'auto' }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {nodeIcons[selectedNode.data.type as keyof typeof nodeIcons]} Edit {selectedNode.data.type?.charAt(0).toUpperCase() + selectedNode.data.type?.slice(1)}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Name field */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedNode.data.name || selectedNode.data.title || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, 'name', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Description field */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={selectedNode.data.description || ''}
                  onChange={(e) => updateNodeData(selectedNode.id, 'description', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Status field */}
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  value={selectedNode.data.status || 'planned'}
                  onChange={(e) => updateNodeData(selectedNode.id, 'status', e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="planned">Planned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Epic-specific: target_quarter */}
              {selectedNode.data.type === 'epic' && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Target Quarter</label>
                  <input
                    type="text"
                    value={selectedNode.data.target_quarter || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, 'target_quarter', e.target.value)}
                    placeholder="e.g., Q1-2026"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {/* Story-specific: story_points */}
              {selectedNode.data.type === 'story' && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Story Points</label>
                  <input
                    type="number"
                    value={selectedNode.data.story_points || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, 'story_points', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {/* Task-specific: estimated_hours */}
              {selectedNode.data.type === 'task' && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={selectedNode.data.estimated_hours || ''}
                    onChange={(e) => updateNodeData(selectedNode.id, 'estimated_hours', e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              {/* Connections */}
              <div className="border-t pt-3 mt-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Connections</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Incoming:</span>
                    {edges.filter(e => e.target === selectedNode.id).map(e => {
                      const sourceNode = nodes.find(n => n.id === e.source);
                      return (
                        <div key={e.id} className="flex justify-between items-center mt-1 p-1 bg-gray-50 dark:bg-gray-900 rounded">
                          <span>{sourceNode?.data.name || e.source}</span>
                          <button
                            onClick={() => deleteEdge(e.id)}
                            className="px-2 py-0.5 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                    {edges.filter(e => e.target === selectedNode.id).length === 0 && (
                      <span className="text-gray-400 ml-2">None</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Outgoing:</span>
                    {edges.filter(e => e.source === selectedNode.id).map(e => {
                      const targetNode = nodes.find(n => n.id === e.target);
                      return (
                        <div key={e.id} className="flex justify-between items-center mt-1 p-1 bg-gray-50 dark:bg-gray-900 rounded">
                          <span>{targetNode?.data.name || e.target}</span>
                          <button
                            onClick={() => deleteEdge(e.id)}
                            className="px-2 py-0.5 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                    {edges.filter(e => e.source === selectedNode.id).length === 0 && (
                      <span className="text-gray-400 ml-2">None</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete button */}
              {selectedNode.id !== 'roadmap-root' && (
                <button
                  onClick={() => deleteNode(selectedNode.id)}
                  className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete {selectedNode.data.type}
                </button>
              )}
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.1}
          maxZoom={1.5}
          deleteKeyCode="Delete"
        >
          <Background color="#e2e8f0" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const type = node.data?.type;
              if (type === 'roadmap') return '#6B7280';
              if (type === 'epic') return '#3B82F6';
              if (type === 'feature') return '#10B981';
              if (type === 'story') return '#F59E0B';
              if (type === 'task') return '#8B5CF6';
              return '#6B7280';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
        </div>

        {/* Legend */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Roadmap Hierarchy</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#F3F4F6', border: '2px solid #6B7280' }}></div>
              <span>{nodeIcons.roadmap} <strong>Roadmap</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#DBEAFE', border: '2px solid #3B82F6' }}></div>
              <span>{nodeIcons.epic} <strong>Epic</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#D1FAE5', border: '2px solid #10B981' }}></div>
              <span>{nodeIcons.feature} <strong>Feature</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#FEF3C7', border: '2px solid #F59E0B' }}></div>
              <span>{nodeIcons.story} <strong>Story</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#E9D5FF', border: '2px solid #8B5CF6' }}></div>
              <span>{nodeIcons.task} <strong>Task</strong></span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            <strong>Tip:</strong> Drag from one node handle to another to create connections. Click a node to edit or delete it.
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default RoadmapVisualizer;
