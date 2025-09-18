"use client";
// Workflow type is now inferred from Mongoose model
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { AppNode, TaskType, TaskParamType } from "@/lib/types";
import { createFlowNode } from "@/lib/workflow/CreateFlowNode";
import NodeComponent from "./nodes/NodeComponent";
import DeletableEdge from "./edges/DeletableEdge";
import { TaskRegistry } from "@/lib/workflow/task/Registry";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};
const edgeTypes = {
  default: DeletableEdge,
};

const snapgird: [number, number] = [50, 50];

const fitViewOptions = { padding: 0.3, minZoom: 0.5, maxZoom: 1.5 };

function FlowEditor({ workflow }: { workflow: any }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      // Set default zoom to be more zoomed out
      setTimeout(() => {
        setViewport({ x: 0, y: 0, zoom: 0.75 });
      }, 100);
    } catch (error) {}
  }, [workflow, setEdges, setNodes, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = event.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createFlowNode(taskType as TaskType, position);
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },

    [setEdges, updateNodeData, nodes]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      try {
        // No self-connection
        if (connection.source === connection.target) {
          console.log("Cannot connect node to itself");
          return false;
        }

        // Find source and target nodes
        const sourceNode = nodes.find((node) => node.id === connection.source);
        const targetNode = nodes.find((node) => node.id === connection.target);

        if (!sourceNode || !targetNode) {
          console.log("Source or target node not found");
          return false;
        }

        // Get task definitions
        const sourceTask = TaskRegistry[sourceNode.data.type];
        const targetTask = TaskRegistry[targetNode.data.type];

        if (!sourceTask || !targetTask) {
          console.log("Task definition not found");
          return false;
        }

        // Find the specific output and input being connected
        const output = sourceTask.outputs?.find(
          (o) => o.name === connection.sourceHandle
        );
        const input = targetTask.inputs?.find(
          (i) => i.name === connection.targetHandle
        );

        if (!output || !input) {
          console.log("Output or input handle not found");
          return false;
        }

        // Type compatibility check - allow flexible connections
        const isCompatible = 
          output.type === input.type || 
          output.type === TaskParamType.STRING || 
          (input.type as any) === TaskParamType.STRING ||
          false; // Removed BROWSER_INSTANCE check as it doesn't exist

        if (!isCompatible) {
          console.log(`Type mismatch: ${output.type} -> ${input.type}`);
          return false;
        }

        // Check for cycles
        const hasCycle = (node: AppNode, visited = new Set<string>()) => {
          if (visited.has(node.id)) return false;
          visited.add(node.id);

          for (const outgoer of getOutgoers(node, nodes, edges)) {
            if (outgoer.id === connection.source) return true;
            if (hasCycle(outgoer, visited)) return true;
          }
          return false;
        };

        if (hasCycle(targetNode)) {
          console.log("Connection would create a cycle");
          return false;
        }

        // Check if target input already has a connection
        const existingConnection = edges.find(
          (edge) => 
            edge.target === connection.target && 
            edge.targetHandle === connection.targetHandle
        );

        if (existingConnection) {
          console.log("Target input already connected");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Connection validation error:", error);
        return false;
      }
    },
    [nodes, edges]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid
        snapGrid={snapgird}
        fitView
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
