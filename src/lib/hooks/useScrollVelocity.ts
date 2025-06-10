import { useState, useEffect, useRef } from 'react'

interface ScrollVelocityHook {
  scrollVelocity: number
  scrollProgress: number
  scrollDirection: 'up' | 'down' | 'none'
}

export function useScrollVelocity(): ScrollVelocityHook {
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none')
  
  const lastScrollY = useRef(0)
  const lastTimestamp = useRef(0)
  const velocityHistory = useRef<number[]>([])
  
  useEffect(() => {
    let animationFrame: number
    
    // Detect if we're on mobile
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(navigator.userAgent.toLowerCase()) ||
                    ('ontouchstart' in window && window.innerWidth <= 768)
    
    const updateScrollMetrics = () => {
      const currentTime = performance.now()
      const currentScrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      
      // Calculate scroll progress (0 to 1)
      const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0
      setScrollProgress(Math.min(Math.max(progress, 0), 1))
      
      // Calculate scroll velocity
      if (lastTimestamp.current > 0) {
        const deltaTime = currentTime - lastTimestamp.current
        const deltaScroll = currentScrollY - lastScrollY.current
        
        if (deltaTime > 0) {
          // Raw velocity in pixels per millisecond
          const rawVelocity = Math.abs(deltaScroll) / deltaTime
          
          // Smooth velocity using moving average
          velocityHistory.current.push(rawVelocity)
          if (velocityHistory.current.length > (isMobile ? 5 : 10)) {
            velocityHistory.current.shift()
          }
          
          const smoothVelocity = velocityHistory.current.reduce((a, b) => a + b, 0) / velocityHistory.current.length
          
          // Normalize velocity (0 to 1, where 1 is very fast scrolling)
          // Use different multiplier for mobile devices (they tend to have different scroll speeds)
          const velocityMultiplier = isMobile ? 1.5 : 2
          const normalizedVelocity = Math.min(smoothVelocity * velocityMultiplier, 1)
          setScrollVelocity(normalizedVelocity)
          
          // Determine scroll direction
          if (deltaScroll > 2) {
            setScrollDirection('down')
          } else if (deltaScroll < -2) {
            setScrollDirection('up')
          } else {
            setScrollDirection('none')
          }
        }
      }
      
      lastScrollY.current = currentScrollY
      lastTimestamp.current = currentTime
      
      // Decay velocity when not scrolling
      // Use faster decay on mobile for more responsive feedback
      const decayTimeout = isMobile ? 30 : 50
      const decayRate = isMobile ? 0.9 : 0.95
      
      setTimeout(() => {
        setScrollVelocity(prev => Math.max(prev * decayRate, 0))
      }, decayTimeout)
      
      animationFrame = requestAnimationFrame(updateScrollMetrics)
    }
    
    // Start the animation loop
    animationFrame = requestAnimationFrame(updateScrollMetrics)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])
  
  return { scrollVelocity, scrollProgress, scrollDirection }
}
