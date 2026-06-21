'use client'

import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { ServiceNodeData } from '@/types/project'

const categoryStyles: Record<string, string> = {
  compute:      'bg-amber-950 border-amber-500 text-amber-200',
  storage:      'bg-blue-950 border-blue-500 text-blue-200',
  networking:   'bg-purple-950 border-purple-500 text-purple-200',
  messaging:    'bg-green-950 border-green-500 text-green-200',
  security:     'bg-red-950 border-red-500 text-red-200',
  observability:'bg-gray-800 border-gray-500 text-gray-200',
  client:       'bg-slate-800 border-slate-500 text-slate-200',
}

export function ServiceNode({ data }: NodeProps) {
  const nodeData = data as ServiceNodeData
  const Icon = nodeData.icon
  const styles = categoryStyles[nodeData.category] ?? categoryStyles['client']
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg border-2 min-w-[90px] ${styles}`}>
        <Icon className="w-7 h-7" />
        <span className="text-xs font-semibold whitespace-nowrap">{nodeData.label}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  )
}
