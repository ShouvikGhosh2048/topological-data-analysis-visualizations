import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Topological Data Analysis Visualizations',
  description: 'A website for topological data analysis visualizations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="p-2 bg-slate-900 text-white">
          <Link href="/">Home</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
