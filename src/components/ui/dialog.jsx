import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogPortal = DialogPrimitive.Portal
const DialogOverlay = React.forwardRef(function _Overlay({ className, ...props }, ref) {
  return <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-[state=open]:animate-fade-in', className)} {...props} />
})
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef(function _Content({ className, children, ...props }, ref) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] card p-6 data-[state=open]:animate-scale-in',
          className
        )} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-mood opacity-60 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green/40 focus:ring-offset-2">
          <X className="h-4 w-4" />
          <span className="sr-only">关闭</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = 'DialogContent'

const DialogHeader = function _Header({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
}
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = React.forwardRef(function _Title({ className, ...props }, ref) {
  return <DialogPrimitive.Title ref={ref} className={cn('text-lg font-serif font-semibold text-ink tracking-wide', className)} {...props} />
})
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef(function _Desc({ className, ...props }, ref) {
  return <DialogPrimitive.Description ref={ref} className={cn('text-sm text-ink-soft', className)} {...props} />
})
DialogDescription.displayName = 'DialogDescription'

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription }
