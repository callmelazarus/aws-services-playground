import type { Node, Edge } from '@xyflow/react'

export type ServiceCategory =
  | 'compute'
  | 'storage'
  | 'networking'
  | 'messaging'
  | 'security'
  | 'observability'
  | 'client'

export type ServiceNodeData = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  category: ServiceCategory
}

export type Project = {
  slug: string
  number: number
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tooling: 'AWS CLI' | 'AWS SAM' | 'Terraform'
  description: string
  services: string[]
  goal: string
  whatYouLearn: string[]
  diagram: {
    nodes: Node<ServiceNodeData>[]
    edges: Edge[]
  }
}
