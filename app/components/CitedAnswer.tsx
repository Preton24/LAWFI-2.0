import { cn } from '@/lib/utils' // Assuming utils.ts is at '@/lib/utils'

interface Citation {
  id: string;
  text: string;
  url?: string;
}

interface CitedAnswerProps {
  answer: string;
  citations?: Citation[];
  confidence?: number; // Percentage from 0-100
}

export function CitedAnswer({ answer, citations, confidence }: CitedAnswerProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-3">AI Answer</h3>
      <p className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-wrap">{answer}</p>

      {citations && citations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Citations:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {citations.map((cite) => (
              <li key={cite.id}>
                {cite.url ? (
                  <a href={cite.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {cite.text}
                  </a>
                ) : (
                  cite.text
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {confidence !== undefined && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Confidence:</h4>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className={cn(
                "h-2.5 rounded-full",
                confidence > 75 ? "bg-green-500" : confidence > 50 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{confidence}% confident</p>
        </div>
      )}
    </div>
  )
}