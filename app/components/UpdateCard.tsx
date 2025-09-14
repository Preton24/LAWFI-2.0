'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react' // Using lucide-react for icon

interface UpdateCardProps {
  title: string;
  description: string;
  date: string;
  link?: string; // Optional link for more details
  delay?: number; // Animation delay
}

export function UpdateCard({ title, description, date, link, delay = 0 }: UpdateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      className="bg-card p-6 rounded-lg shadow-sm border flex flex-col justify-between"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-muted-foreground">{date}</span>
        {link && (
          <Link href={link} className="text-primary hover:underline flex items-center text-sm">
            Read More <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}