import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'Edvinas Giniotis — Full-Stack SaaS Developer',
  description:
    'I build SaaS products that ship. Next.js, Supabase, Stripe. End-to-end, fast.',
  openGraph: {
    title: 'Edvinas Giniotis — Full-Stack SaaS Developer',
    description:
      'I build SaaS products that ship. Next.js, Supabase, Stripe. End-to-end, fast.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
