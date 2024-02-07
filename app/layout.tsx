import type { Metadata } from 'next'
import Link from 'next/link';
import './globals.css'
import { FaDiscord, FaGithub } from 'react-icons/fa';

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
        <nav className="p-2 bg-slate-900 text-white flex justify-between items-center h-10">
          <Link href="/">Home</Link>
          <div className="flex gap-5">
            <Link href="https://github.com/ShouvikGhosh2048/topological-data-analysis-visualizations" className="flex items-center">
              <FaGithub className="w-8 h-8"/>
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
