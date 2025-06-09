'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { VictorStyleBrain, useVictorBrainActivity } from './VictorStyleBrain'
import { useNavigationManager } from '@/lib/hooks/useNavigationManager'
import { useScrollProgress } from '@/lib/hooks/useScrollProgress'

interface LayeredBrainSystemProps {
  children?: React.ReactNode
}

function BrainLoadingFallback() {
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center bg-slate-900/20">
      <div className="text-center">
        <div className="relative">
          {/* Simple brain loading animation */}
          <div className="relative w-20 h-16 mx-auto mb-4 overflow-hidden border-2 rounded-full border-slate-600/50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"></div>
            <div className="absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-cyan-400/60 animate-ping"></div>
          </div>
          <p className="font-mono text-sm text-slate-400">Initializing Neural Interface...</p>
        </div>
      </div>
    </div>
  )
}

// Rotating Brain Group with proper orientation
function RotatingBrainGroup({ 
  brainActivity 
}: {
  brainActivity: { neural: number; synaptic: number; cognitive: number }
}) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      
      // Initial rotation to reorient the brain (Y axis becomes X axis)
      const baseRotationZ = Math.PI / 2 // 90 degrees around Z axis
      
      // Continuous slow rotation around Y axis (horizontal spin)
      const rotationY = time * 0.05
      
      // Optional: slight wobble based on brain activity
      const activityWobble = (brainActivity.neural + brainActivity.synaptic) * 0.02
      
      groupRef.current.rotation.set(
        activityWobble, // Removed tilt - only keep activity wobble
        rotationY,
        baseRotationZ
      )
    }
  })
  
  return (
    <group ref={groupRef}>
      <VictorStyleBrain
        brainActivity={brainActivity}
        scale={1}
        animated={true}
        opacity={0.4}
        quality="medium"
        animationSpeed={0.2} // VERY SLOW 3D brain animation
      />
    </group>
  )
}

export function LayeredBrainSystem({ children }: LayeredBrainSystemProps) {
  const { navigationState } = useNavigationManager({
    transitionDuration: 2000,
    onRegionChange: (region) => {
      // Region change handler
    }
  })
  
  const { scrollProgress } = useScrollProgress()
  const brainActivity = useVictorBrainActivity(0.05) // VERY SLOW brain activity hook
  
  const currentRegion = navigationState.brainRegion || 'consciousness'

  return (
    <>
      {/* Single Optimized Brain Background */}
      <div className="fixed inset-0 z-[-1]">
        <Suspense fallback={<BrainLoadingFallback />}>
          <Canvas
            frameloop="demand" // Only render when needed
            performance={{ min: 0.2 }} // Allow lower performance
            camera={{
              position: [0, 0, 60],
              fov: 75,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: false, // Disable for performance
              alpha: true,
              powerPreference: "high-performance",
              precision: "lowp" // Lower precision for speed
            }}
            dpr={[1, 1.5]} // Limit device pixel ratio
          >
            <BrainCamera
              scrollProgress={scrollProgress}
              region={currentRegion}
              isTransitioning={navigationState.isTransitioning}
            />
            
            <BrainLighting
              region={currentRegion}
              intensity={0.5}
              brainActivity={brainActivity}
            />
            
            {/* Single Large Background Brain - Victor Style - RE-ENABLED */}
            <group scale={[2.5, 2.5, 2.5]} position={[0, 0, -15]}>
              <RotatingBrainGroup brainActivity={brainActivity} />
            </group>
          </Canvas>
        </Suspense>
      </div>

      {/* Content Layer - Your page content goes here */}
      <div className="relative z-10">
        {children}
      </div>

    </>
  )
}

// Simplified camera system
function BrainCamera({ 
  scrollProgress, 
  region, 
  isTransitioning
}: {
  scrollProgress: number
  region: string
  isTransitioning: boolean
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)
  
  useFrame((state) => {
    if (cameraRef.current) {
      const time = state.clock.elapsedTime
      
      // Simplified camera movement
      const brainFloat = Math.sin(time * 0.02) * 1
      const scrollInfluence = scrollProgress * 2
      
      cameraRef.current.position.y = brainFloat - scrollInfluence * 0.05
      cameraRef.current.position.z = 60 + Math.sin(time * 0.01) * 2
      
      const lookTarget = new THREE.Vector3(0, 0, 0)
      cameraRef.current.lookAt(lookTarget)
    }
  })
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={75}
      near={0.1}
      far={1000}
      position={[0, 0, 60]}
    />
  )
}

// Simplified lighting system
function BrainLighting({ 
  region, 
  intensity, 
  brainActivity 
}: {
  region: string
  intensity: number
  brainActivity: { neural: number; synaptic: number; cognitive: number }
}) {
  return (
    <group>
      <ambientLight intensity={0.2} color="#475569" />
      <directionalLight 
        position={[10, 12, 15]} 
        intensity={intensity} 
        color="#64748b"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={0.1}
        color="#94a3b8"
        distance={40}
        decay={2}
      />
    </group>
  )
}
