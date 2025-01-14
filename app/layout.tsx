import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'twitter-data',
  description: 'twitter-data',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
