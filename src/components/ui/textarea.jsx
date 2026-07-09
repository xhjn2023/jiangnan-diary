import * as React from 'react'
import { cn } from '../../lib/utils'

export const Textarea = React.forwardRef(function _Textarea({ className, ...props }, ref) {
  return (
    <textarea className={cn(
      'flex min-h-[120px] w-full rounded-input border border-ink/10 bg-white px-3 py-2.5 font-serif text-[15px] text-ink leading-relaxed',
      'resize-y transition-colors duration-200 placeholder:text-ink-soft/60',
      'focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/18',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )} ref={ref} {...props} />
  )
})
Textarea.displayName = 'Textarea'
