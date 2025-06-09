'use client'

import { useEffect, useRef, useState } from 'react'

interface NeuralNetworkOverlayProps {
  brainActivity?: {
    neural: number
    synaptic: number
    cognitive: number
  }
  currentRegion?: 'consciousness' | 'memory' | 'creativity' | 'logic'
  opacity?: number
  enabled?: boolean
  speed?: number // Add speed control - 0.1 = very slow, 1 = normal, 2 = fast
}

interface NetworkNode {
  x: number
  y: number
  z: number // Add depth for 3D effect
  vx: number
  vy: number
  vz: number
  size: number
  activity: number
  region: number
}

interface Connection {
  from: NetworkNode
  to: NetworkNode
  strength: number
  pulsePhase: number
}

export function NeuralNetworkOverlay({
  brainActivity = { neural: 0.5, synaptic: 0.5, cognitive: 0.5 },
  currentRegion = 'consciousness',
  opacity = 0.4,
  enabled = true,
  speed = 0.3 // Default to slower speed
}: NeuralNetworkOverlayProps) {
  // Debug logging
  console.log('🔧 NeuralNetworkOverlay speed:', speed)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const nodesRef = useRef<NetworkNode[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const lastActivityUpdate = useRef(0)

  // Region color schemes
  const regionColors = {
    consciousness: {
      primary: [59, 130, 246],   // Blue
      secondary: [37, 99, 235],
      accent: [147, 197, 253]
    },
    memory: {
      primary: [139, 92, 246],   // Purple
      secondary: [124, 58, 237],
      accent: [196, 181, 253]
    },
    creativity: {
      primary: [6, 182, 212],    // Cyan
      secondary: [8, 145, 178],
      accent: [165, 243, 252]
    },
    logic: {
      primary: [16, 185, 129],   // Green
      secondary: [5, 150, 105],
      accent: [167, 243, 208]
    }
  }

  useEffect(() => {
    if (!enabled) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size with device pixel ratio for crisp rendering
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2) // Limit for performance
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.scale(dpr, dpr)
    }
    setSize()
    window.addEventListener('resize', setSize)

    // Initialize neural network
    const initializeNetwork = () => {
      const nodeCount = Math.min(
        Math.floor((window.innerWidth * window.innerHeight) / 12000),
        120 // Cap for performance
      )
      const connectionDistance = Math.min(window.innerWidth * 0.15, 180)
      
      nodesRef.current = []
      connectionsRef.current = []

      // Create nodes with 3D positioning
      for (let i = 0; i < nodeCount; i++) {
        const node: NetworkNode = {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random() * 100 - 50, // Depth: -50 to +50
          vx: (Math.random() - 0.5) * 0.3 * speed, // Apply speed control
          vy: (Math.random() - 0.5) * 0.3 * speed, // Apply speed control
          vz: (Math.random() - 0.5) * 0.1 * speed, // Apply speed control
          size: 1 + Math.random() * 2,
          activity: Math.random(),
          region: Math.floor(Math.random() * 4) // 0-3 for different regions
        }
        nodesRef.current.push(node)
      }

      // Create connections
      nodesRef.current.forEach((node, i) => {
        nodesRef.current.forEach((otherNode, j) => {
          if (i >= j) return
          
          const dx = otherNode.x - node.x
          const dy = otherNode.y - node.y
          const dz = otherNode.z - node.z
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.1) // Z has less weight
          
          if (distance < connectionDistance && Math.random() < 0.3) {
            connectionsRef.current.push({
              from: node,
              to: otherNode,
              strength: Math.random(),
              pulsePhase: Math.random() * Math.PI * 2
            })
          }
        })
      })
    }

    initializeNetwork()

    // Animation loop
    const animate = (timestamp: number) => {
      // Debug: Check if speed is working
      if (timestamp % 1000 < 16) { // Log every ~1 second
        console.log('🔄 Animation running with speed:', speed)
      }
      
      // If speed is 0 or very low, just draw static network
      if (speed <= 0.01) {
        // Static rendering - no animation
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        
        const currentColors = regionColors[currentRegion]
        
        // Draw static connections
        connectionsRef.current.forEach(connection => {
          const { from, to } = connection
          const dx = to.x - from.x
          const dy = to.y - from.y
          const dz = to.z - from.z
          const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.1)
          
          if (distance3D < 200) {
            const avgZ = (from.z + to.z) / 2
            const depthFactor = (avgZ + 50) / 100
            const baseOpacity = 1 - (distance3D / 200)
            const finalOpacity = baseOpacity * 0.1 * depthFactor * opacity // Very faint
            
            ctx.beginPath()
            ctx.moveTo(from.x, from.y)
            ctx.lineTo(to.x, to.y)
            
            const color = currentColors.secondary
            ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${finalOpacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
        
        // Draw static nodes
        nodesRef.current.forEach(node => {
          const depthFactor = (node.z + 50) / 100
          const screenSize = node.size * (0.5 + depthFactor * 1.5)
          const nodeOpacity = (0.4 + depthFactor * 0.2) * opacity // Dimmer
          
          ctx.beginPath()
          ctx.arc(node.x, node.y, screenSize, 0, Math.PI * 2)
          
          const nodeColor = currentColors.primary
          ctx.fillStyle = `rgba(${nodeColor[0]}, ${nodeColor[1]}, ${nodeColor[2]}, ${nodeOpacity})`
          ctx.fill()
        })
        
        animationRef.current = requestAnimationFrame(animate)
        return // Exit early for static mode
      }
      
      // Normal animated rendering (speed > 0.01)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      
      const currentColors = regionColors[currentRegion]
      const time = timestamp * 0.001
      
      // Update brain activity influence (throttled) - Apply speed control to time
      if (timestamp - lastActivityUpdate.current > 100) { // 10fps update
        nodesRef.current.forEach(node => {
          if (speed === 0) {
            // If speed is 0, set static low activity
            node.activity = 0.3
          } else {
            const adjustedTime = time * speed // Apply speed control to time
            const activityWave = Math.sin(adjustedTime + node.x * 0.01 + node.y * 0.01) * 0.5 + 0.5
            node.activity = activityWave * brainActivity.neural + 0.3
          }
        })
        lastActivityUpdate.current = timestamp
      }

      // Update node positions - Apply speed control
      nodesRef.current.forEach(node => {
        if (speed === 0) {
          // If speed is 0, nodes don't move
          return
        }
        
        // Move nodes with neural activity influence
        const activityMultiplier = 1 + node.activity * 0.5
        node.x += node.vx * activityMultiplier
        node.y += node.vy * activityMultiplier
        node.z += node.vz

        // Boundary bouncing with some randomness
        if (node.x < 0 || node.x > window.innerWidth) {
          node.vx *= -1
          node.x = Math.max(0, Math.min(window.innerWidth, node.x))
        }
        if (node.y < 0 || node.y > window.innerHeight) {
          node.vy *= -1
          node.y = Math.max(0, Math.min(window.innerHeight, node.y))
        }
        if (node.z < -50 || node.z > 50) {
          node.vz *= -1
        }
      })

      // Draw connections with depth-based effects
      connectionsRef.current.forEach(connection => {
        const { from, to } = connection
        
        // Calculate 3D distance for depth effects
        const dx = to.x - from.x
        const dy = to.y - from.y
        const dz = to.z - from.z
        const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz * 0.1)
        
        if (distance3D < 200) {
          // Depth-based opacity and thickness
          const avgZ = (from.z + to.z) / 2
          const depthFactor = (avgZ + 50) / 100 // 0 to 1
          const baseOpacity = 1 - (distance3D / 200)
          
          // Synaptic pulse effect with speed control
          if (speed === 0) {
            // If speed is 0, no pulsing - static connections
            connection.pulsePhase = 0
          } else {
            connection.pulsePhase += (0.05 + brainActivity.synaptic * 0.1) * speed
          }
          const pulse = Math.sin(connection.pulsePhase) * 0.5 + 0.5
          
          const finalOpacity = baseOpacity * (0.2 + pulse * 0.3) * depthFactor * opacity
          const lineWidth = (1 + depthFactor) * (0.5 + pulse * 0.5)
          
          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          
          // Use region colors with depth variation
          const color = depthFactor > 0.5 ? currentColors.primary : currentColors.secondary
          ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${finalOpacity})`
          ctx.lineWidth = lineWidth
          ctx.stroke()
        }
      })

      // Draw nodes with 3D depth effects
      nodesRef.current.forEach(node => {
        const depthFactor = (node.z + 50) / 100 // 0 to 1
        const screenSize = node.size * (0.5 + depthFactor * 1.5)
        const nodeOpacity = (0.6 + depthFactor * 0.4) * opacity
        
        // Activity-based pulsing - Apply speed control to time
        let activityPulse = 1 // Default no pulse
        if (speed === 0) {
          // If speed is 0, no pulsing - static size
          activityPulse = 1
        } else {
          const adjustedTime = time * speed // Apply speed control to time-based animations
          activityPulse = 1 + Math.sin(adjustedTime * 3 + node.activity * 5) * node.activity * 0.3
        }
        const finalSize = screenSize * activityPulse
        
        // Glow effect for active nodes
        if (node.activity > 0.7) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, finalSize * 2, 0, Math.PI * 2)
          const glowColor = currentColors.accent
          ctx.fillStyle = `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${nodeOpacity * 0.1})`
          ctx.fill()
        }
        
        // Main node
        ctx.beginPath()
        ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2)
        
        const nodeColor = depthFactor > 0.6 ? currentColors.primary : 
                         depthFactor > 0.3 ? currentColors.secondary : currentColors.accent
        ctx.fillStyle = `rgba(${nodeColor[0]}, ${nodeColor[1]}, ${nodeColor[2]}, ${nodeOpacity})`
        ctx.fill()
        
        // Highlight ring for very active nodes
        if (node.activity > 0.8) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, finalSize + 1, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${currentColors.accent[0]}, ${currentColors.accent[1]}, ${currentColors.accent[2]}, ${nodeOpacity * 0.8})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', setSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [brainActivity, currentRegion, opacity, enabled, speed])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 1, // Above 3D brain (z-index: 0) but below content (z-index: 10)
        mixBlendMode: 'screen' // Blend with the 3D brain below
      }}
    />
  )
}

export default NeuralNetworkOverlay
