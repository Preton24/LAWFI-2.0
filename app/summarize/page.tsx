'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button' // Corrected import path for Button
import { Input } from '@/components/ui/input' // Corrected import path for Input
import { CitedAnswer } from '@/components/CitedAnswer' // New: Imported CitedAnswer
import { LoadingSpinner } from '@/components/LoadingSpinner' // New: Imported LoadingSpinner

export default function SummarizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
      setSummary(null)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file to summarize.")
      return
    }

    setLoading(true)
    setError(null)
    setSummary(null)

    const formData = new FormData()
    formData.append('document', file)

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData, // No Content-Type header needed for FormData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (e: any) {
      setError(`Failed to summarize document: ${e.message}`)
      console.error('Error summarizing document:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center"
      >
        Document Summarizer
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card p-6 rounded-lg shadow-md mb-8 border"
      >
        <p className="mb-4 text-muted-foreground">Upload a legal document (e.g., contract, brief, legislation) to get an AI-generated summary.</p>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="flex-1 block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
          <Button onClick={handleSubmit} disabled={loading || !file}>
            {loading ? <LoadingSpinner size="sm" /> : 'Summarize'}
          </Button>
        </div>
        {file && <p className="mt-2 text-sm text-muted-foreground">Selected: {file.name}</p>}
        {error && <p className="mt-4 text-destructive text-sm">{error}</p>}
      </motion.div>

      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Using CitedAnswer component for summary display */}
          <CitedAnswer
            answer={summary}
            citations={[
              { id: 'doc-source', text: `Source: ${file?.name || 'Uploaded Document'}`, url: '#' }
            ]}
            confidence={95} // Example confidence
          />
        </motion.div>
      )}
    </div>
  )
}