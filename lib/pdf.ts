// To actually parse PDFs or DOCX files, you would need dedicated libraries.
// For example:
// `npm install pdf-parse` for PDFs
// `npm install mammoth` for DOCX files (Node.js/browser compatible)
// or even a service like Google Cloud Document AI, AWS Textract, etc.

/**
 * Parses a document File object (PDF, DOCX, TXT) and extracts its text content.
 * This is a placeholder function; real implementation requires external libraries.
 *
 * @param file The File object to parse.
 * @returns A promise resolving to the extracted text content.
 */
export async function parseDocument(file: File): Promise<string> {
  console.log(`Attempting to parse document: ${file.name}, type: ${file.type}`)

  // --- Placeholder for actual document parsing ---
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000)) // Simulate parsing delay

  const fileExtension = file.name.split('.').pop()?.toLowerCase()

  let textContent = '';
  switch (fileExtension) {
    case 'pdf':
      // Example with 'pdf-parse' (Node.js only, typically used in API routes)
      // import pdf from 'pdf-parse';
      // const dataBuffer = Buffer.from(await file.arrayBuffer());
      // const data = await pdf(dataBuffer);
      // textContent = data.text;
      textContent = `(Mock PDF Content for ${file.name}): This is a simulated extraction from a PDF document. It contains legal terms, financial figures, and contractual obligations relevant to a law firm's operations. The document outlines a client agreement, payment schedule, and compliance requirements.`;
      break;
    case 'doc':
    case 'docx':
      // Example with 'mammoth' (Node.js or browser)
      // import mammoth from 'mammoth';
      // const arrayBuffer = await file.arrayBuffer();
      // const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      // textContent = result.value;
      textContent = `(Mock DOCX Content for ${file.name}): This is a simulated extraction from a Word document. It's a legal brief detailing a financial dispute, citing relevant statutes and case law. It includes arguments about damages and liability.`;
      break;
    case 'txt':
      textContent = await file.text();
      break;
    default:
      textContent = `(Unsupported file type or empty content for ${file.name}): Could not parse file type '${file.type}'.`;
      break;
  }

  if (textContent.length === 0) {
    textContent = `(Empty or unreadable content for ${file.name}).`;
  }

  return textContent;
}

/**
 * Chunks a large text into smaller, manageable pieces.
 * This is crucial for RAG to fit within LLM context windows and for efficient embedding.
 *
 * @param text The large text to chunk.
 * @param chunkSize The approximate size of each chunk (in characters or tokens).
 * @param overlap The number of characters/tokens to overlap between chunks.
 * @returns An array of text chunks.
 */
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  if (!text || text.length === 0) return [];
  if (chunkSize <= overlap) {
    console.warn("Chunk size must be greater than overlap. Adjusting overlap to be chunkSize - 1.");
    overlap = chunkSize - 1;
  }

  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + chunkSize, text.length);
    let chunk = text.substring(i, end);

    // Optional: Try to split on sentence/paragraph boundaries for cleaner chunks
    if (end < text.length) {
      const lastSentenceEnd = chunk.lastIndexOf('.');
      const lastParagraphEnd = chunk.lastIndexOf('\n\n');
      const splitPoint = Math.max(lastSentenceEnd, lastParagraphEnd);

      if (splitPoint > i + chunkSize * 0.75) { // Only adjust if it's not too small a chunk
        end = i + splitPoint + 1;
        chunk = text.substring(i, end);
      }
    }
    chunks.push(chunk);
    i += chunkSize - overlap;
  }
  return chunks;
}