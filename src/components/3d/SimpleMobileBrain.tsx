'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function SimpleMobileBrain({ opacity = 0.8 }: { opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      // Simple rotation
      meshRef.current.rotation.y = time * 0.1
      meshRef.current.rotation.x = Math.sin(time * 0.05) * 0.1
      // Simple breathing effect
      const scale = 1 + Math.sin(time * 0.3) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[12, 16, 16]} />
      <meshPhongMaterial 
        color="#4f46e5" 
        transparent 
        opacity={opacity}
        wireframe
      />
    </mesh>
  )
}
