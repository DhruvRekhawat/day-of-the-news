'use client'

import { useState, useEffect } from 'react'

export default function Loading() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 50) // Update every 50ms for smooth animation

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-8">
        {/* Logo */}
        <div className="mb-8">
        <span className="text-xs text-gray-600 dark:text-gray-200">
                  DAY OF THE
                </span>
                <br />
                <span className="text-xl font-bold">NEWS</span>
        </div>
        
        {/* Number ticker */}
        <div className="text-xl font-thin text-primary">
          {count}%
        </div>
        
      
      </div>
    </div>
  )
}
