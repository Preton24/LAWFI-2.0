import { generateEmbedding } from './embeddings'
import { supabase } from './db' // Using the client-side Supabase client for simplicity in this example
import { callLLM } from './llm'

interface DocumentChunk {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Performs a Retrieval-Augmented Generation (RAG) query.
 *
 * 1. Embeds the user's query.
 * 2. Searches a vector database (Supabase with pgvector) for relevant document chunks.
 * 3. Constructs a prompt for the LLM using the query and retrieved context.
 * 4. Calls the LLM to generate an answer.
 *
 * @param query The user's natural language query.
 * @param topK The number of top relevant documents to retrieve.
 * @returns A promise resolving to the AI-generated answer.
 */
export async function queryRAG(query: string, topK: number = 3): Promise<string> {
  console.log(`Starting RAG query for: "${query}"`)

  try {
    // 1. Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query)

    // 2. Search for relevant document chunks in Supabase (assuming 'document_chunks' table with 'embedding' column)
    // You would need to enable the pgvector extension and have a table like:
    // CREATE TABLE document_chunks (
    //   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    //   content text,
    //   embedding vector(1536), -- Adjust dimension based on your embedding model
    //   metadata jsonb
    // );
    // Add an index for performance: CREATE INDEX ON document_chunks USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
    const { data: documents, error: dbError } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.78, // Adjust as needed
      match_count: topK,
    })

    if (dbError) {
      console.error('Error matching documents:', dbError)
      throw new Error(`Failed to retrieve relevant documents: ${dbError.message}`)
    }

    let context = ''
    if (documents && documents.length > 0) {
      context = documents.map((doc: any) => doc.content).join('\n\n---\n\n')
      console.log(`Retrieved ${documents.length} relevant documents.`)
    } else {
      console.log('No relevant documents found.')
    }

    // 3. Construct a prompt for the LLM
    const systemPrompt = `You are a helpful legal financial assistant. Use the provided context to answer the user's question. If the answer cannot be found in the context, politely state that you don't have enough information. Do not make up answers.`
    const userPrompt = `Context:\n${context}\n\nQuestion: ${query}`

    // 4. Call the LLM to generate an answer
    const llmResponse = await callLLM(systemPrompt, userPrompt)

    return llmResponse
  } catch (error) {
    console.error('RAG process failed:', error)
    return 'I am currently unable to process your request. Please try again later.'
  }
}

// Example RPC function for pgvector matching (you'd define this in your Supabase SQL editor)
/*
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(1536), -- Ensure this matches your embedding dimension
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN query
  SELECT
    document_chunks.id,
    document_chunks.content,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
*/