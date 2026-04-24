import type { Metadata } from 'next'
import { Instrument_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

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
    <html lang="en" className={`${instrumentSans.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  )
}