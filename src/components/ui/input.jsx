import * as React from 'react'
import { cn } from '../../lib/utils'

export const Input = React.forwardRef(function _Input({ className, type, ...props }, ref) {
  return (
    <input type={type}
      className={cn(
        'flex w-full rounded-input border border-ink/10 bg-white px-3 py-2.5 font-serif text-[15px] text-ink',
        'transition-colors duration-200 placeholder:text-ink-soft/60',
        'focus:outline-none focus:border-green focus:ring-[3px] focus:ring-green/18',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref} {...props} />
  )
})
Input.displayName = 'Input'
