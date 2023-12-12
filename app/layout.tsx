import type { Metadata } from 'next'
import Link from 'next/link';
import './globals.css'

export const metadata: Metadata = {
  title: 'Topological Data Analysis Visualizations',
  description: 'A website for topological data analysis visualizations.',
}

// Body uses h-screen and flex so that children can use flex-grow
// to occupy the screen space leaving the nav.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col items-stretch">
        <nav className="p-2 bg-slate-900 text-white">
          <Link href="/">Home</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
