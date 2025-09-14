import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PHProvider } from '@/app/providers/posthog-provider' // PostHog Provider
import { MainNav } from '@/app/components/main-nav' // Navbar component

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
                <MainNav />
                {/* Could add user auth/profile here */}
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            {/* Optional Footer */}
            <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by the LAW-FI team. © {new Date().getFullYear()}
                </p>
              </div>
            </footer>
          </div>
        </PHProvider>
      </body>
    </html>
  )
}