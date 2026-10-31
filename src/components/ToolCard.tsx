type ToolCardProps = {
  title: string
  description: string
  eyebrow: string
}

export function ToolCard({ title, description, eyebrow }: ToolCardProps) {
  return (
    <article className="tool-card">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="tool-card-link">En préparation <span aria-hidden="true">→</span></span>
    </article>
  )
}

