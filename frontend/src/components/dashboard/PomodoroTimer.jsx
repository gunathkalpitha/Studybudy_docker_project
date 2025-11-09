import React, { useEffect, useState } from 'react'

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus' | 'break'

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 0) {
            return 59
          }
          return prevSec - 1
        })
        setMinutes((prevMin) => {
          if (seconds === 0) {
            if (prevMin === 0) {
              // completed
              setIsRunning(false)
              if (mode === 'focus') {
                setMode('break')
                return 4 // minutes will be set to 4 and seconds->59 then we add 1 minute below
              } else {
                setMode('focus')
                return 24
              }
            }
            return prevMin - 1
          }
          return prevMin
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode, seconds])

  const toggleTimer = () => setIsRunning((s) => !s)

  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'focus') setMinutes(25)
    else setMinutes(5)
    setSeconds(0)
  }

  const setFocus = () => {
    setIsRunning(false)
    setMode('focus')
    setMinutes(25)
    setSeconds(0)
  }

  const setBreak = () => {
    setIsRunning(false)
    setMode('break')
    setMinutes(5)
    setSeconds(0)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Pomodoro Timer</h3>
        <div className="flex gap-1">
          <button
            onClick={setFocus}
            className={`px-3 py-1 text-xs rounded-full ${mode === 'focus' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Focus
          </button>
          <button
            onClick={setBreak}
            className={`px-3 py-1 text-xs rounded-full ${mode === 'break' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Break
          </button>
        </div>
      </div>
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-800">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      <div className="flex justify-center space-x-2">
        <button
          onClick={toggleTimer}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
          aria-label={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? (
            // pause icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="5" width="4" height="14" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" fill="currentColor" />
            </svg>
          ) : (
            // play icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
          aria-label="Reset"
        >
          {/* reset icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6v3l4-4-4-4v3C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8h-2c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}
