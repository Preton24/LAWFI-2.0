'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
    { text: "Hello! How can I assist you with your legal finances today?", sender: 'ai' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    const userMessage = { text: input, sender: 'user' as const }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Simulate API call to /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { text: data.reply, sender: 'ai' as const }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages((prev) => [...prev, { text: "Sorry, I couldn't get a response.", sender: 'ai' as const }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl flex flex-col h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Legal Chat Assistant</h1>

      <div className="flex-1 border rounded-lg p-4 overflow-y-auto mb-4 bg-muted/20">
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
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-accent text-accent-foreground animate-pulse">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Ask a question about legal finance..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  )
}