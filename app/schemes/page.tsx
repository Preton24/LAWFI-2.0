'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input' // Re-using Input for text fields

type FormState = {
  income: string;
  familySize: string;
  legalIssue: string;
  // Add more fields as per eligibility criteria
}

export default function SchemesPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormState>({
    income: '',
    familySize: '',
    legalIssue: '',
  })
  const [eligibilityResults, setEligibilityResults] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
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
        throw new Error(`HTTP error! status: ${response.status}`)
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

      <motion.div
        key={step} // Key for Framer Motion to re-render and animate
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-card p-8 rounded-lg shadow-md border"
      >
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 1: Your Financial Situation</h2>
            <div className="mb-4">
              <label htmlFor="income" className="block text-sm font-medium text-foreground mb-2">
                Annual Household Income ($)
              </label>
              <Input
                type="number"
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                placeholder="e.g., 50000"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="familySize" className="block text-sm font-medium text-foreground mb-2">
                Number of Dependents in Household
              </label>
              <Input
                type="number"
                id="familySize"
                name="familySize"
                value={formData.familySize}
                onChange={handleChange}
                placeholder="e.g., 3"
                required
              />
            </div>
            <Button onClick={handleNextStep} className="w-full">Next</Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Your Legal Issue</h2>
            <div className="mb-4">
              <label htmlFor="legalIssue" className="block text-sm font-medium text-foreground mb-2">
                Briefly describe your legal issue
              </label>
              <Input
                type="text"
                id="legalIssue"
                name="legalIssue"
                value={formData.legalIssue}
                onChange={handleChange}
                placeholder="e.g., Family law, property dispute, criminal defense"
                required
              />
            </div>
            {/* Add more fields here for detailed issue description, location etc. */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>Previous</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Checking...' : 'Check Eligibility'}
              </Button>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-destructive text-sm text-center">{error}</p>}

        {eligibilityResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 p-4 bg-accent rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-2">Eligibility Results:</h3>
            <p className="text-accent-foreground">
              Based on your input, you might be eligible for: <span className="font-medium">{eligibilityResults}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              (This is a preliminary assessment. Please consult with a legal professional for definitive advice.)
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}