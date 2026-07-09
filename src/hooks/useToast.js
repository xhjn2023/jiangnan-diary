import { useState, useCallback, useRef } from 'react'

var toastId = 0

export function useToast() {
  var _a = useState([]), toasts = _a[0], setToasts = _a[1]
  var timersRef = useRef({})

  var addToast = useCallback(function (message, options) {
    var id = ++toastId
    var type = (options && options.type) || 'success'
    var duration = (options && options.duration) || 3000
    var toast = { id: id, message: message, type: type }

    setToasts(function (prev) { return prev.concat([toast]) })

    if (duration > 0) {
      timersRef.current[id] = setTimeout(function () {
        setToasts(function (prev) { return prev.filter(function (t) { return t.id !== id }) })
        delete timersRef.current[id]
      }, duration)
    }
    return id
  }, [])

  var removeToast = useCallback(function (id) {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
    setToasts(function (prev) { return prev.filter(function (t) { return t.id !== id }) })
  }, [])

  var toast = {
    success: function (msg, opts) { return addToast(msg, Object.assign({}, opts, { type: 'success' })) },
    error: function (msg, opts) { return addToast(msg, Object.assign({}, opts, { type: 'error' })) },
    info: function (msg, opts) { return addToast(msg, Object.assign({}, opts, { type: 'info' })) },
  }

  return { toasts: toasts, toast: toast, removeToast: removeToast }
}
