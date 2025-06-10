'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { VictorStyleBrain, useVictorBrainActivity } from './VictorStyleBrain'
import { useNavigationManager } from '@/lib/hooks/useNavigationManager'
import { useScrollProgress } from '@/lib/hooks/useScrollProgress'
import { MobileBrainSystem } from './MobileBrainSystem'
import { useMobileDetection } from '@/components/providers/MobileDetectionProvider'

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

// Desktop Rotating Brain Group
function RotatingBrainGroup({ 
  brainActivity
}: {
  brainActivity: { neural: number; synaptic: number; cognitive: number }
}) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      
      // Initial rotation to reorient the brain - more upright with 45 degree left turn
      const baseRotationZ = Math.PI / 4 // 45 degrees around Z axis (was 90 degrees)
      const baseRotationX = -Math.PI / 4 // Slight tilt up (-30 degrees) for better view
      
      // Continuous slow rotation around Y axis (horizontal spin) - desktop speed
      const rotationY = time * 0.08
      
      // Optional: slight wobble based on brain activity - desktop level
      const activityWobble = (brainActivity.neural + brainActivity.synaptic) * 0.02
      
      groupRef.current.rotation.set(
        baseRotationX + activityWobble, // Base tilt + activity wobble
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
        opacity={0.4} // Desktop opacity
        quality="high" // Desktop quality
        animationSpeed={0.25} // Desktop animation speed
      />
    </group>
  )
}

export function LayeredBrainSystem({ children }: LayeredBrainSystemProps) {  
  // Use shared mobile detection context - this ensures consistent detection across app
  const { isMobile, isLoading: mobileDetectionLoading } = useMobileDetection()
  
  const { navigationState } = useNavigationManager({
    transitionDuration: 2000,
    onRegionChange: () => {}
  })
  
  const { scrollProgress } = useScrollProgress()
  
  const brainActivity = useVictorBrainActivity(0.05)
  
  if (mobileDetectionLoading) {
    return (
      <>
        <BrainLoadingFallback />
        <div className="relative z-10">
          {children}
        </div>
      </>
    )
  }

  if (isMobile) {
    return <MobileBrainSystem>{children}</MobileBrainSystem>
  }

  // Desktop rendering - all hooks have been called consistently
  const currentRegion = navigationState.brainRegion || 'consciousness'
  
  // Use scroll progress for desktop (mobile has already returned at this point)
  const effectiveScrollProgress = scrollProgress

  return (
    <>
      {/* Brain Background - Same rendering for all devices */}
      <div className="fixed inset-0 z-[-1]">
        <Suspense fallback={<BrainLoadingFallback />}>
          <Canvas
            frameloop="always" // Always render for consistency
            performance={{ min: 0.2 }}
            camera={{
              position: [0, 0, 60],
              fov: 75,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: false,
              alpha: true,
              powerPreference: isMobile ? "low-power" : "high-performance",
              precision: "lowp"
            }}
            dpr={[1, 2]} // Standard DPR for all devices
          >
            <BrainCamera
              scrollProgress={effectiveScrollProgress}
              region={currentRegion}
              isTransitioning={navigationState.isTransitioning}
            />
            
            <BrainLighting
              region={currentRegion}
              intensity={0.5}
              brainActivity={brainActivity}
            />
            
            {/* Brain - Desktop version with scroll-based rotation */}
            <group scale={[2.2, 2.2, 2.2]} position={[0, 0, -15]}>
              <RotatingBrainGroup brainActivity={brainActivity} />
            </group>
          </Canvas>
        </Suspense>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}

// Simplified camera system for desktop
function BrainCamera({ 
  scrollProgress,
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
      
      // Only use scroll influence on desktop (no mobile users reach this function)
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
  intensity,  
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
