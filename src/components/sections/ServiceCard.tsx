interface ServiceCardProps {
  icon: string
  title: string
  description: string
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div
      data-service-card
      className="h-full p-6 rounded-card border border-border bg-surface hover:border-accent/30 transition-colors duration-300"
    >
      <span className="text-3xl mb-4 block" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  )
}
