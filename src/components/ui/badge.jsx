import { cn } from '../../lib/utils'

export function Badge({ className, variant, children, ...props }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-3 py-1 font-serif text-xs',
      variant === 'local' && 'bg-accent-pale text-accent border border-accent/30',
      variant === 'cloud' && 'bg-green-pale text-green-deep border border-green/30',
      className
    )} {...props}>
      {children}
    </span>
  )
}
