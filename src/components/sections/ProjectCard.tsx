interface ProjectCardProps {
  name: string
  description: string
  tags: string[]
}

export default function ProjectCard({ name, description, tags }: ProjectCardProps) {
  return (
    <div className="rounded-card border border-border bg-surface overflow-hidden hover:border-accent/30 transition-colors duration-300">
      <div className="bg-surface-elevated px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" aria-hidden="true" />
        <span className="ml-2 text-xs text-white/20 flex-1 truncate">
          {name.toLowerCase()}.app
        </span>
      </div>
      <div className="h-40 bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center">
        <span className="text-4xl opacity-20" aria-hidden="true">
          ✦
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-text-primary">{name}</h3>
          <span className="text-xs text-accent border border-accent/30 px-2 py-0.5 rounded-full">
            Demo
          </span>
        </div>
        <p className="text-text-secondary text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-text-secondary bg-surface-elevated border border-border px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
