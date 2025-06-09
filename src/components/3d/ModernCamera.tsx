'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { BRAIN_CAMERA_CONFIGS, BRAIN_COLORS } from '@/lib/utils/constants'

interface ScrollCameraProps {
  scrollProgress: number
  region: 'consciousness' | 'memory' | 'creativity' | 'logic'
  isTransitioning: boolean
}

export function ScrollCamera({ scrollProgress, region, isTransitioning }: ScrollCameraProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)
  const { set } = useThree()
  
  useEffect(() => {
    if (cameraRef.current) {
      set({ camera: cameraRef.current })
    }
  }, [set])
  
  useFrame((state) => {
    if (cameraRef.current) {
      const time = state.clock.elapsedTime
      
      // Use brain camera configurations from constants
      const config = BRAIN_CAMERA_CONFIGS[region]
      const [baseX, baseY, baseZ] = config.basePosition
      
      // Smooth camera movement with scroll and region-specific behavior
      const scrollOffset = scrollProgress * 10
      
      // Add organic movement based on brain region
      const organicX = Math.sin(time * config.movement.x) * 2
      const organicY = Math.cos(time * config.movement.y) * 1.5
      const organicZ = Math.sin(time * config.movement.z + scrollProgress) * 1
      
      cameraRef.current.position.x = baseX + organicX
      cameraRef.current.position.y = baseY + organicY - scrollOffset * 0.2
      cameraRef.current.position.z = baseZ + organicZ - scrollOffset * 0.3
      
      // Dynamic look-at target based on region
      const [targetX, targetY, targetZ] = config.lookAt
      const target = new THREE.Vector3(
        targetX + Math.sin(scrollProgress * 0.5) * 1,
        targetY + Math.cos(scrollProgress * 0.8) * 0.5,
        targetZ + scrollOffset * 0.1
      )
      
      cameraRef.current.lookAt(target)
      
      // Transition effects
      if (isTransitioning) {
        const transitionIntensity = Math.sin(time * 6) * 0.5 + 0.5
        cameraRef.current.position.x += (Math.random() - 0.5) * transitionIntensity
        cameraRef.current.position.y += (Math.random() - 0.5) * transitionIntensity * 0.5
      }
    }
  })
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={75}
      near={0.1}
      far={200}
      position={[0, 2, 15]}
    />
  )
}

interface ModernLightingProps {
  scrollProgress: number
  region: 'consciousness' | 'memory' | 'creativity' | 'logic'
  intensity: number
}

export function ModernLighting({ scrollProgress, region, intensity }: ModernLightingProps) {
  const mainLightRef = useRef<THREE.DirectionalLight>(null!)
  const accentLightRef = useRef<THREE.PointLight>(null!)
  const ambientLightRef = useRef<THREE.AmbientLight>(null!)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Use brain colors from constants with enhanced lighting properties
    const brainColor = BRAIN_COLORS[region]
    const lightConfig = {
      mainColor: brainColor.secondary,
      accentColor: brainColor.primary,
      ambientColor: brainColor.accent,
      intensity: region === 'creativity' ? 0.8 : region === 'consciousness' ? 0.6 : region === 'memory' ? 0.4 : 0.3,
      pulse: region === 'creativity' ? 1.2 : region === 'consciousness' ? 0.8 : region === 'memory' ? 0.6 : 0.4
    }
    
    const config = lightConfig
    
    if (mainLightRef.current) {
      // Main light follows brain activity
      mainLightRef.current.position.x = Math.sin(scrollProgress * 2 + time * 0.3) * 15
      mainLightRef.current.position.y = 8 + Math.cos(scrollProgress + time * 0.2) * 5
      mainLightRef.current.position.z = Math.cos(scrollProgress * 1.5) * 10
      
      mainLightRef.current.intensity = (config.intensity + scrollProgress * 0.3) * intensity
      mainLightRef.current.color.setHex(parseInt(config.mainColor.replace('#', ''), 16))
    }
    
    if (accentLightRef.current) {
      // Accent light pulses with neural activity
      const neuralPulse = Math.sin(time * config.pulse + scrollProgress * 4) * 0.5 + 0.5
      accentLightRef.current.intensity = neuralPulse * 0.6 * intensity
      
      // Move light in brain-like patterns
      accentLightRef.current.position.x = Math.cos(scrollProgress * 3 + time * 0.4) * 12
      accentLightRef.current.position.y = Math.sin(time * 0.5) * 6
      accentLightRef.current.position.z = Math.sin(scrollProgress * 2 + time * 0.3) * 8
      
      accentLightRef.current.color.setHex(parseInt(config.accentColor.replace('#', ''), 16))
    }
    
    if (ambientLightRef.current) {
      // Ambient light changes with brain state
      const baseAmbient = 0.08 + scrollProgress * 0.04
      const brainWave = Math.sin(time * 0.3 + scrollProgress) * 0.02
      
      ambientLightRef.current.intensity = (baseAmbient + brainWave) * intensity
      ambientLightRef.current.color.setHex(parseInt(config.ambientColor.replace('#', ''), 16))
    }
  })
  
  return (
    <group>
      {/* Main directional light */}
      <directionalLight
        ref={mainLightRef}
        position={[5, 5, 5]}
        intensity={0.4}
        color="#e2e8f0"
        castShadow={false}
      />
      
      {/* Accent point light */}
      <pointLight
        ref={accentLightRef}
        position={[0, 0, 0]}
        intensity={0.3}
        color="#64748b"
        distance={20}
        decay={2}
      />
      
      {/* Subtle ambient */}
      <ambientLight
        ref={ambientLightRef}
        intensity={0.06}
        color="#1e293b"
      />
      
      {/* Atmospheric fog */}
      <fog attach="fog" args={['#0f172a', 20, 100]} />
    </group>
  )
}
