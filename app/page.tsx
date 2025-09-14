'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button' // shadcn/ui Button

export default function HomePage() {
  return (
    <section className="relative h-[calc(100vh-64px)] flex items-center justify-center text-center">
      {/* Background overlay or image can go here */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-800 opacity-90 -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 max-w-3xl px-4"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Empower Your Legal Practice with Intelligent Financial Management
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
          LAW-FI integrates cutting-edge AI to streamline your financial operations, enhance compliance, and provide actionable insights.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild className="px-8 py-6 text-lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" asChild className="px-8 py-6 text-lg text-white border-white hover:bg-white hover:text-blue-900">
            <Link href="/chat">Learn More</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}