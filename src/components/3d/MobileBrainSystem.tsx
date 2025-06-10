'use client'

import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface MobileBrainSystemProps {
  children?: React.ReactNode
}

// Ultra-simple CSS-only brain fallback for when everything else fails
function CSSBrainFallback() {
  return (
    <div className="fixed inset-0 z-[-1] flex items-center justify-center">
      <div className="relative">
        {/* Simple CSS brain shape */}
        <div className="w-32 h-24 border rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30 animate-pulse" />
        <div className="absolute w-16 h-12 border rounded-full top-2 left-8 bg-blue-500/10 border-blue-400/20" />
        <div className="absolute w-16 h-12 border rounded-full top-2 right-8 bg-purple-500/10 border-purple-400/20" />
        {/* Pulsing center */}
        <div className="absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-cyan-400 animate-ping" />
      </div>
    </div>
  )
}

// Ultra-simple Three.js brain - guaranteed to work
function UltraSimpleBrain() {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.y = time * 0.05
      meshRef.current.rotation.x = Math.sin(time * 0.02) * 0.1
      
      const scale = 1 + Math.sin(time * 0.5) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      {/* Main brain shape */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[12, 8, 6]} />
        <meshBasicMaterial 
          color="#4f46e5" 
          transparent 
          opacity={0.6}
          wireframe
        />
      </mesh>
      
      {/* Left hemisphere */}
      <mesh position={[-6, 0, 0]}>
        <sphereGeometry args={[6, 6, 4]} />
        <meshBasicMaterial 
          color="#6366f1" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
      
      {/* Right hemisphere */}
      <mesh position={[6, 0, 0]}>
        <sphereGeometry args={[6, 6, 4]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>
    </group>
  )
}

// Simple mobile brain activity hook - no complex dependencies
/*function useSimpleBrainActivity() {
  const [activity, setActivity] = useState({
    neural: 0.5,
    synaptic: 0.5,
    cognitive: 0.5
  })
  
  useEffect(() => {
    let animationId: number
    
    const updateActivity = () => {
      const time = Date.now() * 0.001
      setActivity({
        neural: Math.sin(time * 0.3) * 0.3 + 0.6,
        synaptic: Math.cos(time * 0.4) * 0.2 + 0.5,
        cognitive: Math.sin(time * 0.2) * 0.4 + 0.6
      })
      animationId = requestAnimationFrame(updateActivity)
    }
    
    updateActivity()
    return () => cancelAnimationFrame(animationId)
  }, [])
  
  return activity
}*/

export function MobileBrainSystem({ children }: MobileBrainSystemProps) {
  const [renderState, setRenderState] = useState<'loading' | 'canvas' | 'css-fallback'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  
  const addDebug = (message: string) => {
    setDebugInfo(prev => [...prev.slice(-4), message]) // Keep last 5 messages
  }
  
  useEffect(() => {
    const initializeMobileBrain = async () => {
      try {
        addDebug('Starting mobile brain initialization...')
        
        // Test WebGL support
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        
        if (!gl) {
          addDebug('WebGL not supported - using CSS fallback')
          setRenderState('css-fallback')
          return
        }
        
        addDebug('WebGL supported - proceeding with Canvas')
        
        // Small delay to ensure everything is ready
        await new Promise(resolve => setTimeout(resolve, 200))
        
        addDebug('Initialization complete - setting canvas state')
        setRenderState('canvas')
        addDebug('Canvas brain system ready')
        
      } catch (error) {
        addDebug(`Error during initialization: ${error}`)
        setError(error instanceof Error ? error.message : 'Unknown error')
        setRenderState('css-fallback')
      }
    }
    
    initializeMobileBrain()
  }, [])
  
  // Error boundary for Canvas
  const handleCanvasError = (event: React.SyntheticEvent<HTMLDivElement, Event>) => {
    console.error('🧠📱 MobileBrainSystem: Canvas error:', event)
    addDebug(`Canvas error: ${event.type}`)
    setError('Canvas rendering failed')
    setRenderState('css-fallback')
  }
  
  if (renderState === 'loading') {
    return (
      <>
        <div className="fixed inset-0 z-[-1] flex items-center justify-center bg-slate-900/20">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-xs text-slate-400">Loading Mobile Brain...</p>
          </div>
        </div>
        <div className="relative z-10">{children}</div>
      </>
    )
  }
  
  if (renderState === 'css-fallback') {
    return (
      <>
        <CSSBrainFallback />
        <div className="relative z-10">{children}</div>
        {/* Debug info for CSS fallback */}
        <div className="fixed z-50 max-w-xs p-2 text-xs text-white rounded top-4 right-4 bg-red-900/80">
          <div className="font-bold">CSS Brain Fallback</div>
          {error && <div className="text-red-200">Error: {error}</div>}
          <div className="mt-1 space-y-1">
            {debugInfo.map((info, i) => (
              <div key={i} className="text-gray-300">{info}</div>
            ))}
          </div>
        </div>
      </>
    )
  }
  
  // Canvas rendering
  return (
    <>
      <div className="fixed inset-0 z-[-1]">
        <ErrorBoundary fallback={<CSSBrainFallback />} >
          <Suspense fallback={
            <div className="fixed inset-0 z-0 flex items-center justify-center bg-slate-900/20">
              <div className="text-xs text-slate-400">Loading 3D Brain...</div>
            </div>
          }>
            <Canvas
              frameloop="always" // Use always for better mobile compatibility
              performance={{ min: 0.1 }} // Very low threshold
              camera={{
                position: [0, 0, 50],
                fov: 75,
                near: 0.1,
                far: 200
              }}
              gl={{
                antialias: false,
                alpha: true,
                powerPreference: "low-power",
                precision: "lowp",
                stencil: false,
                depth: true,
                preserveDrawingBuffer: false,
                failIfMajorPerformanceCaveat: false // Don't fail on slow devices
              }}
              dpr={1} // Fixed DPR for consistency
              onError={handleCanvasError}
            >
              {/* Ultra-simple camera */}
              <PerspectiveCamera
                makeDefault
                position={[0, 0, 50]}
                fov={75}
              />
              
              {/* Basic lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 10]} intensity={0.5} />
              
              {/* Ultra-simple brain */}
              <group scale={[1.5, 1.5, 1.5]}>
                <UltraSimpleBrain />
              </group>
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      </div>
      
      <div className="relative z-10">{children}</div>
    </>
  )
}

// Simple Error Boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode
  fallback: React.ReactNode
  onError?: (error: Error) => void
}, { hasError: boolean }> {
  constructor(props: {
    children: React.ReactNode
    fallback: React.ReactNode
    onError?: (error: Error) => void
  }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Mobile Brain Error:', error, errorInfo)
    this.props.onError?.(error)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    
    return this.props.children
  }
}
