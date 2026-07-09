import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-input font-serif font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-br from-green to-green-deep text-white shadow hover:shadow-green hover:-translate-y-px active:translate-y-0 tracking-wider',
        ghost: 'border border-ink/10 text-ink-soft bg-transparent hover:border-green hover:text-green-deep hover:bg-green-pale',
        mini: 'btn-mini text-green-deep bg-green-pale border border-ink/10 rounded-mini text-xs px-3 py-1.5 hover:bg-green/18',
        'mini-danger': 'btn-mini-danger text-accent bg-accent-pale border border-ink/10 rounded-mini text-xs px-3 py-1.5 hover:bg-accent-light',
        link: 'text-green-deep underline-offset-4 hover:underline p-0',
        outline: 'border border-ink/10 bg-transparent hover:bg-green-pale hover:text-green-deep',
      },
      size: {
        default: 'h-10 px-5 py-2 text-sm',
        sm: 'h-9 rounded-mini px-3 text-xs',
        lg: 'h-11 rounded-input px-8',
        icon: 'h-9 w-9 rounded-mood',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
)

export const Button = React.forwardRef(function _Button({ className, variant, size, ...props }, ref) {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'
