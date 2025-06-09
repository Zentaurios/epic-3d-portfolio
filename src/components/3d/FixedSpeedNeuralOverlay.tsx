'use client'

import { useEffect, useRef, useState } from 'react'

interface FixedSpeedNeuralOverlayProps {
  brainActivity?: {
    neural: number
    synaptic: number
    cognitive: number
  }
  currentRegion?: 'consciousness' | 'memory' | 'creativity' | 'logic'
  opacity?: number
  enabled?: boolean
  animationSpeed?: number // 0 = stopped, 1 = normal, 2 = fast
}

export function FixedSpeedNeuralOverlay({
  brainActivity = { neural: 0.5, synaptic: 0.5, cognitive: 0.5 },
  currentRegion = 'consciousness',
  opacity = 0.4,
  enabled = true,
  animationSpeed = 0.3
}: FixedSpeedNeuralOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const nodesRef = useRef<any[]>([])
  const connectionsRef = useRef<any[]>([])
  const lastTimeRef = useRef(0)
  const accumulatedTimeRef = useRef(0)

  console.log('🎛️ FixedSpeedNeuralOverlay - animationSpeed:', animationSpeed)

  const regionColors = {
    consciousness: { primary: [59, 130, 246], secondary: [37, 99, 235], accent: [147, 197, 253] },
    memory: { primary: [139, 92, 246], secondary: [124, 58, 237], accent: [196, 181, 253] },
    creativity: { primary: [6, 182, 212], secondary: [8, 145, 178], accent: [165, 243, 252] },
    logic: { primary: [16, 185, 129], secondary: [5, 150, 105], accent: [167, 243, 208] }
  }

  useEffect(() => {
    if (!enabled) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
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
      const nodeCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 25000))
      nodesRef.current = []
      connectionsRef.current = []

      // Create nodes
      for (let i = 0; i < nodeCount; i++) {
        nodesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random() * 100 - 50,
          vx: (Math.random() - 0.5) * 0.2, // Base velocity
          vy: (Math.random() - 0.5) * 0.2,
          vz: (Math.random() - 0.5) * 0.1,
          size: 1 + Math.random() * 2,
          activity: Math.random(),
          region: Math.floor(Math.random() * 4)
        })
      }

      // Create connections
      nodesRef.current.forEach((node, i) => {
        nodesRef.current.forEach((otherNode, j) => {
          if (i >= j) return
          
          const dx = otherNode.x - node.x
          const dy = otherNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 150 && Math.random() < 0.3) {
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

    // FIXED FRAME RATE animation loop - 24 FPS for optimal performance
    const targetFPS = 24
    const frameInterval = 1000 / targetFPS // ~41.67ms

    const animate = (currentTime: number) => {
      // Calculate delta time
      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime
      
      // Accumulate time
      accumulatedTimeRef.current += deltaTime

      // Only update at our target frame rate (30 FPS)
      if (accumulatedTimeRef.current >= frameInterval) {
        // Apply animation speed multiplier
        const effectiveTime = (accumulatedTimeRef.current * animationSpeed) / 1000
        
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        
        if (animationSpeed <= 0) {
          // Static mode - no updates
          drawStaticNetwork(ctx)
        } else {
          // Animated mode with controlled speed
          updateAndDrawNetwork(ctx, effectiveTime)
        }
        
        accumulatedTimeRef.current = 0 // Reset accumulator
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    const drawStaticNetwork = (ctx: CanvasRenderingContext2D) => {
      const currentColors = regionColors[currentRegion]
      
      // Draw static connections
      connectionsRef.current.forEach(connection => {
        const { from, to } = connection
        const dx = to.x - from.x
        const dy = to.y - from.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 200) {
          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          ctx.strokeStyle = `rgba(${currentColors.secondary[0]}, ${currentColors.secondary[1]}, ${currentColors.secondary[2]}, ${0.1 * opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
      
      // Draw static nodes
      nodesRef.current.forEach(node => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${currentColors.primary[0]}, ${currentColors.primary[1]}, ${currentColors.primary[2]}, ${0.4 * opacity})`
        ctx.fill()
      })
    }

    const updateAndDrawNetwork = (ctx: CanvasRenderingContext2D, time: number) => {
      const currentColors = regionColors[currentRegion]
      
      // Update node positions and activity
      nodesRef.current.forEach(node => {
        // Update activity with controlled speed
        node.activity = Math.sin(time + node.x * 0.01 + node.y * 0.01) * 0.5 + 0.5
        
        // Move nodes
        node.x += node.vx * (1 + node.activity * 0.5)
        node.y += node.vy * (1 + node.activity * 0.5)
        node.z += node.vz

        // Boundary wrapping
        if (node.x < 0) node.x = window.innerWidth
        if (node.x > window.innerWidth) node.x = 0
        if (node.y < 0) node.y = window.innerHeight
        if (node.y > window.innerHeight) node.y = 0
        if (node.z < -50 || node.z > 50) node.vz *= -1
      })

      // Draw connections with pulsing
      connectionsRef.current.forEach(connection => {
        const { from, to } = connection
        const dx = to.x - from.x
        const dy = to.y - from.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 200) {
          // Update pulse phase with speed control
          connection.pulsePhase += 0.1 * animationSpeed // APPLY SPEED CONTROL
          const pulse = Math.sin(connection.pulsePhase) * 0.5 + 0.5
          
          ctx.beginPath()
          ctx.moveTo(from.x, from.y)
          ctx.lineTo(to.x, to.y)
          
          const finalOpacity = (1 - distance / 200) * (0.2 + pulse * 0.3) * opacity
          ctx.strokeStyle = `rgba(${currentColors.secondary[0]}, ${currentColors.secondary[1]}, ${currentColors.secondary[2]}, ${finalOpacity})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })

      // Draw nodes with activity pulsing
      nodesRef.current.forEach(node => {
        const activityPulse = 1 + Math.sin(time * 3 + node.activity * 5) * node.activity * 0.3
        const finalSize = node.size * activityPulse
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2)
        
        const nodeOpacity = (0.6 + node.activity * 0.4) * opacity
        ctx.fillStyle = `rgba(${currentColors.primary[0]}, ${currentColors.primary[1]}, ${currentColors.primary[2]}, ${nodeOpacity})`
        ctx.fill()
      })
    }

    lastTimeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', setSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [brainActivity, currentRegion, opacity, enabled, animationSpeed])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 1,
        mixBlendMode: 'screen'
      }}
    />
  )
}

export default FixedSpeedNeuralOverlay