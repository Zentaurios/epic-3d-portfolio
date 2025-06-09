'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

interface PerformanceMonitorProps {
  onPerformanceUpdate?: (metrics: {
    fps: number
    deltaTime: number
    frameTime: number
  }) => void
}

export function PerformanceMonitor({ onPerformanceUpdate }: PerformanceMonitorProps) {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const lastFPSUpdate = useRef(performance.now())
  const currentFPS = useRef(60)
  
  useFrame((_, deltaTime) => {
    frameCount.current++
    const now = performance.now()
    
    // Calculate FPS every second
    if (now - lastFPSUpdate.current >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / (now - lastFPSUpdate.current))
      currentFPS.current = fps
      frameCount.current = 0
      lastFPSUpdate.current = now
      
      if (onPerformanceUpdate) {
        onPerformanceUpdate({
          fps,
          deltaTime,
          frameTime: now - lastTime.current
        })
      }
      
      // Console log performance for debugging (can be removed in production)
      if (fps < 30) {
        console.warn('🐌 Low FPS detected:', fps, 'fps')
      } else if (fps < 45) {
        console.log('⚡ Moderate performance:', fps, 'fps')
      }
    }
    
    lastTime.current = now
  })
  
  // This component doesn't render anything visible
  return null
}

// Helper function to get performance-appropriate settings
export function getPerformanceSettings(fps: number) {
  if (fps >= 50) {
    return {
      particleCount: 'high',
      neuronDensity: 1.0,
      effectIntensity: 1.0,
      animationSpeed: 1.0
    }
  } else if (fps >= 30) {
    return {
      particleCount: 'medium',
      neuronDensity: 0.7,
      effectIntensity: 0.8,
      animationSpeed: 0.9
    }
  } else {
    return {
      particleCount: 'low',
      neuronDensity: 0.5,
      effectIntensity: 0.6,
      animationSpeed: 0.8
    }
  }
}
