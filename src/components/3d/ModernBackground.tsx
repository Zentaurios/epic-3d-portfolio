'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

interface ModernBackgroundProps {
  scrollProgress: number
}

export function ModernBackground({ scrollProgress }: ModernBackgroundProps) {
  return (
    <group>
      {/* Flowing particle networks */}
      <FlowingParticles scrollProgress={scrollProgress} />

      {/* Neural network connections */}
      <NeuralNetwork scrollProgress={scrollProgress} />

      {/* Geometric structures */}
      <GeometricStructures scrollProgress={scrollProgress} />

      {/* Ambient data streams */}
      <DataStreams scrollProgress={scrollProgress} />

      {/* Morphing grid */}
      <MorphingGrid scrollProgress={scrollProgress} />
    </group>
  )
}

function FlowingParticles({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null!)

  const particleData = useMemo(() => {
    const count = 800
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Create flowing clusters
      const cluster = Math.floor(Math.random() * 4)
      const radius = 15 + cluster * 8
      const height = (Math.random() - 0.5) * 20

      const angle = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 5
      positions[i * 3 + 1] = height + (Math.random() - 0.5) * 3
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 5

      // Sophisticated color palette - muted tech colors
      const colorType = Math.random()
      if (colorType < 0.4) {
        // Cool blue-grays
        colors[i * 3] = 0.2 + Math.random() * 0.2     // R
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.3 // G
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.3 // B
      } else if (colorType < 0.7) {
        // Subtle teals
        colors[i * 3] = 0.1 + Math.random() * 0.2     // R
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.2 // G
        colors[i * 3 + 2] = 0.4 + Math.random() * 0.2 // B
      } else {
        // Accent purples (very muted)
        colors[i * 3] = 0.3 + Math.random() * 0.2     // R
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.2 // G
        colors[i * 3 + 2] = 0.4 + Math.random() * 0.3 // B
      }

      sizes[i] = 0.01 + Math.random() * 0.02
      speeds[i] = 0.5 + Math.random() * 1.5
    }

    return { positions, colors, sizes, speeds, count }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      // Flow particles based on scroll and time
      for (let i = 0; i < particleData.count; i++) {
        const i3 = i * 3

        // Scroll-reactive movement
        const scrollInfluence = scrollProgress * 2
        const timeInfluence = state.clock.elapsedTime * particleData.speeds[i] * 0.1

        // Create flowing motion
        positions[i3] += Math.sin(timeInfluence + scrollInfluence) * 0.01
        positions[i3 + 1] += Math.cos(timeInfluence * 0.7) * 0.005
        positions[i3 + 2] += Math.sin(timeInfluence * 0.5 + scrollInfluence) * 0.008

        // Boundary reset with flow
        if (positions[i3] > 50) positions[i3] = -50
        if (positions[i3] < -50) positions[i3] = 50
        if (positions[i3 + 2] > 50) positions[i3 + 2] = -50
        if (positions[i3 + 2] < -50) positions[i3 + 2] = 50
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true

      // Gentle rotation influenced by scroll
      pointsRef.current.rotation.y = scrollProgress * 0.5
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particleData.colors, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function NeuralNetwork({ scrollProgress }: { scrollProgress: number }) {
  const linesRef = useRef<THREE.Group>(null!)

  const networkData = useMemo(() => {
    const nodeCount = 50
    const nodes: THREE.Vector3[] = []
    const connections: [number, number][] = []

    // Generate nodes in 3D space
    for (let i = 0; i < nodeCount; i++) {
      const radius = 10 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      nodes.push(new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        (Math.random() - 0.5) * 12,
        radius * Math.sin(phi) * Math.sin(theta)
      ))
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const distance = nodes[i].distanceTo(nodes[j])
        if (distance < 8 && Math.random() > 0.7) {
          connections.push([i, j])
        }
      }
    }

    return { nodes, connections }
  }, [])

  useFrame((state) => {
    if (linesRef.current) {
      // Pulse connections based on scroll
      const pulse = Math.sin(state.clock.elapsedTime + scrollProgress * 3) * 0.3 + 0.7
      linesRef.current.children.forEach((line, index) => {
        const mesh = line as THREE.Mesh
        if (mesh.material instanceof THREE.LineBasicMaterial) {
          mesh.material.opacity = pulse * (0.1 + Math.sin(index + scrollProgress * 2) * 0.1)
        }
      })

      // Subtle rotation
      linesRef.current.rotation.y = scrollProgress * 0.3
    }
  })

  const lines = networkData.connections.map(([start, end], index) => {
    const startPos = networkData.nodes[start]
    const endPos = networkData.nodes[end]

    return (
      <Line
        key={index}
        points={[startPos, endPos]}
        color="#334155"
        lineWidth={0.5}
        transparent
        opacity={0.15}
      />
    )
  })

  return <group ref={linesRef}>{lines}</group>
}

function GeometricStructures({ scrollProgress }: { scrollProgress: number }) {
  const structuresRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (structuresRef.current) {
      // Morph structures based on scroll
      structuresRef.current.rotation.x = scrollProgress * 0.5
      structuresRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.2

      structuresRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y = state.clock.elapsedTime * (0.1 + index * 0.05) + scrollProgress
          child.scale.setScalar(1 + Math.sin(scrollProgress * 2 + index) * 0.1)
        }
      })
    }
  })

  return (
    <group ref={structuresRef}>
      {/* Floating geometric forms */}
      <mesh position={[12, 5, -8]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial
          color="#1e293b"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      <mesh position={[-10, -3, 6]}>
        <octahedronGeometry args={[0.8, 2]} />
        <meshBasicMaterial
          color="#0f172a"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      <mesh position={[0, 8, -12]}>
        <tetrahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial
          color="#475569"
          transparent
          opacity={0.25}
          wireframe
        />
      </mesh>
    </group>
  )
}

