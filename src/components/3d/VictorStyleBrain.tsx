'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

interface VictorStyleBrainProps {
  brainActivity?: {
    neural: number
    synaptic: number
    cognitive: number
  }
  scale?: number
  animated?: boolean
  opacity?: number
  quality?: 'low' | 'medium' | 'high'
  animationSpeed?: number // Add speed control to 3D brain
}

// Create accurate brain shape based on victors1681/3dbrain approach
const createAnatomicalBrain = (quality: 'low' | 'medium' | 'high' = 'medium') => {
  const config = {
    low: { nodes: 800, connections: 60, detail: 8 },
    medium: { nodes: 1200, connections: 100, detail: 12 },
    high: { nodes: 1800, connections: 150, detail: 16 }
  }[quality]

  const nodes: any[] = []
  const connections: any[] = []
  const brainMeshes: any[] = []

  // Create anatomically accurate brain hemisphere geometry
  const createBrainHemisphere = (isLeft: boolean) => {
    const hemisphere = new THREE.SphereGeometry(12, config.detail, config.detail, 0, Math.PI)
    const vertices = hemisphere.attributes.position.array as Float32Array
    
    // Transform into realistic brain shape with cortical folds
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]
      
      // Create major cortical folds (gyri and sulci)
      const frontalFold = Math.sin(z * 0.3 + y * 0.4) * 0.8
      const parietalFold = Math.cos(x * 0.4 + z * 0.3) * 0.6
      const temporalFold = Math.sin(y * 0.5 + x * 0.2) * 0.7
      
      // Combine folds for realistic brain surface
      const corticalPattern = frontalFold + parietalFold + temporalFold
      
      // Apply brain-specific deformations
      const length = Math.sqrt(x*x + y*y + z*z)
      const normalX = x / length
      const normalY = y / length
      const normalZ = z / length
      
      // Deform surface with cortical patterns
      const displacement = corticalPattern * 0.4
      vertices[i] = x + normalX * displacement
      vertices[i + 1] = y + normalY * displacement  
      vertices[i + 2] = z + normalZ * displacement
      
      // Add brain asymmetry and realistic proportions
      if (isLeft) {
        vertices[i] *= 1.02 // Slight left hemisphere enlargement
        vertices[i + 1] *= 0.95 // Flatten temporal region
      } else {
        vertices[i] *= 0.98
        vertices[i + 1] *= 0.96
      }
    }
    
    hemisphere.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    hemisphere.computeVertexNormals()
    
    return {
      geometry: hemisphere,
      position: [isLeft ? -7 : 7, 2, 2] as [number, number, number],
      color: isLeft ? '#4f46e5' : '#6366f1'
    }
  }

  // Create cerebellum with characteristic folded structure
  const createCerebellum = () => {
    const cerebellum = new THREE.SphereGeometry(6, config.detail, config.detail)
    const vertices = cerebellum.attributes.position.array as Float32Array
    
    // Create cerebellum's distinctive folia (fine folds)
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      const z = vertices[i + 2]
      
      // Fine cerebellar folds
      const folia = Math.sin(x * 3) * Math.cos(y * 4) * Math.sin(z * 2) * 0.15
      const length = Math.sqrt(x*x + y*y + z*z)
      
      vertices[i] += (x / length) * folia
      vertices[i + 1] += (y / length) * folia
      vertices[i + 2] += (z / length) * folia
    }
    
    cerebellum.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    cerebellum.computeVertexNormals()
    
    return {
      geometry: cerebellum,
      position: [0, -10, -8] as [number, number, number],
      color: '#8b5cf6'
    }
  }

  // Create brain stem
  const createBrainStem = () => {
    return {
      geometry: new THREE.CylinderGeometry(1.5, 2.5, 8, 8),
      position: [0, -6, -3] as [number, number, number],
      color: '#ef4444'
    }
  }

  // Create brain meshes
  const leftHemisphere = createBrainHemisphere(true)
  const rightHemisphere = createBrainHemisphere(false)
  const cerebellum = createCerebellum()
  const brainStem = createBrainStem()
  
  brainMeshes.push(leftHemisphere, rightHemisphere, cerebellum, brainStem)

  // Create nodes distributed across brain regions
  const brainRegions = [
    { center: [-7, 4, 4], radius: 8, density: Math.floor(config.nodes * 0.3), type: 'cortex' },
    { center: [7, 4, 4], radius: 8, density: Math.floor(config.nodes * 0.3), type: 'cortex' },
    { center: [0, -10, -8], radius: 5, density: Math.floor(config.nodes * 0.2), type: 'cerebellum' },
    { center: [0, -6, -3], radius: 3, density: Math.floor(config.nodes * 0.1), type: 'stem' },
    { center: [0, 2, 0], radius: 10, density: Math.floor(config.nodes * 0.1), type: 'corpus' }
  ]

  brainRegions.forEach((region, regionIndex) => {
    for (let i = 0; i < region.density; i++) {
      // Organic distribution within each brain region
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(1 - 2 * Math.random())
      const r = Math.pow(Math.random(), 0.7) * region.radius
      
      const x = region.center[0] + r * Math.sin(phi) * Math.cos(theta)
      const y = region.center[1] + r * Math.sin(phi) * Math.sin(theta)
      const z = region.center[2] + r * Math.cos(phi)
      
      nodes.push({
        position: [x, y, z],
        region: regionIndex,
        type: region.type,
        activation: Math.random(),
        size: region.type === 'cortex' ? 1.2 : region.type === 'cerebellum' ? 0.8 : 0.6
      })
    }
  })

  // Create anatomically-guided connections
  const connectionTypes = [
    { from: 0, to: 1, count: 20, type: 'corpus_callosum' }, // Inter-hemispheric
    { from: 0, to: 2, count: 10, type: 'cortical_cerebellar' }, // Left cortex to cerebellum
    { from: 1, to: 2, count: 10, type: 'cortical_cerebellar' }, // Right cortex to cerebellum
    { from: 0, to: 3, count: 8, type: 'corticospinal' }, // Left cortex to stem
    { from: 1, to: 3, count: 8, type: 'corticospinal' }, // Right cortex to stem
    { from: 2, to: 3, count: 6, type: 'cerebellar_stem' } // Cerebellum to stem
  ]

  connectionTypes.forEach(connType => {
    const fromNodes = nodes.filter(n => n.region === connType.from)
    const toNodes = nodes.filter(n => n.region === connType.to)
    
    for (let i = 0; i < connType.count; i++) {
      if (fromNodes.length > 0 && toNodes.length > 0) {
        const fromNode = fromNodes[Math.floor(Math.random() * fromNodes.length)]
        const toNode = toNodes[Math.floor(Math.random() * toNodes.length)]
        
        connections.push({
          from: fromNode.position,
          to: toNode.position,
          strength: 0.6 + Math.random() * 0.4,
          type: connType.type,
          activity: Math.random()
        })
      }
    }
  })

  return { nodes, connections, brainMeshes }
}

