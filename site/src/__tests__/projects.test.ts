import { describe, it, expect } from 'vitest'
import { projects } from '../data/projects'

describe('projects data', () => {
  it('exports exactly 13 projects', () => {
    expect(projects).toHaveLength(13)
  })

  it('each project has a unique slug', () => {
    const slugs = projects.map(p => p.slug)
    expect(new Set(slugs).size).toBe(13)
  })

  it('each project has a unique number 1–13', () => {
    const numbers = projects.map(p => p.number).sort((a, b) => a - b)
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  })

  it('all diagram edge sources and targets reference valid node ids', () => {
    for (const project of projects) {
      const nodeIds = new Set(project.diagram.nodes.map(n => n.id))
      for (const edge of project.diagram.edges) {
        expect(nodeIds.has(edge.source), `${project.slug}: edge source "${edge.source}" not found`).toBe(true)
        expect(nodeIds.has(edge.target), `${project.slug}: edge target "${edge.target}" not found`).toBe(true)
      }
    }
  })

  it('each project has required fields', () => {
    for (const p of projects) {
      expect(p.slug).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.goal).toBeTruthy()
      expect(p.whatYouLearn.length).toBeGreaterThan(0)
      expect(p.diagram.nodes.length).toBeGreaterThan(0)
      expect(p.diagram.edges.length).toBeGreaterThan(0)
    }
  })

  it('each project has a reference with a label and an https url', () => {
    for (const p of projects) {
      expect(p.reference.label, `${p.slug}: missing reference label`).toBeTruthy()
      expect(p.reference.url, `${p.slug}: reference url must be https`).toMatch(/^https:\/\//)
    }
  })
})
