import React, { createContext, useContext } from 'react'
import ToastContainer from '../components/ToastContainer'

var ToastCtx = createContext(null)

export function ToastProvider({ children, useToastHook }) {
  var _a = useToastHook(), toasts = _a.toasts, toast = _a.toast, removeToast = _a.removeToast
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastCtx.Provider>
  )
}

export function useToastCtx() {
  var ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToastCtx must be used inside ToastProvider')
  return ctx
}
