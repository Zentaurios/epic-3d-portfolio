'use client'

import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

interface OptimizedBrainProps {
  brainActivity?: {
    neural: number
    synaptic: number
    cognitive: number
  }
  scale?: number
  animated?: boolean
  opacity?: number
  quality?: 'low' | 'medium' | 'high'
}

// Optimized brain structure - much fewer nodes for performance
const createOptimizedBrain = (quality: 'low' | 'medium' | 'high' = 'high') => {
  const densityMap = {
    low: { nodes: 200, connections: 50 },
    medium: { nodes: 800, connections: 200 },
    high: { nodes: 1500, connections: 400 }
  }
  
  const config = densityMap[quality]
  interface BrainNode {
    position: [number, number, number]
    region: number
    activation: number
  }



  const nodes: BrainNode[] = []
  const connections = []
  
  // Fewer, strategically placed brain regions
  const regions = [
    { center: [-12, 5, 8], radius: 8, density: Math.floor(config.nodes * 0.25), name: 'frontal_left' },
    { center: [12, 5, 8], radius: 8, density: Math.floor(config.nodes * 0.25), name: 'frontal_right' },
    { center: [-15, 0, 0], radius: 6, density: Math.floor(config.nodes * 0.2), name: 'temporal_left' },
    { center: [15, 0, 0], radius: 6, density: Math.floor(config.nodes * 0.2), name: 'temporal_right' },
    { center: [0, -8, -12], radius: 5, density: Math.floor(config.nodes * 0.1), name: 'cerebellum' },
  ]
  
  // Generate nodes with simplified distribution
  regions.forEach((region, regionIndex) => {
    for (let i = 0; i < region.density; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(1 - 2 * Math.random())
      const r = Math.pow(Math.random(), 0.7) * region.radius
      
      const x = region.center[0] + r * Math.sin(phi) * Math.cos(theta)
      const y = region.center[1] + r * Math.sin(phi) * Math.sin(theta)
      const z = region.center[2] + r * Math.cos(phi)
      
      nodes.push({
        position: [x, y, z],
        region: regionIndex,
        activation: Math.random()
      })
    }
  })
  
  // Generate fewer, key connections
  for (let i = 0; i < config.connections; i++) {
    const nodeA = nodes[Math.floor(Math.random() * nodes.length)]
    const nodeB = nodes[Math.floor(Math.random() * nodes.length)]
    
    if (nodeA !== nodeB) {
      connections.push({
        from: nodeA,
        to: nodeB,
        strength: Math.random(),
        type: nodeA.region === nodeB.region ? 'intra' : 'inter'
      })
    }
  }
  
  return { nodes, connections }
}

