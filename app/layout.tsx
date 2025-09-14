import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PHProvider } from '@/app/providers/posthog-provider'
import { Navbar } from '@/components/Navbar' // Corrected import path for Navbar
import { Footer } from '@/components/Footer' // Imported Footer

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LAW-FI',
  description: 'Legal Financial Management Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PHProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background">
              <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <Navbar /> {/* Used the new Navbar component */}
                {/* Could add user auth/profile here */}
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <Footer /> {/* Included Footer component */}
          </div>
        </PHProvider>
      </body>
    </html>
  )
}