// Individual brain mesh component
function AnatomicalMesh({ 
  geometry, 
  position, 
  color, 
  brainActivity,
  animated = true,
  animationSpeed = 0.3 // Add speed control
}: {
  geometry: THREE.BufferGeometry
  position: [number, number, number]
  color: string
  brainActivity: any
  animated?: boolean
  animationSpeed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const originalVertices = useRef<Float32Array | undefined>(undefined)
  
  useEffect(() => {
    if (geometry && !originalVertices.current) {
      originalVertices.current = geometry.attributes.position.array.slice() as Float32Array
    }
  }, [geometry])
  
  useFrame((state) => {
    if (!meshRef.current || !animated || animationSpeed <= 0.01) return
    
    const time = state.clock.elapsedTime * animationSpeed // Apply speed control
    
    // Realistic brain "breathing" - very subtle
    const breathe = 1 + Math.sin(time * 0.4) * 0.008 * brainActivity.cognitive
    meshRef.current.scale.setScalar(breathe)
    
    // Subtle neural activity deformation
    if (originalVertices.current && brainActivity.neural > 0.7) {
      const positions = geometry.attributes.position.array as Float32Array
      const original = originalVertices.current
      
      const activityWave = Math.sin(time * 0.6) * 0.003 * brainActivity.neural
      
      for (let i = 0; i < positions.length; i += 15) { // Only every 5th vertex for performance
        positions[i] = original[i] + activityWave
        positions[i + 1] = original[i + 1] + activityWave * 0.5
        positions[i + 2] = original[i + 2] + activityWave * 0.3
      }
      
      geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      geometry={geometry}
    >
      <meshPhongMaterial 
        color={color}
        shininess={15}
        transparent
        opacity={0.85}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export function VictorStyleBrain({
  brainActivity = { neural: 0.6, synaptic: 0.6, cognitive: 0.6 },
  scale = 1,
  animated = true,
  opacity = 0.9,
  quality = 'medium',
  animationSpeed = 0.3 // Default slow speed
}: VictorStyleBrainProps) {
  console.log('🔧 VictorStyleBrain animationSpeed:', animationSpeed)
  const brainGroupRef = useRef<THREE.Group>(null!)
  const neuronsRef = useRef<THREE.Points>(null!)
  const connectionsRef = useRef<THREE.Group>(null!)
  const lastUpdateTime = useRef(0)
  
  // Generate brain data
  const brainData = useMemo(() => createAnatomicalBrain(quality), [quality])
  
  // Pre-compute neural network geometry
  const neuralGeometry = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []
    const sizes: number[] = []
    
    brainData.nodes.forEach(node => {
      positions.push(...node.position)
      
      // Color based on brain region and type
      const typeColors = {
        cortex: [0.3, 0.7, 1.0],     // Bright blue cortex
        cerebellum: [0.8, 0.3, 1.0], // Purple cerebellum  
        stem: [1.0, 0.4, 0.4],       // Red brain stem
        corpus: [0.6, 0.8, 0.4]      // Green corpus callosum
      }
      
      const typeColor = typeColors[node.type as keyof typeof typeColors] || [0.6, 0.6, 0.6]
      colors.push(...typeColor)
      sizes.push(node.size)
    })
    
    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      originalColors: new Float32Array(colors)
    }
  }, [brainData])
  
  // High-responsiveness animation loop with speed control
  useFrame((state) => {
    if (!brainGroupRef.current || !animated) return
    
    // If speed is 0 or very low, skip most animations
    if (animationSpeed <= 0.01) {
      return // Completely static
    }
    
    const time = state.clock.elapsedTime * animationSpeed // Apply speed control to time
    const deltaTime = (time - lastUpdateTime.current)
    
    // Update at controlled rate
    if (deltaTime < 0.033) return
    lastUpdateTime.current = time
    
    // **SPEED CONTROLLED** brain rotation
    const rotationSpeed = (0.004 + brainActivity.neural * 0.008) * animationSpeed
    brainGroupRef.current.rotation.y += rotationSpeed
    brainGroupRef.current.rotation.x = Math.sin(time * 0.2) * 0.03
    
    // **SPEED CONTROLLED** scaling
    const cognitiveScale = 1 + brainActivity.cognitive * 0.08
    const neuralPulse = 1 + Math.sin(time * 2) * 0.02 * brainActivity.neural
    brainGroupRef.current.scale.setScalar(scale * cognitiveScale * neuralPulse)
    
    // **SPEED CONTROLLED** neural firing
    const colors = neuralGeometry.colors
    const originalColors = neuralGeometry.originalColors
    const updateCount = Math.min(80, brainData.nodes.length) // Update more nodes
    
    for (let i = 0; i < updateCount; i++) {
      const nodeIndex = (Math.floor(time * 15) + i) % brainData.nodes.length // Speed controlled
      const baseIndex = nodeIndex * 3
      
      const wave = Math.sin(time * 3 + nodeIndex * 0.08) * 0.5 + 0.5 // Speed controlled
      const activity = 1 + (brainActivity.neural * wave * 1.5)
      
      colors[baseIndex] = Math.min(1, originalColors[baseIndex] * activity)
      colors[baseIndex + 1] = Math.min(1, originalColors[baseIndex + 1] * activity)
      colors[baseIndex + 2] = Math.min(1, originalColors[baseIndex + 2] * activity)
    }
    
    // **SPEED CONTROLLED** connections
    if (connectionsRef.current) {
      connectionsRef.current.children.forEach((line, index) => {
        if (line instanceof THREE.Line && line.material instanceof THREE.LineBasicMaterial) {
          const connection = brainData.connections[index]
          if (connection) {
            const wave = Math.sin(time * 4 + connection.activity * Math.PI * 2) * 0.5 + 0.5 // Speed controlled
            const synapticPulse = brainActivity.synaptic * wave * 1.2
            line.material.opacity = connection.strength * synapticPulse * opacity
          }
        }
      })
    }
  })
  
  return (
    <group ref={brainGroupRef} scale={[scale, scale, scale]}>
      {/* Anatomical Brain Meshes */}
      {brainData.brainMeshes.map((mesh, index) => (
        <AnatomicalMesh
          key={index}
          geometry={mesh.geometry}
          position={mesh.position}
          color={mesh.color}
          brainActivity={brainActivity}
          animated={animated}
          animationSpeed={animationSpeed} // Pass speed control
        />
      ))}
      
      {/* Neural Network Points */}
      <Points ref={neuronsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[neuralGeometry.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[neuralGeometry.colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[neuralGeometry.sizes, 1]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.4} // Large, visible neurons
          vertexColors
          transparent
          opacity={opacity * 0.95}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Anatomical Neural Pathways */}
      <group ref={connectionsRef}>
        {brainData.connections.map((connection, index) => {
          const pathwayColors = {
            corpus_callosum: '#00d4ff',      // Bright cyan
            cortical_cerebellar: '#ff6b9d', // Pink
            corticospinal: '#ffa500',        // Orange  
            cerebellar_stem: '#9d4edd'       // Purple
          }
          
          const points = [
            new THREE.Vector3(...connection.from),
            new THREE.Vector3(...connection.to)
          ]
          
          return (
            <Line
              key={index}
              points={points}
              color={pathwayColors[connection.type as keyof typeof pathwayColors] || '#64748b'}
              lineWidth={2.5} // Thick, visible connections
              transparent
              opacity={connection.strength * opacity * 0.7}
            />
          )
        })}
      </group>
      
      {/* Brain aura for depth */}
      <mesh scale={[18, 15, 16]} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshBasicMaterial
          color="#1e293b"
          transparent
          opacity={0.04}
          wireframe
        />
      </mesh>
    </group>
  )
}

// Enhanced activity hook with speed control
export function useVictorBrainActivity(speed: number = 0.3) {
  const [activity, setActivity] = useState({
    neural: 0.6,
    synaptic: 0.6, 
    cognitive: 0.6
  })
  
  useEffect(() => {
    if (speed <= 0.01) {
      // Static mode - no updates
      setActivity({ neural: 0.3, synaptic: 0.3, cognitive: 0.3 })
      return
    }
    
    let animationId: number
    
    // Speed-controlled updates
    const updateActivity = () => {
      const time = Date.now() * 0.002 * speed // Apply speed control
      
      // Speed-controlled scroll responsiveness
      const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1)
      
      setActivity({
        neural: Math.min(1, scrollPercent * 1.8 + 0.2),
        synaptic: Math.sin(time * 0.8) * 0.3 + 0.7,
        cognitive: Math.cos(time * 0.5 + 1) * 0.4 + 0.6
      })
      
      animationId = requestAnimationFrame(updateActivity)
    }
    
    // Add scroll listener for immediate response
    const handleScroll = () => {
      const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1)
      setActivity(prev => ({
        ...prev,
        neural: Math.min(1, scrollPercent * 1.8 + 0.2)
      }))
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    updateActivity()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationId)
    }
  }, [speed])
  
  return activity
}