'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SpeechControls } from '@/components/SpeechControls'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { cn } from '@/lib/utils'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
    { text: "Hello! How can I assist you with your legal finances today?", sender: 'ai' },
    // Seeded initial conversation
    { text: "What are the common legal aid schemes available for small businesses?", sender: 'user' },
    {
      text: "For small businesses, common legal aid schemes include the 'Small Business Resilience Grant' and programs offering pro-bono consultations for startups. Eligibility often depends on business size, revenue, and the nature of the legal issue.",
      sender: 'ai'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentAiResponse, setCurrentAiResponse] = useState('') // State to pass to TTS

  const handleSendMessage = async (messageText: string) => {
    if (messageText.trim() === '') return

    const userMessage = { text: messageText, sender: 'user' as const }
    setMessages((prev) => [...prev, userMessage])
    setInput('') // Clear input only if it was typed
    setLoading(true)
    setCurrentAiResponse('') // Clear previous TTS text

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      })
      const data = await response.json()
      const aiReply = data.reply
      setMessages((prev) => [...prev, { text: aiReply, sender: 'ai' as const }])
      setCurrentAiResponse(aiReply) // Set AI response for TTS
    } catch (error) {
      console.error('Error sending message:', error)
      const errorReply = "Sorry, I couldn't get a response. Please try again."
      setMessages((prev) => [...prev, { text: errorReply, sender: 'ai' as const }])
      setCurrentAiResponse(errorReply) // Set error response for TTS
    } finally {
      setLoading(false)
    }
  }

  const handleSpeechRecognized = (text: string) => {
    setInput(text); // Populate input field with speech text
    handleSendMessage(text); // Immediately send the recognized speech as a message
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl flex flex-col h-[calc(100vh-64px-40px)]"> {/* Adjusted height for footer */}
      <h1 className="text-3xl font-bold mb-6 text-center">AI Legal Chat Assistant</h1>

      <div className="flex-1 border rounded-lg p-4 overflow-y-auto mb-4 bg-muted/20" role="log" aria-live="polite">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={cn(
                'rounded-lg px-4 py-2 max-w-[70%]',
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              )}
              aria-label={`${msg.sender} said: ${msg.text}`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <LoadingSpinner text="AI is typing..." size="sm" aria-live="assertive" />
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Input
          type="text"
          placeholder="Ask a question about legal finance..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
          className="flex-1"
          disabled={loading}
          aria-label="Chat input"
        />
        <Button onClick={() => handleSendMessage(input)} disabled={loading} aria-label="Send message">
          Send
        </Button>
        <SpeechControls onSpeechRecognized={handleSpeechRecognized} textToSpeak={currentAiResponse} />
      </div>
    </div>
  )
}