'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface MobileDetectionContextType {
  isMobile: boolean
  isLoading: boolean
  detectionMethod: string
}

const MobileDetectionContext = createContext<MobileDetectionContextType>({
  isMobile: false,
  isLoading: true,
  detectionMethod: 'unknown'
})

export function useMobileDetection() {
  return useContext(MobileDetectionContext)
}

interface MobileDetectionProviderProps {
  children: React.ReactNode
}

export function MobileDetectionProvider({ children }: MobileDetectionProviderProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [detectionMethod, setDetectionMethod] = useState('initializing')

  useEffect(() => {
    const detectMobile = () => {
      // Enhanced mobile detection - EXACTLY same logic as SmoothScrollProvider
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768 || window.screen.width <= 768
      
      // Enhanced dev tools detection
      const isDevToolsMobile = (
        window.innerWidth <= 768 && 
        !isMobileUserAgent && 
        (window.navigator.platform.includes('Mac') || window.navigator.platform.includes('Win') || window.navigator.platform.includes('Linux'))
      )
      
      // iOS specific detection
      const isIOS = /ipad|iphone|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      
      // Final mobile determination - ANY of these conditions = mobile
      const detectedMobile = isMobileUserAgent || isTouchDevice || isSmallScreen || isDevToolsMobile || isIOS
      
      let method = 'unknown'
      if (isMobileUserAgent) method = 'user-agent'
      else if (isTouchDevice) method = 'touch-device'
      else if (isSmallScreen) method = 'small-screen'
      else if (isDevToolsMobile) method = 'dev-tools-mobile'
      else if (isIOS) method = 'ios-detection'
      else method = 'desktop'
      
      setIsMobile(detectedMobile)
      setDetectionMethod(method)
      setIsLoading(false)
      
      return detectedMobile
    }

    // Initial detection
    detectMobile()
    
    // Handle resize events
    const handleResize = () => {
      detectMobile()
    }
    
    window.addEventListener('resize', handleResize)
    
    // Also run detection after a short delay to catch any hydration issues
    const delayedDetection = setTimeout(() => {
      detectMobile()
    }, 100)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(delayedDetection)
    }
  }, [])

  return (
    <MobileDetectionContext.Provider value={{ isMobile, isLoading, detectionMethod }}>
      {children}
    </MobileDetectionContext.Provider>
  )
}
