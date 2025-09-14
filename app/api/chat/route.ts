import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { message } = await request.json()
  console.log('Received chat message:', message)

  // Simulate AI response logic
  let reply = "I'm sorry, I don't have enough information to answer that."
  if (message.toLowerCase().includes('hello')) {
    reply = "Hello there! How can I help you with legal finance today?"
  } else if (message.toLowerCase().includes('supabase')) {
    reply = "Supabase is a great open-source Firebase alternative for building your backend."
  } else if (message.toLowerCase().includes('invoice')) {
    reply = "To manage invoices, you might want to check the 'Dashboard' section for pending and paid invoices."
  } else if (message.toLowerCase().includes('summary')) {
    reply = "You can upload documents for summarization on the '/summarize' page."
  } else if (message.toLowerCase().includes('eligibility')) {
    reply = "Check the '/schemes' page to use the eligibility wizard for legal aid programs."
  }

  // Simulate a delay for AI processing
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({ reply })
}