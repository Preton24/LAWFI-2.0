import { NextResponse } from 'next/server'
import { parseDocument, chunkText } from '@/lib/pdf' // For parsing and chunking
import { generateEmbeddings } from '@/lib/embeddings' // For generating embeddings
import { callLLM } from '@/lib/llm' // For LLM summarization

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const document = formData.get('document') as File | null

    if (!document) {
      return NextResponse.json({ error: 'No document uploaded' }, { status: 400 })
    }

    if (document.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'File size exceeds 5MB limit.' }, { status: 413 });
    }

    console.log(`Received file for summarization: ${document.name} (${document.size} bytes)`)

    // 1. Parse the document to extract text
    const extractedText = await parseDocument(document);

    if (!extractedText || extractedText.length < 50) { // Minimum length for summarization
      return NextResponse.json({ error: 'Could not extract enough text from the document for summarization.' }, { status: 422 });
    }

    // 2. (Optional, if document is very large) Chunk the text
    // For direct summarization, we might just pass the whole text if it fits LLM context.
    // For RAG, chunking and embedding (as in lib/rag.ts) is more relevant.
    // Here, we'll assume the LLM wrapper can handle the text for summarization.
    // If text is too long, we might need a more advanced hierarchical summarization.

    // 3. Call LLM for summarization
    const systemPrompt = `You are a helpful assistant specialized in legal document summarization. Provide a concise, clear, and accurate summary of the following document. Highlight key legal points, financial implications, and actionable insights. The summary should be no longer than 300 words.`
    const userPrompt = `Summarize this legal document:\n\n${extractedText}`

    const summary = await callLLM(systemPrompt, userPrompt);

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error in summarize API:', error)
    return NextResponse.json({ error: 'Failed to summarize document. Please ensure it is a valid text, PDF, or DOCX file.' }, { status: 500 })
  }
}