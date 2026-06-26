import Link from 'next/link'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-white">AWS Services Playground</h1>
        <p className="mt-2 text-slate-400 text-lg">
          13 hands-on projects — compute, storage, eventing, auth, and IaC.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="h-full">
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </main>
  )
}
