'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { BrainUniverse } from './BrainUniverse'
import { ScrollCamera, ModernLighting } from './ModernCamera'
import { useNavigationManager, useBrainActivity } from '@/lib/hooks/useNavigationManager'
import { useScrollProgress } from '@/lib/hooks/useScrollProgress'
import { useScrollVelocity } from '@/lib/hooks/useScrollVelocity'

interface BrainUniverseWrapperProps {
  children?: React.ReactNode
}

function BrainUniverseLoadingFallback() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900 to-black">
      <div className="text-center">
        <div className="relative">
          {/* Animated brain outline */}
          <div className="relative w-24 h-20 mx-auto mb-4 overflow-hidden border-2 border-purple-400 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
            {/* Neural connections */}
            <div className="absolute w-1 h-1 bg-blue-400 rounded-full top-1/2 left-1/4 animate-ping"></div>
            <div className="absolute w-1 h-1 delay-500 rounded-full top-1/3 right-1/4 bg-cyan-400 animate-ping"></div>
            <div className="absolute w-1 h-1 delay-1000 bg-purple-400 rounded-full bottom-1/3 left-1/3 animate-ping"></div>
          </div>
          <p className="text-purple-300 animate-pulse">Initializing Neural Universe...</p>
          <p className="mt-2 text-sm text-purple-400/70">Connecting consciousness...</p>
        </div>
      </div>
    </div>
  )
}

export function BrainUniverseWrapper({ children }: BrainUniverseWrapperProps) {
  console.log('🧠 BrainUniverseWrapper starting render...')
  
  // Initialize hooks at component level (not inside try-catch)
  const { navigationState, getTransitionProps } = useNavigationManager({
    transitionDuration: 2000,
    onRegionChange: (region) => {
      console.log(`Navigating to brain region: ${region}`)
    }
  })
  
  const { scrollProgress } = useScrollProgress()
  const { scrollVelocity, scrollDirection } = useScrollVelocity()
  const brainActivity = useBrainActivity()
  
  try {
    const transitionProps = getTransitionProps()
    
    // Get current brain region for color sync
    const currentRegion = navigationState.brainRegion || 'consciousness'
    
    console.log('🧠 BrainUniverseWrapper render:', {
      scrollProgress: scrollProgress.toFixed(3),
      scrollVelocity: scrollVelocity.toFixed(3),
      scrollDirection,
      currentRegion,
      isTransitioning: navigationState.isTransitioning
    })
    
  } catch (error) {
    console.error('🚨 BrainUniverseWrapper hook error:', error)
    // Don't return early - continue with rendering using default values
  }

  return (
    <>
      {/* 
        🧠 BRAIN 3D EXPERIENCE LAYERING SYSTEM (Highest to Lowest Z-Index):
        
        Layer 1: Brain Navigation & Side Navigation (z-index: 99999)
          - BrainNavigationDemo: Top-right brain region selector
          - SectionNavigation: Right-side scroll indicators
          - Always clickable and visible above all content
        
        Layer 2: 3D Brain Border Wrapper (z-index: 0, but in 3D space)
          - Brain tissue border around viewport edges
          - Neural sparks and pulsating activity
          - Responds to scroll velocity and brain region colors
          - Fades to transparent center for content visibility
        
        Layer 3: Page Content (z-index: 10)
          - All page sections and text content
          - Glass morphism effects for readability
          - Overlays the 3D background
        
        Layer 4: Enhanced 3D Background Canvas (z-index: 0, deepest 3D)
          - Enhanced neural networks with 50% more visibility
          - Inner cortex energy effects
          - Neural connection webs
          - Responds to scroll and brain region transitions
      */}
      
      {/* Fixed 3D Brain Universe Background */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<BrainUniverseLoadingFallback />}>
          <Canvas
            camera={{
              position: [0, 0, 50],
              fov: 75,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance"
            }}
            dpr={[1, 2]}
            performance={{
              min: 0.5,
              max: 1
            }}
          >
            {/* Dynamic Camera System */}
            <ScrollCamera
              scrollProgress={scrollProgress}
              region={navigationState.brainRegion}
              isTransitioning={navigationState.isTransitioning}
            />
            
            {/* Adaptive Brain Lighting */}
            <ModernLighting
              scrollProgress={scrollProgress}
              region={navigationState.brainRegion}
              intensity={brainActivity.neural}
            />
            
            {/* Main Brain Universe Scene */}
            <BrainUniverse
              scrollProgress={scrollProgress}
              currentRoute={navigationState.currentRoute}
              isTransitioning={navigationState.isTransitioning}
            />

          </Canvas>
        </Suspense>
      </div>

      {/* Content overlay - Layer 3: Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  )
}
