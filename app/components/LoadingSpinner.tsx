import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text, className, ...props }: LoadingSpinnerProps) {
  const spinnerSizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }[size]

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)} {...props}>
      <Loader2 className={cn("animate-spin text-primary", spinnerSizeClass)} />
      {text && <span className="text-muted-foreground text-sm">{text}</span>}
    </div>
  )
}