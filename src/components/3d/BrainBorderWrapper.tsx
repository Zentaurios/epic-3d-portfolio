'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { BRAIN_COLORS } from '@/lib/utils/constants'

interface BrainBorderWrapperProps {
  scrollProgress: number
  scrollVelocity: number
  currentRegion: 'consciousness' | 'memory' | 'creativity' | 'logic'
  isTransitioning: boolean
}

export function BrainBorderWrapper({ 
  scrollProgress = 0, 
  scrollVelocity = 0, 
  currentRegion = 'consciousness',
  isTransitioning = false 
}: BrainBorderWrapperProps) {
  const brainBorderRef = useRef<THREE.Group>(null!)
  const sparksRef = useRef<THREE.Points>(null!)
  const tissueRef = useRef<THREE.Points>(null!)
  
  const regionColors = BRAIN_COLORS[currentRegion]
  
  // Create brain tissue border points
  const tissueData = useMemo(() => {
    const count = 8000 // Dense tissue appearance
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    const primaryColor = new THREE.Color(regionColors.primary)
    const secondaryColor = new THREE.Color(regionColors.secondary)
    const accentColor = new THREE.Color(regionColors.accent)
    
    for (let i = 0; i < count; i++) {
      // Create brain tissue in viewport border regions
      const angle = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      // Focus tissue on viewport edges - create border effect
      const borderBias = Math.random()
      let radius: number
      
      if (borderBias > 0.85) {
        // Outer edge tissue (viewport frame)
        radius = 45 + Math.random() * 15
      } else if (borderBias > 0.6) {
        // Mid tissue layer
        radius = 35 + Math.random() * 10
      } else {
        // Inner sparse tissue (fades toward center)
        radius = 25 + Math.random() * 10
      }
      
      // Convert to viewport coordinates (-1 to 1 screen space)
      const x = radius * Math.sin(phi) * Math.cos(angle)
      const y = radius * Math.sin(phi) * Math.sin(angle) 
      const z = radius * Math.cos(phi)
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      // Color based on distance from center (tissue depth)
      const distanceFromCenter = Math.sqrt(x * x + y * y + z * z)
      let color: THREE.Color
      
      if (distanceFromCenter > 50) {
        color = primaryColor.clone().multiplyScalar(0.8) // Outer cortex
      } else if (distanceFromCenter > 35) {
        color = secondaryColor.clone().multiplyScalar(0.6) // Mid tissue
      } else {
        color = accentColor.clone().multiplyScalar(0.3) // Inner fade
      }
      
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
      
      // Size based on depth - larger at edges
      sizes[i] = distanceFromCenter > 40 ? 0.04 + Math.random() * 0.02 : 0.01 + Math.random() * 0.01
    }
    
    return { positions, colors, sizes, count }
  }, [regionColors])
  
  // Create neural sparks for activity
  const sparkData = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    
    const sparkColor = new THREE.Color(regionColors.accent)
    
    for (let i = 0; i < count; i++) {
      // Place sparks primarily on tissue border
      const angle = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 40 + Math.random() * 20 // Edge placement
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(angle)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(angle)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      colors[i * 3] = sparkColor.r
      colors[i * 3 + 1] = sparkColor.g
      colors[i * 3 + 2] = sparkColor.b
      
      phases[i] = Math.random() * Math.PI * 2
    }
    
    return { positions, colors, phases, count }
  }, [regionColors])
  
  useFrame((state) => {
    if (brainBorderRef.current && sparksRef.current && tissueRef.current) {
      const time = state.clock.elapsedTime
      
      // Brain tissue pulsing based on region and scroll activity
      const basePulse = Math.sin(time * 0.5) * 0.05 + 1
      const scrollPulse = Math.min(scrollVelocity * 2, 0.3) // Cap scroll influence
      const activityPulse = isTransitioning ? Math.sin(time * 4) * 0.2 + 1 : 1
      
      const totalPulse = basePulse + scrollPulse * activityPulse
      brainBorderRef.current.scale.setScalar(totalPulse)
      
      // Tissue material pulsing
      const tissueMaterial = tissueRef.current.material as THREE.PointsMaterial
      tissueMaterial.opacity = 0.15 + scrollVelocity * 0.2 + (isTransitioning ? 0.2 : 0)
      
      // Neural spark activity based on scroll velocity
      const sparkMaterial = sparksRef.current.material as THREE.PointsMaterial
      const sparkActivity = Math.sin(time * 3 + scrollProgress * 5) * 0.5 + 0.5
      const velocityBoost = Math.min(scrollVelocity * 3, 1) // More dramatic response
      
      sparkMaterial.opacity = 0.3 + sparkActivity * 0.4 + velocityBoost * 0.3
      sparkMaterial.size = 0.02 + velocityBoost * 0.04 + (isTransitioning ? 0.02 : 0)
      
      // Animate individual sparks
      const sparkPositions = sparksRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < sparkData.count; i++) {
        const i3 = i * 3
        
        // Create firing patterns across tissue
        const sparkPhase = sparkData.phases[i]
        const firingWave = Math.sin(time * 2 + sparkPhase + scrollProgress * 4)
        
        if (firingWave > 0.8 - velocityBoost) {
          // Spark animation - quick burst
          const burstIntensity = (firingWave - 0.8 + velocityBoost) * 10
          sparkPositions[i3] += (Math.random() - 0.5) * burstIntensity * 0.1
          sparkPositions[i3 + 1] += (Math.random() - 0.5) * burstIntensity * 0.1
          sparkPositions[i3 + 2] += (Math.random() - 0.5) * burstIntensity * 0.1
        } else {
          // Return to original position slowly
          const originalIndex = i
          const targetX = sparkData.positions[i3]
          const targetY = sparkData.positions[i3 + 1]
          const targetZ = sparkData.positions[i3 + 2]
          
          sparkPositions[i3] += (targetX - sparkPositions[i3]) * 0.02
          sparkPositions[i3 + 1] += (targetY - sparkPositions[i3 + 1]) * 0.02
          sparkPositions[i3 + 2] += (targetZ - sparkPositions[i3 + 2]) * 0.02
        }
      }
      
      sparksRef.current.geometry.attributes.position.needsUpdate = true
      
      // Region-specific brain border rotation
      switch (currentRegion) {
        case 'consciousness':
          brainBorderRef.current.rotation.y = time * 0.05
          brainBorderRef.current.rotation.x = Math.sin(time * 0.3) * 0.02
          break
        case 'memory':
          brainBorderRef.current.rotation.y = time * 0.08
          brainBorderRef.current.rotation.z = Math.sin(time * 0.4) * 0.03
          break
        case 'creativity':
          brainBorderRef.current.rotation.x = Math.sin(time * 0.2) * 0.05
          brainBorderRef.current.rotation.z = Math.cos(time * 0.15) * 0.03
          break
        case 'logic':
          brainBorderRef.current.rotation.y = time * 0.03
          brainBorderRef.current.rotation.x = Math.cos(time * 0.25) * 0.02
          break
      }
    }
  })
  
  return (
    <group ref={brainBorderRef}>
      {/* Brain Tissue Border */}
      <Points ref={tissueRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[tissueData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[tissueData.colors, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.15}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Neural Activity Sparks */}
      <Points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[sparkData.colors, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.02}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Outer Brain Membrane */}
      <Sphere args={[58, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={regionColors.primary}
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Inner fade sphere */}
      <Sphere args={[30, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color={regionColors.accent}
          transparent
          opacity={0.01}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  )
}
