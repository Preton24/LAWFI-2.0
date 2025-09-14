'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/chat', label: 'Chat' },
    { href: '/summarize', label: 'Summarize' },
    { href: '/schemes', label: 'Schemes' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/experts', label: 'Experts' },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6" aria-label="Main navigation">
      <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Go to LAW-FI homepage">
        <span className="font-bold inline-block text-lg">LAW-FI</span>
      </Link>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href ? 'text-primary' : 'text-muted-foreground'
          )}
          aria-current={pathname === item.href ? 'page' : undefined}
          aria-label={`Navigate to ${item.label} page`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}