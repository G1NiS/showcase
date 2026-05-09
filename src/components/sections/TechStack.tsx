const techs = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'PostgreSQL',
  'Stripe',
  'Vercel',
  'Expo',
  'Prisma',
]

export default function TechStack() {
  const doubled = [...techs, ...techs]

  return (
    <section className="py-16 bg-surface overflow-hidden border-y border-border">
      <div className="max-w-6xl mx-auto mb-8 px-6">
        <p className="text-text-secondary text-xs uppercase tracking-widest font-medium">
          Tech stack
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div
          className="flex whitespace-nowrap w-max"
          style={{ animation: 'marquee 25s linear infinite' }}
        >
          {doubled.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="text-text-secondary font-medium text-sm px-4 py-2 border border-border rounded-lg bg-surface-elevated flex-shrink-0 mr-8"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
