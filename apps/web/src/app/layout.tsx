import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NEXUS — Ultimate Production-Ready All-In-One SaaS Platform',
  description: 'Replace 55+ tools with one platform. CRM, marketing, creative studio, advertising, automation — all connected.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}