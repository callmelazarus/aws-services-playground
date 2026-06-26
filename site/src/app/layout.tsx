import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@xyflow/react/dist/style.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AWS Services Playground',
  description: 'Interactive architecture diagrams for 13 AWS projects',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
