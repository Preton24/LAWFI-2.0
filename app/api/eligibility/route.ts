import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { income, familySize, legalIssue } = await request.json()
  console.log('Received eligibility data:', { income, familySize, legalIssue })

  // Simulate eligibility logic based on input
  let schemes: string[] = []

  const incomeNum = parseFloat(income)
  const familySizeNum = parseInt(familySize)

  if (isNaN(incomeNum) || isNaN(familySizeNum)) {
    return NextResponse.json({ error: 'Invalid input for income or family size' }, { status: 400 })
  }

  // Example basic eligibility rules (simplified)
  if (incomeNum < 30000 && familySizeNum >= 2) {
    schemes.push('Low-Income Family Legal Aid')
  }
  if (incomeNum < 50000 && legalIssue.toLowerCase().includes('family law')) {
    schemes.push('Family Law Assistance Program')
  }
  if (legalIssue.toLowerCase().includes('property dispute') && incomeNum < 70000) {
    schemes.push('Property Mediation Grant')
  }
  if (incomeNum < 20000) {
    schemes.push('General Legal Aid Scheme')
  }

  if (schemes.length === 0) {
    schemes.push('No specific schemes found based on current criteria. Please consult an expert.')
  }

  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

  return NextResponse.json({ schemes })
}