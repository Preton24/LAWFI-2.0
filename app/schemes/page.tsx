'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { EligibilityForm } from '@/components/EligibilityForm'

interface EligibilityFormData {
  income: number;
  familySize: number;
  legalIssue: string;
  state: string;
}

export default function SchemesPage() {
  const [eligibilityResults, setEligibilityResults] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (formData: EligibilityFormData) => {
    setLoading(true)
    setError(null)
    setEligibilityResults(null)

    try {
      const response = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      setEligibilityResults(data.schemes.join(', ') || 'No schemes found.')
    } catch (e: any) {
      setError(`Failed to check eligibility: ${e.message}`)
      console.error('Eligibility check error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Legal Aid Schemes Eligibility Wizard
      </motion.h1>

      <EligibilityForm
        onSubmit={handleFormSubmit}
        loading={loading}
        results={eligibilityResults}
        error={error}
      />
    </div>
  )
}