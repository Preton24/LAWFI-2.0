import { NextResponse } from 'next/server'
import { queryRAG } from '@/lib/rag' // Assuming queryRAG is set up to handle LLM calls

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    console.log('Received chat message:', message)

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
    }

    // Use RAG pipeline for generating response
    const aiReply = await queryRAG(message);

    return NextResponse.json({ reply: aiReply })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: 'Failed to process chat message. Please try again.' }, { status: 500 })
  }
}