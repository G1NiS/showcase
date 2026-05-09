import { UPWORK_URL, GITHUB_URL, EMAIL } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="py-8 px-6 bg-bg border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-text-secondary text-sm">Edvinas Giniotis</span>
        <nav
          className="flex items-center gap-6 text-sm text-text-secondary"
          aria-label="Footer navigation"
        >
          <a
            href={UPWORK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            Upwork
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="hover:text-text-primary transition-colors"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  )
}
