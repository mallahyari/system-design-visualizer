import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from './CustomNodes';

const SystemDiagram = ({ initialNodes, initialEdges, onNodeClick }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const nodeTypesMemo = React.useMemo(() => nodeTypes, []);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <div className="w-full h-full min-h-[600px] bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypesMemo}
                onNodeClick={(_, node) => onNodeClick(node)}
                fitView
                className="bg-slate-950"
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#333" gap={20} />
                <Controls className="bg-slate-800 border-slate-700 fill-slate-200" />
            </ReactFlow>
        </div>
    );
};

export default SystemDiagram;
