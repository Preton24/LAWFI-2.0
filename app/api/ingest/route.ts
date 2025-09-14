import { NextResponse } from 'next/server'
import { parseDocument, chunkText } from '@/lib/pdf' // For parsing and chunking
import { generateEmbeddings } from '@/lib/embeddings' // For generating embeddings
import { createServerSupabaseClient } from '@/lib/db' // For server-side Supabase interactions

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient(); // Get a server-side Supabase client

  try {
    const formData = await request.formData()
    const documentFile = formData.get('document') as File | null;
    const sourceTable = formData.get('source_table') as string | null;
    const sourceId = formData.get('source_id') as string | null;
    const userId = formData.get('user_id') as string | null; // Optional: if user-uploaded

    if (!documentFile) {
      return NextResponse.json({ error: 'No document file provided for ingestion.' }, { status: 400 })
    }
    if (!sourceTable || !sourceId) {
      return NextResponse.json({ error: 'Missing source_table or source_id for document chunk metadata.' }, { status: 400 })
    }
    if (documentFile.size === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 });
    }
    if (documentFile.size > 10 * 1024 * 1024) { // Example 10MB limit for ingestion
      return NextResponse.json({ error: 'File size exceeds 10MB limit for ingestion.' }, { status: 413 });
    }

    console.log(`Received file for ingestion: ${documentFile.name}, source: ${sourceTable}/${sourceId}`)

    // 1. Extract text from the document
    const extractedText = await parseDocument(documentFile);
    if (!extractedText || extractedText.length < 100) {
      return NextResponse.json({ error: 'Not enough text extracted from document for meaningful ingestion.' }, { status: 422 });
    }

    // 2. Chunk the extracted text
    const chunks = chunkText(extractedText);
    console.log(`Document chunked into ${chunks.length} pieces.`);

    // 3. Generate embeddings for each chunk
    const embeddingResults = await generateEmbeddings(chunks);
    console.log(`Generated embeddings for ${embeddingResults.length} chunks.`);

    // 4. Prepare data for insertion into Supabase `document_chunks` table
    const dataToInsert = embeddingResults.map((result, index) => ({
      content: result.text,
      embedding: result.embedding,
      metadata: {
        document_name: documentFile.name,
        chunk_index: index,
        original_file_type: documentFile.type,
        uploaded_by: userId,
      },
      source_table: sourceTable,
      source_id: sourceId,
    }));

    // 5. Insert chunks into Supabase
    const { error: insertError } = await supabase
      .from('document_chunks')
      .insert(dataToInsert);

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error(`Failed to insert document chunks into database: ${insertError.message}`);
    }

    return NextResponse.json({
      message: 'Document ingested and embeddings stored successfully',
      chunksCount: chunks.length,
      insertedRows: dataToInsert.length,
      documentName: documentFile.name,
    }, { status: 200 });

  } catch (error) {
    console.error('Error during data ingestion:', error);
    return NextResponse.json({ error: `Failed to process ingestion request: ${(error as Error).message}` }, { status: 500 });
  }
}