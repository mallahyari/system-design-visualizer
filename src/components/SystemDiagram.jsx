import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "../config/nodeTypes";
import { useTheme } from "../hooks/useTheme";

const SystemDiagram = ({ initialNodes, initialEdges, onNodeClick }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { themeName } = useTheme();

  const nodeTypesMemo = React.useMemo(() => nodeTypes, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Dynamic colors based on theme
  const bgColor = themeName === "dark" ? "#333" : "#ccc";

  return (
    <div
      className="w-full h-full min-h-[600px] rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-primary)",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypesMemo}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
        style={{ backgroundColor: "var(--bg-primary)" }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={bgColor} gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default SystemDiagram;
