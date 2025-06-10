'use client'

import { useState, useEffect } from 'react'
import { useScrollProgress } from '@/lib/hooks/useScrollProgress'
import { useScrollVelocity } from '@/lib/hooks/useScrollVelocity'
import { MobileScrollValidator } from '@/lib/utils/mobileScrollValidator'

export function MobileScrollTest() {
  const [isVisible, setIsVisible] = useState(false)
  const [forceMobileMode, setForceMobileMode] = useState(false)
  const [validationResult, setValidationResult] = useState<string>('')
  const [deviceInfo, setDeviceInfo] = useState<{
    userAgent: string
    isMobile: boolean
    touchSupport: boolean
    screenSize: string
    lenisActive: boolean
  }>({
    userAgent: '',
    isMobile: false,
    touchSupport: false,
    screenSize: '',
    lenisActive: false
  })
  
  const { scrollProgress, scrollDirection, isScrolling } = useScrollProgress()
  const { scrollVelocity } = useScrollVelocity()

  const runValidation = async () => {
    const validator = new MobileScrollValidator()
    const result = await validator.runValidation()
    setValidationResult(validator.generateReport())
    console.log('Mobile Scroll Validation:', result)
  }

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    const detectDevice = () => {
      const userAgent = navigator.userAgent
      const isMobile = forceMobileMode || 
                      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent.toLowerCase()) ||
                      ('ontouchstart' in window && window.innerWidth <= 768)
      const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const screenSize = `${window.innerWidth}x${window.innerHeight}`
      const lenisActive = !!(window as { lenis?: object }).lenis
      
      setDeviceInfo({
        userAgent: userAgent.substring(0, 50) + '...',
        isMobile,
        touchSupport,
        screenSize,
        lenisActive
      })
    }

    detectDevice()
    
    // Show debug panel after a short delay
    setTimeout(() => setIsVisible(true), 1000)
    
    // Update device info on resize
    window.addEventListener('resize', detectDevice)
    return () => window.removeEventListener('resize', detectDevice)
  }, [forceMobileMode])

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-[100] max-w-xs">
      <div className="bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-cyan-400 font-semibold">Mobile Scroll Debug</h3>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-1 text-gray-300">
          <div className="flex justify-between">
            <span>Mobile:</span>
            <span className={deviceInfo.isMobile ? 'text-green-400' : 'text-red-400'}>
              {deviceInfo.isMobile ? 'YES' : 'NO'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Force Mobile:</span>
            <button 
              onClick={() => setForceMobileMode(!forceMobileMode)}
              className={`text-xs px-1 rounded ${forceMobileMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}
            >
              {forceMobileMode ? 'ON' : 'OFF'}
            </button>
          </div>
          
          <div className="flex justify-between">
            <span>Touch:</span>
            <span className={deviceInfo.touchSupport ? 'text-green-400' : 'text-red-400'}>
              {deviceInfo.touchSupport ? 'YES' : 'NO'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Lenis:</span>
            <span className={deviceInfo.lenisActive ? 'text-green-400' : 'text-red-400'}>
              {deviceInfo.lenisActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Screen:</span>
            <span className="text-blue-400">{deviceInfo.screenSize}</span>
          </div>
          
          <hr className="border-gray-600 my-2" />
          
          <div className="flex justify-between">
            <span>Progress:</span>
            <span className="text-yellow-400">{(scrollProgress * 100).toFixed(1)}%</span>
          </div>
          
          <div className="flex justify-between">
            <span>Velocity:</span>
            <span className="text-purple-400">{scrollVelocity.toFixed(3)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Direction:</span>
            <span className={`${scrollDirection === 'down' ? 'text-green-400' : scrollDirection === 'up' ? 'text-red-400' : 'text-gray-400'}`}>
              {scrollDirection.toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Scrolling:</span>
            <span className={isScrolling ? 'text-green-400' : 'text-gray-400'}>
              {isScrolling ? 'YES' : 'NO'}
            </span>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            UA: {deviceInfo.userAgent}
          </div>
          
          <div className="mt-3 space-y-2">
            <button 
              onClick={runValidation}
              className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
            >
              Run Scroll Test
            </button>
            
            {validationResult && (
              <div className="max-h-32 overflow-y-auto text-xs text-gray-400 bg-gray-900 p-2 rounded">
                <pre className="whitespace-pre-wrap">{validationResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
