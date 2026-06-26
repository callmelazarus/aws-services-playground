// site/src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { projects } from '@/data/projects'
import { ProjectDiagram } from '@/components/ProjectDiagram'

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel */}
      <aside className="w-[30%] min-w-[260px] max-w-[400px] bg-slate-800 border-r border-slate-700 overflow-y-auto p-6 flex flex-col gap-6">
        <div>
          <Link href="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
            ← All projects
          </Link>
          <div className="mt-3">
            <span className="text-slate-500 font-mono text-sm">{String(project.number).padStart(2, '0')}</span>
            <h1 className="text-white text-2xl font-bold mt-1 leading-tight">{project.title}</h1>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
              {project.difficulty}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600">
              {project.tooling}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Goal</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{project.goal}</p>
        </div>

        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Services</h2>
          <div className="flex flex-wrap gap-1.5">
            {project.services.map(svc => (
              <span key={svc} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-600">
                {svc}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">What You Learn</h2>
          <ul className="space-y-2">
            {project.whatYouLearn.map((item, i) => (
              <li key={i} className="text-slate-300 text-sm flex gap-2">
                <span className="text-slate-600 mt-0.5 shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right panel — diagram */}
      <main className="flex-1 bg-slate-900">
        <ProjectDiagram nodes={project.diagram.nodes} edges={project.diagram.edges} />
      </main>
    </div>
  )
}
