import type { Project } from '@/types/project'

const difficultyStyles = {
  Beginner:     'bg-green-500/20 text-green-300 border border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  Advanced:     'bg-red-500/20 text-red-300 border border-red-500/30',
} as const

const toolingStyles = {
  'AWS CLI':    'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  'AWS SAM':    'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Terraform':  'bg-purple-500/20 text-purple-300 border border-purple-500/30',
} as const

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-colors cursor-pointer h-full flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-slate-500 font-mono text-sm font-bold min-w-[28px] pt-0.5">
          {String(project.number).padStart(2, '0')}
        </span>
        <h2 className="text-white font-semibold text-lg leading-tight">{project.title}</h2>
      </div>
      <div className="flex gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyStyles[project.difficulty]}`}>
          {project.difficulty}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${toolingStyles[project.tooling]}`}>
          {project.tooling}
        </span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.services.map(svc => (
          <span key={svc} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
            {svc}
          </span>
        ))}
      </div>
    </div>
  )
}