export function OptimizedBrain({
  brainActivity = { neural: 0.5, synaptic: 0.5, cognitive: 0.5 },
  scale = 1,
  animated = true,
  opacity = 0.9,
  quality = 'high'
}: OptimizedBrainProps) {
  const brainGroupRef = useRef<THREE.Group>(null!)
  const connectionsRef = useRef<any[]>([])
  const lastUpdateTime = useRef(0)
  const animationPhase = useRef(0)
  
  // Generate optimized brain structure
  const brainData = useMemo(() => createOptimizedBrain(quality), [quality])
  
  // Pre-compute geometry once
  const brainGeometry = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []
    const sizes: number[] = []
    
    brainData.nodes.forEach(node => {
      positions.push(...node.position)
      
      // Enhanced color scheme - more vibrant and pronounced
      const regionColors = [
        [0.2, 0.8, 1.0], // frontal - bright cyan
        [0.2, 0.8, 1.0], // frontal - bright cyan  
        [0.8, 0.2, 1.0], // temporal - bright magenta
        [0.8, 0.2, 1.0], // temporal - bright magenta
        [1.0, 0.6, 0.0], // cerebellum - bright orange
      ]
      
      const regionColor = regionColors[node.region] || [0.6, 0.6, 0.6]
      colors.push(...regionColor)
      sizes.push(1.2 + node.activation * 0.8) // Larger, more visible nodes
    })
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      originalColors: new Float32Array(colors) // Store original for reset
    }
  }, [brainData])
  
  // Throttled animation - only update 15fps instead of 60fps
  useFrame((state) => {
    if (!brainGroupRef.current || !animated) return
    
    const time = state.clock.elapsedTime
    const deltaTime = time - lastUpdateTime.current
    
    // Update only every 4 frames (15fps instead of 60fps)
    if (deltaTime < 0.066) return // ~15fps
    lastUpdateTime.current = time
    
    // Simplified rotation
    const rotationSpeed = 0.001 + brainActivity.neural * 0.001
    brainGroupRef.current.rotation.y += rotationSpeed
    
    // Simplified scaling
    const cognitiveScale = 1 + brainActivity.cognitive * 0.05
    brainGroupRef.current.scale.setScalar(scale * cognitiveScale)
    
    // Update animation phase
    animationPhase.current = time * 0.5
    
    // Simplified color updates - only update a portion each frame
    const colors = brainGeometry.colors
    const originalColors = brainGeometry.originalColors
    const updateCount = Math.min(50, brainData.nodes.length) // Only update 50 nodes per frame
    
    for (let i = 0; i < updateCount; i++) {
      const nodeIndex = (Math.floor(animationPhase.current * 10) + i) % brainData.nodes.length
      const baseIndex = nodeIndex * 3
      
      const wave = Math.sin(animationPhase.current + nodeIndex * 0.1) * 0.5 + 0.5
      const activity = 1 + (brainActivity.neural * wave * 1.2) // More dramatic activity changes
      
      colors[baseIndex] = Math.min(1, originalColors[baseIndex] * activity)
      colors[baseIndex + 1] = Math.min(1, originalColors[baseIndex + 1] * activity)
      colors[baseIndex + 2] = Math.min(1, originalColors[baseIndex + 2] * activity)
    }
    
    // Update fewer connections
    const connectionUpdateCount = Math.min(10, connectionsRef.current.length)
    for (let i = 0; i < connectionUpdateCount; i++) {
      const connection = connectionsRef.current[i]
      if (connection && connection.material instanceof THREE.LineBasicMaterial) {
        const wave = Math.sin(animationPhase.current * 2 + i * 0.5) * 0.5 + 0.5
        connection.material.opacity = brainActivity.synaptic * wave * opacity * 0.8 // Much brighter connections
      }
    }
  })
  
  return (
    <group ref={brainGroupRef} scale={[scale, scale, scale]}>
      {/* Optimized Brain Nodes */}
      <Points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[brainGeometry.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[brainGeometry.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[brainGeometry.sizes, 1]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.4} // Much larger point size
          vertexColors
          transparent
          opacity={opacity * 0.95} // Higher opacity
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Simplified Neural Connections - Only render key ones */}
      <group>
        {brainData.connections.slice(0, Math.min(100, brainData.connections.length)).map((connection, index) => {
          if (index % 2 !== 0) return null // Render every other connection
          
          const points = [
            new THREE.Vector3(...connection.from.position),
            new THREE.Vector3(...connection.to.position)
          ]
          
          return (
            <Line
              key={index}
              points={points}
              color={connection.type === 'inter' ? '#00d4ff' : '#ff6b9d'} // Bright colors
              lineWidth={2} // Thicker lines
              transparent
              opacity={connection.strength * opacity * 0.6} // Much more visible
              ref={(ref) => {
                if (ref) connectionsRef.current[index] = ref
              }}
            />
          )
        })}
      </group>
    </group>
  )
}

// Optimized brain activity hook with throttling
export function useOptimizedBrainActivity() {
  const [activity, setActivity] = useState({
    neural: 0.5,
    synaptic: 0.5,
    cognitive: 0.5
  })
  
  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1)
    setActivity(prev => ({
      ...prev,
      neural: Math.min(1, scrollPercent * 1.2),
      cognitive: Math.sin(Date.now() * 0.0005) * 0.2 + 0.7
    }))
  }, [])
  
  // Throttled mouse handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const mouseActivity = (e.clientX + e.clientY) / (window.innerWidth + window.innerHeight)
    setActivity(prev => ({
      ...prev,
      synaptic: mouseActivity * 0.8 + 0.2 // More stable range
    }))
  }, [])
  
  useEffect(() => {
    // Throttle scroll events to 10fps
    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 100) // 10fps
    }
    
    // Throttle mouse events to 20fps  
    let mouseTimeout: NodeJS.Timeout
    const throttledMouse = (e: MouseEvent) => {
      clearTimeout(mouseTimeout)
      mouseTimeout = setTimeout(() => handleMouseMove(e), 50) // 20fps
    }
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
    window.addEventListener('mousemove', throttledMouse, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      window.removeEventListener('mousemove', throttledMouse)
      clearTimeout(scrollTimeout)
      clearTimeout(mouseTimeout)
    }
  }, [handleScroll, handleMouseMove])
  
  return activity
}