function DataStreams({ scrollProgress }: { scrollProgress: number }) {
  const streamsRef = useRef<THREE.Points>(null!)

  const streamData = useMemo(() => {
    const count = 300
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Create vertical data streams
      const streamIndex = Math.floor(Math.random() * 8)
      const angle = (streamIndex / 8) * Math.PI * 2
      const radius = 20 + Math.random() * 10

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2

      // Data stream colors - very subtle
      colors[i * 3] = 0.1 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.3
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.2

      phases[i] = Math.random() * Math.PI * 2
    }

    return { positions, colors, phases, count }
  }, [])

  useFrame((state) => {
    if (streamsRef.current) {
      const positions = streamsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < streamData.count; i++) {
        const i3 = i * 3

        // Flow upward with scroll influence
        positions[i3 + 1] += (0.1 + scrollProgress * 0.1)

        // Gentle horizontal drift
        const phase = streamData.phases[i] + state.clock.elapsedTime
        positions[i3] += Math.sin(phase) * 0.002
        positions[i3 + 2] += Math.cos(phase * 0.7) * 0.002

        // Reset when too high
        if (positions[i3 + 1] > 25) {
          positions[i3 + 1] = -25
        }
      }

      streamsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={streamsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[streamData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[streamData.colors, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.008}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function MorphingGrid({ scrollProgress }: { scrollProgress: number }) {
  const gridRef = useRef<THREE.Points>(null!)

  const gridData = useMemo(() => {
    const gridSize = 20
    const spacing = 2
    const count = gridSize * gridSize
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)

    let index = 0
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const xPos = (x - gridSize / 2) * spacing
        const zPos = (z - gridSize / 2) * spacing

        positions[index * 3] = xPos
        positions[index * 3 + 1] = -15 // Below main content
        positions[index * 3 + 2] = zPos

        originalPositions[index * 3] = xPos
        originalPositions[index * 3 + 1] = -15
        originalPositions[index * 3 + 2] = zPos

        index++
      }
    }

    return { positions, originalPositions, count, gridSize, spacing }
  }, [])

  useFrame((state) => {
    if (gridRef.current) {
      const positions = gridRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < gridData.count; i++) {
        const i3 = i * 3
        const x = gridData.originalPositions[i3]
        const z = gridData.originalPositions[i3 + 2]

        // Create wave-like morphing based on scroll and time
        const distance = Math.sqrt(x * x + z * z)
        const wave = Math.sin(distance * 0.2 + state.clock.elapsedTime + scrollProgress * 2) * 2
        const scrollWave = Math.sin(x * 0.1 + scrollProgress * 3) * Math.sin(z * 0.1 + scrollProgress * 2) * 3

        positions[i3 + 1] = -15 + wave + scrollWave
      }

      gridRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={gridRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[gridData.positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.02}
        color="#1e293b"
        transparent
        opacity={0.2}
        sizeAttenuation={true}
      />
    </Points>
  )
}
