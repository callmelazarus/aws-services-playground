import type { Node, Edge } from '@xyflow/react'

export type ServiceCategory =
  | 'compute'
  | 'storage'
  | 'networking'
  | 'messaging'
  | 'security'
  | 'observability'
  | 'client'

export type IconKey =
  | 'SiAmazonaws'
  | 'SiAmazons3'
  | 'SiAwslambda'
  | 'SiAmazondynamodb'
  | 'SiAmazonec2'
  | 'SiAmazonsqs'

export type ServiceNodeData = {
  label: string
  icon: IconKey
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
  /** Official AWS (or tooling) reference architecture / docs this diagram is modeled on. */
  reference: {
    label: string
    url: string
  }
  diagram: {
    nodes: Node<ServiceNodeData>[]
    edges: Edge[]
  }
}
