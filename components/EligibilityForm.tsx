'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// If using shadcn/ui Form components, you would import them here:
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

// Define the schema for form validation
const formSchema = z.object({
  income: z.number().min(0, { message: "Income must be a positive number." }),
  familySize: z.number().int().min(1, { message: "Family size must be at least 1." }),
  legalIssue: z.string().min(10, { message: "Please describe your legal issue in more detail." }).max(200, { message: "Description too long." }),
  state: z.string().min(2, { message: "Please enter your state abbreviation." }).max(2, { message: "Please enter a valid 2-letter state abbreviation." }).toUpperCase(),
})

type FormValues = z.infer<typeof formSchema>

interface EligibilityFormProps {
  onSubmit: (data: FormValues) => void;
  loading: boolean;
  results: string | null;
  error: string | null;
}

export function EligibilityForm({ onSubmit, loading, results, error }: EligibilityFormProps) {
  const [step, setStep] = useState(1)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: 0,
      familySize: 1,
      legalIssue: '',
      state: '',
    },
    mode: 'onTouched', // Validate on blur or change
  })

  const handleNextStep = async () => {
    // Validate current step fields before moving to next
    if (step === 1) {
      const isValid = await form.trigger(['income', 'familySize'])
      if (isValid) setStep(2)
    } else if (step === 2) {
      const isValid = await form.trigger(['legalIssue', 'state'])
      if (isValid) form.handleSubmit(onSubmit)() // If last step, submit the form
    }
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  // Define a wrapper for form field to display errors
  const FormFieldWrapper = ({ name, label, type = "text", placeholder, ...props }: { name: keyof FormValues, label: string, type?: string, placeholder?: string }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <Input
        id={name}
        type={type}
        {...form.register(name, { valueAsNumber: type === "number" })}
        placeholder={placeholder}
        className={form.formState.errors[name] ? 'border-destructive focus-visible:ring-destructive' : ''}
        {...props}
      />
      {form.formState.errors[name] && (
        <p className="text-sm text-destructive mt-1">{form.formState.errors[name]?.message}</p>
      )}
    </div>
  )


  return (
    <form className="bg-card p-8 rounded-lg shadow-md border">
      <motion.h2
        key={`step-title-${step}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-semibold mb-6"
      >
        {step === 1 && 'Step 1: Your Financial Situation'}
        {step === 2 && 'Step 2: Your Legal Issue & Location'}
      </motion.h2>

      <motion.div
        key={`step-content-${step}`} // Key for Framer Motion to re-render and animate
        initial={{ opacity: 0, x: step === 1 ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: step === 1 ? -50 : 50 }}
        transition={{ duration: 0.3 }}
      >
        {step === 1 && (
          <>
            <FormFieldWrapper
              name="income"
              label="Annual Household Income ($)"
              type="number"
              placeholder="e.g., 50000"
            />
            <FormFieldWrapper
              name="familySize"
              label="Number of Dependents in Household"
              type="number"
              placeholder="e.g., 3"
            />
          </>
        )}

        {step === 2 && (
          <>
            <FormFieldWrapper
              name="legalIssue"
              label="Briefly describe your legal issue"
              placeholder="e.g., Family law, property dispute, criminal defense"
            />
            <FormFieldWrapper
              name="state"
              label="Your State (e.g., CA for California)"
              placeholder="e.g., NY"
            />
          </>
        )}
      </motion.div>

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <Button type="button" variant="outline" onClick={handlePrevStep} disabled={loading}>
            Previous
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" onClick={handleNextStep} disabled={loading}>
            Next
          </Button>
        ) : (
          <Button type="button" onClick={handleNextStep} disabled={loading || !form.formState.isValid}>
            {loading ? 'Checking...' : 'Check Eligibility'}
          </Button>
        )}
      </div>

      {error && <p className="mt-4 text-destructive text-sm text-center">{error}</p>}

      {results && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 p-4 bg-accent rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-2">Eligibility Results:</h3>
          <p className="text-accent-foreground">
            Based on your input, you might be eligible for: <span className="font-medium">{results}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (This is a preliminary assessment. Please consult with a legal professional for definitive advice.)
          </p>
        </motion.div>
      )}
    </form>
  )
}