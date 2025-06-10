'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FallbackBrainProps {
  brainActivity?: {
    neural: number
    synaptic: number
    cognitive: number
  }
  opacity?: number
}

export function FallbackBrain({ 
  brainActivity = { neural: 0.5, synaptic: 0.5, cognitive: 0.5 },
  opacity = 0.8 
}: FallbackBrainProps) {
  const mainBrainRef = useRef<THREE.Mesh>(null!)
  const leftHemisphereRef = useRef<THREE.Mesh>(null!)
  const rightHemisphereRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (mainBrainRef.current) {
      // Simple rotation
      mainBrainRef.current.rotation.y = time * 0.02
      mainBrainRef.current.rotation.x = Math.sin(time * 0.01) * 0.05
      
      // Breathing effect
      const scale = 1 + Math.sin(time * 0.3) * 0.03 * brainActivity.neural
      mainBrainRef.current.scale.setScalar(scale)
    }
    
    // Neural activity pulses
    if (leftHemisphereRef.current && rightHemisphereRef.current) {
      const neuralPulse = Math.sin(time * 2) * 0.1 * brainActivity.synaptic + 1
      leftHemisphereRef.current.scale.setScalar(neuralPulse)
      rightHemisphereRef.current.scale.setScalar(neuralPulse * 0.98)
    }
  })

  return (
    <group ref={mainBrainRef}>
      {/* Main brain shape */}
      <mesh>
        <sphereGeometry args={[12, 16, 12]} />
        <meshPhongMaterial 
          color="#4f46e5" 
          transparent 
          opacity={opacity * 0.3}
          wireframe
        />
      </mesh>
      
      {/* Left hemisphere */}
      <mesh ref={leftHemisphereRef} position={[-6, 2, 0]}>
        <sphereGeometry args={[8, 12, 10]} />
        <meshPhongMaterial 
          color="#6366f1" 
          transparent 
          opacity={opacity * 0.6}
          wireframe
        />
      </mesh>
      
      {/* Right hemisphere */}
      <mesh ref={rightHemisphereRef} position={[6, 2, 0]}>
        <sphereGeometry args={[8, 12, 10]} />
        <meshPhongMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={opacity * 0.6}
          wireframe
        />
      </mesh>
      
      {/* Cerebellum */}
      <mesh position={[0, -8, -6]}>
        <sphereGeometry args={[5, 10, 8]} />
        <meshPhongMaterial 
          color="#a855f7" 
          transparent 
          opacity={opacity * 0.7}
          wireframe
        />
      </mesh>
      
      {/* Brain stem */}
      <mesh position={[0, -4, -2]}>
        <cylinderGeometry args={[1.5, 2, 6, 8]} />
        <meshPhongMaterial 
          color="#ef4444" 
          transparent 
          opacity={opacity * 0.8}
        />
      </mesh>
    </group>
  )
}
