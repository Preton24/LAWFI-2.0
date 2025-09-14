'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button' // Corrected import path for Button

interface Expert {
  id: number;
  name: string;
  specialty: string;
  rate: string;
  image: string;
  bio: string;
}

const experts: Expert[] = [
  {
    id: 1,
    name: "Dr. Eleanor Vance",
    specialty: "Tax Law & Compliance",
    rate: "$300/hour",
    image: "https://images.unsplash.com/photo-1599566150163-2919d7d3536a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder image
    bio: "Dr. Vance is a renowned expert in corporate tax law with over 20 years of experience, specializing in international compliance and mergers & acquisitions.",
  },
  {
    id: 2,
    name: "Atty. Marcus Thorne",
    specialty: "Intellectual Property & Licensing",
    rate: "$250/hour",
    image: "https://images.unsplash.com/photo-1560250097-0b73528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder image
    bio: "Marcus Thorne focuses on safeguarding intellectual assets for startups and established tech companies, offering strategic advice on patents, trademarks, and copyright.",
  },
  {
    id: 3,
    name: "Sarah Chen, CPA, JD",
    specialty: "Forensic Accounting & Fraud",
    rate: "$280/hour",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder image
    bio: "Sarah Chen combines her expertise in law and accounting to provide expert witness testimony and detailed forensic analysis in complex financial litigation.",
  },
];

export default function ExpertsPage() {
  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-10 text-center"
      >
        Connect with Legal & Financial Experts
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg text-muted-foreground text-center mb-12"
      >
        Find and book consultations with specialized professionals to guide you through complex legal and financial challenges.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experts.map((expert, index) => (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="bg-card p-6 rounded-lg shadow-md border flex flex-col items-center text-center"
          >
            <img
              src={expert.image}
              alt={expert.name}
              className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-primary"
            />
            <h2 className="text-2xl font-semibold mb-2">{expert.name}</h2>
            <p className="text-primary font-medium mb-2">{expert.specialty}</p>
            <p className="text-muted-foreground mb-4 flex-grow">{expert.bio}</p>
            <p className="text-lg font-bold text-accent-foreground mb-4">{expert.rate}</p>
            <Button className="w-full">Book Consultation</Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-16 text-center"
      >
        <p className="text-lg text-muted-foreground mb-4">
          Can't find the expert you need? Let our AI match you.
        </p>
        <Button size="lg">Request Expert Match</Button>
      </motion.div>
    </div>
  )
}