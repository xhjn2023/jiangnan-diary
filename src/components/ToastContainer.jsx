import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

var icons = { success: CheckCircle, error: AlertCircle, info: Info }

var containerClass = {
  success: 'border-green bg-green-pale text-green-deep',
  error: 'border-accent bg-accent-pale text-accent',
  info: 'border-blue bg-blue-pale text-blue',
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map(function (toast) {
          var Icon = icons[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-center gap-3 rounded-card border px-4 py-3 shadow-card backdrop-blur font-serif text-sm',
                containerClass[toast.type]
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button onClick={function () { onRemove(toast.id) }}
                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
