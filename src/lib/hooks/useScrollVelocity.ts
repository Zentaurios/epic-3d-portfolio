import { useState, useEffect, useRef } from 'react'

interface ScrollVelocityHook {
  scrollVelocity: number
  scrollDirection: 'up' | 'down' | 'none'
}

export function useScrollVelocity(): ScrollVelocityHook {
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none')
  
  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(0)
  const velocityHistory = useRef<number[]>([])
  const velocityDecayTimeoutRef = useRef<NodeJS.Timeout>()
  
  useEffect(() => {
    const updateScrollMetrics = () => {
      const currentTime = performance.now()
      const currentScrollY = window.scrollY
      
      // Calculate scroll velocity
      if (lastTimestamp.current > 0) {
        const deltaTime = currentTime - lastTimestamp.current
        const deltaScroll = currentScrollY - lastScrollY.current
        
        if (deltaTime > 0) {
          // Raw velocity in pixels per millisecond
          const rawVelocity = Math.abs(deltaScroll) / deltaTime
          
          // Smooth velocity using moving average
          velocityHistory.current.push(rawVelocity)
          if (velocityHistory.current.length > 5) {
            velocityHistory.current.shift()
          }
          
          const smoothVelocity = velocityHistory.current.reduce((a, b) => a + b, 0) / velocityHistory.current.length
          
          // Normalize velocity (0 to 1, where 1 is very fast scrolling)
          const normalizedVelocity = Math.min(smoothVelocity * 2, 1)
          setScrollVelocity(normalizedVelocity)
          
          // Determine scroll direction
          if (Math.abs(deltaScroll) > 2) {
            if (deltaScroll > 0) {
              setScrollDirection('down')
            } else {
              setScrollDirection('up')
            }
          } else if (Math.abs(deltaScroll) < 1) {
            setScrollDirection('none')
          }
        }
      }
      
      lastScrollY.current = currentScrollY
      lastTimestamp.current = currentTime
      
      // Clear existing decay timeout
      if (velocityDecayTimeoutRef.current) {
        clearTimeout(velocityDecayTimeoutRef.current)
      }
      
      // Decay velocity when not scrolling
      velocityDecayTimeoutRef.current = setTimeout(() => {
        setScrollVelocity(prev => Math.max(prev * 0.8, 0))
      }, 100)
    }
    
    // Use scroll event instead of animation frame for better performance
    window.addEventListener('scroll', updateScrollMetrics, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', updateScrollMetrics)
      if (velocityDecayTimeoutRef.current) {
        clearTimeout(velocityDecayTimeoutRef.current)
      }
    }
  }, [])
  
  return { scrollVelocity, scrollDirection }
}
