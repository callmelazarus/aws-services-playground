'use client'

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import type { Node, Edge } from '@xyflow/react'
import { ServiceNode } from './nodes/ServiceNode'
import type { ServiceNodeData } from '@/types/project'

const nodeTypes = { service: ServiceNode }

type Props = {
  nodes: Node<ServiceNodeData>[]
  edges: Edge[]
}

export function ProjectDiagram({ nodes, edges }: Props) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      proOptions={{ hideAttribution: false }}
    >
      <Background color="#334155" gap={24} />
      <Controls />
      <MiniMap nodeColor="#475569" />
    </ReactFlow>
  )
}
