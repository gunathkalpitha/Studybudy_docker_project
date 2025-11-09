import React, { useEffect, useState, useRef } from 'react'

// Alert with optional "staged" success animation: shows a spinner, then a checkmark,
// and calls onDone when the animation completes. Props:
// - message, type ('success'|'error')
// - onClose: called when user closes or non-staged timeout elapses
// - onDone: called when staged success animation finishes (useful to navigate)
// - duration: fallback duration for non-staged alerts
// - staged: boolean to enable spinner->check animation for success alerts
export default function Alert({ message, type = 'success', onClose, onDone, duration = 3500, staged = false, stageDelay = 700, doneDelay = 300 }) {
  const [visible, setVisible] = useState(!!message)
  const [done, setDone] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    // reset when message changes
    setVisible(!!message)
    setDone(false)
    timers.current.forEach(t => clearTimeout(t))
    timers.current = []

    if (!message) return

    if (staged && type === 'success') {
      // show spinner -> after stageDelay show check -> after doneDelay call onDone and then auto-close
      const t1 = setTimeout(() => setDone(true), stageDelay)
      const t2 = setTimeout(() => {
        onDone && onDone()
        // keep visible shortly then close
        const t3 = setTimeout(() => {
          setVisible(false)
          onClose && onClose()
        }, doneDelay)
        timers.current.push(t3)
      }, stageDelay + doneDelay)
      timers.current.push(t1, t2)
      return () => timers.current.forEach(t => clearTimeout(t))
    }

    // non-staged fallback: auto-close after duration
    const t = setTimeout(() => {
      setVisible(false)
      onClose && onClose()
    }, duration)
    timers.current.push(t)
    return () => timers.current.forEach(t => clearTimeout(t))
  }, [message, duration, onClose, onDone, staged, stageDelay, doneDelay, type])

  if (!message || !visible) return null

  const bg = type === 'success' ? 'bg-green-50' : 'bg-red-50'
  const border = type === 'success' ? 'border-green-400' : 'border-red-400'
  const text = type === 'success' ? 'text-green-800' : 'text-red-800'

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`max-w-xl w-full mx-4 ${bg} border ${border} rounded-lg shadow-lg pointer-events-auto`}>
        <div className="p-4 flex items-start gap-3">
          <div className={`flex-shrink-0 mt-0.5 ${text}`}>
            {type === 'success' ? (
              // staged: spinner -> check
              done ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className={`text-sm font-medium ${text}`}>{type === 'success' ? 'Success' : 'Error'}</div>
            <div className="mt-1 text-sm text-gray-700">{message}</div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button onClick={() => { timers.current.forEach(t => clearTimeout(t)); setVisible(false); onClose && onClose(); }} className={`inline-flex text-gray-500 hover:text-gray-700 focus:outline-none`} aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
