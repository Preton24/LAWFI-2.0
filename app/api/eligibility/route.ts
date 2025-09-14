import { NextResponse } from 'next/server'
import { queryRAG } from '@/lib/rag' // Could be used to search schemes based on legal issue

export async function POST(request: Request) {
  try {
    const { income, familySize, legalIssue, state } = await request.json()
    console.log('Received eligibility data:', { income, familySize, legalIssue, state })

    if (
      typeof income !== 'number' || income < 0 ||
      typeof familySize !== 'number' || familySize < 1 ||
      typeof legalIssue !== 'string' || legalIssue.trim().length < 10 ||
      typeof state !== 'string' || state.trim().length !== 2
    ) {
      return NextResponse.json({ error: 'Invalid or incomplete input for eligibility check.' }, { status: 400 })
    }

    let schemes: string[] = []
    const incomeNum = income as number
    const familySizeNum = familySize as number
    const legalIssueText = legalIssue as string
    const stateCode = state as string

    // Simulate eligibility logic based on input
    // In a real app, this would involve more sophisticated rules, possibly
    // querying a database of schemes, or using an LLM + RAG over scheme descriptions.

    // Example basic eligibility rules (simplified)
    if (incomeNum < 30000 && familySizeNum >= 2) {
      schemes.push('Low-Income Family Legal Aid')
    }
    if (incomeNum < 50000 && legalIssueText.toLowerCase().includes('family law')) {
      schemes.push('Family Law Assistance Program')
    }
    if (legalIssueText.toLowerCase().includes('property dispute') && incomeNum < 70000 && stateCode === 'CA') {
      schemes.push('California Property Mediation Grant')
    }
    if (incomeNum < 20000) {
      schemes.push('General Legal Aid Scheme')
    }
    if (legalIssueText.toLowerCase().includes('small business') && incomeNum < 100000) {
      schemes.push('Small Business Resilience Grant')
    }
    if (stateCode === 'NY' && legalIssueText.toLowerCase().includes('debt')) {
      schemes.push('New York Consumer Debt Relief Program')
    }

    if (schemes.length === 0) {
      // If no specific schemes matched, provide a general suggestion
      const genericResponse = await queryRAG(`Based on an income of $${incomeNum}, family size of ${familySizeNum}, legal issue '${legalIssueText}', and state '${stateCode}', what kind of general legal assistance or schemes might be available?`);
      schemes.push(`No direct matches, but general advice: ${genericResponse}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({ schemes })
  } catch (error) {
    console.error('Error in eligibility API:', error)
    return NextResponse.json({ error: 'Failed to check eligibility. Please ensure all fields are correctly filled.' }, { status: 500 })
  }
}