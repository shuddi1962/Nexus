import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'NEXUS — Ultimate Production-Ready All-In-One SaaS Platform',
  description: 'Replace 55+ tools with one platform. CRM, marketing, creative studio, advertising, automation — all connected.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#1A1A2E',
  openGraph: {
    title: 'NEXUS — Ultimate Production-Ready All-In-One SaaS Platform',
    description: 'Replace 55+ tools with one platform. CRM, marketing, creative studio, advertising, automation — all connected.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
        width: 1200,
        height: 675,
        alt: 'NEXUS Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXUS — Ultimate Production-Ready All-In-One SaaS Platform',
    description: 'Replace 55+ tools with one platform. CRM, marketing, creative studio, advertising, automation — all connected.',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}