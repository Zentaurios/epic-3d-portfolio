'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  size: number
  activity: number
  region: number
}

interface Connection {
  from: Node
  to: Node
  strength: number
  pulsePhase: number
}

const regionColors = {
  consciousness: { primary: [59, 130, 246], secondary: [37, 99, 235], accent: [147, 197, 253] },
  memory: { primary: [139, 92, 246], secondary: [124, 58, 237], accent: [196, 181, 253] },
  creativity: { primary: [6, 182, 212], secondary: [8, 145, 178], accent: [165, 243, 252] },
  logic: { primary: [16, 185, 129], secondary: [5, 150, 105], accent: [167, 243, 208] }
}

interface FixedSpeedNeuralOverlayProps {
  brainActivity?: {
    neural: number
    synaptic: number
    cognitive: number
  }
  currentRegion?: 'consciousness' | 'memory' | 'creativity' | 'logic'
  scrollProgress?: number
  isTransitioning?: boolean
  opacity?: number
  enabled?: boolean
}

export function FixedSpeedNeuralOverlay({
  brainActivity = { neural: 0.5, synaptic: 0.5, cognitive: 0.5 },
  currentRegion = 'consciousness',
  opacity = 0.4,
  enabled = true
}: FixedSpeedNeuralOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])

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
          vx: (Math.random() - 0.5) * 0.2, // Closer to original but still slower
          vy: (Math.random() - 0.5) * 0.2,
          vz: (Math.random() - 0.5) * 0.02,
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

    // Simple animation loop like the original NetworkBackground
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      updateAndDrawNetwork(ctx)
      animationRef.current = requestAnimationFrame(animate)
    }

    const updateAndDrawNetwork = (ctx: CanvasRenderingContext2D) => {
      const currentColors = regionColors[currentRegion]
      
      // Update node positions (simplified like original)
      nodesRef.current.forEach(node => {
        // Simple movement like original NetworkBackground
        node.x += node.vx
        node.y += node.vy

        // Boundary wrapping (like original but with wrapping instead of bouncing)
        if (node.x < 0) node.x = window.innerWidth
        if (node.x > window.innerWidth) node.x = 0
        if (node.y < 0) node.y = window.innerHeight
        if (node.y > window.innerHeight) node.y = 0
      })

      // Draw connections with pulsing
      connectionsRef.current.forEach(connection => {
        const { from, to } = connection
        const dx = to.x - from.x
        const dy = to.y - from.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 200) {
          // Update pulse phase with fixed slow speed
          connection.pulsePhase += 0.01 // Very slow base pulse
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
        const activityPulse = 1 + Math.sin(node.activity * 5) * node.activity * 0.3 // Remove time dependency
        const finalSize = node.size * activityPulse
        
        ctx.beginPath()
        ctx.arc(node.x, node.y, finalSize, 0, Math.PI * 2)
        
        const nodeOpacity = (0.6 + node.activity * 0.4) * opacity
        ctx.fillStyle = `rgba(${currentColors.primary[0]}, ${currentColors.primary[1]}, ${currentColors.primary[2]}, ${nodeOpacity})`
        ctx.fill()
      })
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', setSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [brainActivity, currentRegion, opacity, enabled])

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