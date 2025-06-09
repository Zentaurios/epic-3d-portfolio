'use client'

import { useEffect, useState } from 'react'

interface PulsatingBrainIconProps {
  size?: number
  className?: string
  intensity?: number
}

export function PulsatingBrainIcon({ 
  size = 200, 
  className = '',
  intensity = 0.8 
}: PulsatingBrainIconProps) {
  const [pulsePhase, setPulsePhase] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 0.1) % (Math.PI * 2))
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  // Dynamic energy colors based on pulse phase
  const energyColors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple  
    '#06b6d4', // cyan
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#ec4899', // pink
  ]

  const currentColor = energyColors[Math.floor((pulsePhase / (Math.PI * 2)) * energyColors.length)]
  const pulseScale = 1 + Math.sin(pulsePhase) * 0.15 * intensity
  const glowIntensity = (Math.sin(pulsePhase) + 1) * 0.5 * intensity

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer energy rings */}
      <div 
        className="absolute inset-0 rounded-full animate-spin"
        style={{
          background: `conic-gradient(from 0deg, ${currentColor}20, transparent, ${currentColor}30, transparent)`,
          transform: `scale(${1 + glowIntensity * 0.3})`,
          opacity: glowIntensity * 0.6,
          filter: 'blur(2px)',
          animation: 'spin 8s linear infinite'
        }}
      />
      
      {/* Middle energy ring */}
      <div 
        className="absolute rounded-full inset-2 animate-spin"
        style={{
          background: `conic-gradient(from 180deg, transparent, ${currentColor}40, transparent, ${currentColor}50)`,
          transform: `scale(${pulseScale * 0.8})`,
          opacity: glowIntensity * 0.8,
          filter: 'blur(1px)',
          animation: 'spin 6s linear infinite reverse'
        }}
      />

      {/* Brain SVG Container */}
      <div 
        className="relative z-10"
        style={{
          transform: `scale(${pulseScale})`,
          filter: `drop-shadow(0 0 ${glowIntensity * 20}px ${currentColor}40)`,
        }}
      >
        <svg 
          width={size} 
          height={size * 0.8} 
          viewBox="0 0 200 160" 
          className="overflow-visible"
        >
          {/* Brain gradient definitions */}
          <defs>
            <radialGradient id="brainGradient" cx="0.5" cy="0.4" r="0.8">
              <stop offset="0%" stopColor={`${currentColor}80`} />
              <stop offset="50%" stopColor={`${currentColor}60`} />
              <stop offset="100%" stopColor={`${currentColor}40`} />
            </radialGradient>
            
            <radialGradient id="synapseGradient" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor={`${currentColor}FF`} />
              <stop offset="100%" stopColor={`${currentColor}20`} />
            </radialGradient>

            <filter id="energyGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Left hemisphere */}
          <path
            d="M40 80 C40 40, 70 20, 100 20 C110 25, 115 35, 120 50 C125 65, 120 75, 115 85 C110 100, 90 120, 70 130 C50 135, 40 120, 40 80 Z"
            fill="url(#brainGradient)"
            stroke={currentColor}
            strokeWidth="2"
            filter="url(#energyGlow)"
            style={{
              opacity: 0.8 + glowIntensity * 0.2,
            }}
          />

          {/* Right hemisphere */}
          <path
            d="M160 80 C160 40, 130 20, 100 20 C90 25, 85 35, 80 50 C75 65, 80 75, 85 85 C90 100, 110 120, 130 130 C150 135, 160 120, 160 80 Z"
            fill="url(#brainGradient)"
            stroke={currentColor}
            strokeWidth="2"
            filter="url(#energyGlow)"
            style={{
              opacity: 0.8 + glowIntensity * 0.2,
            }}
          />

          {/* Corpus callosum (connecting bridge) */}
          <ellipse
            cx="100"
            cy="70"
            rx="15"
            ry="8"
            fill={`${currentColor}60`}
            stroke={currentColor}
            strokeWidth="1"
            style={{
              opacity: 0.6 + glowIntensity * 0.4,
            }}
          />

          {/* Neural pathways */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = 100 + Math.cos(angle) * (30 + Math.sin(pulsePhase + i) * 10)
            const y = 80 + Math.sin(angle) * (25 + Math.cos(pulsePhase + i) * 8)
            const size = 2 + Math.sin(pulsePhase + i * 0.5) * 1.5
            
            return (
              <circle
                key={`pathway-${i}`}
                cx={x}
                cy={y}
                r={size}
                fill="url(#synapseGradient)"
                style={{
                  opacity: 0.7 + Math.sin(pulsePhase + i * 0.3) * 0.3,
                }}
              >
                <animate
                  attributeName="r"
                  values={`${size};${size * 1.5};${size}`}
                  dur={`${1.5 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )
          })}

          {/* Brain stem */}
          <rect
            x="95"
            y="130"
            width="10"
            height="20"
            rx="5"
            fill={`${currentColor}70`}
            stroke={currentColor}
            strokeWidth="1"
            style={{
              opacity: 0.8 + glowIntensity * 0.2,
            }}
          />

          {/* Frontal cortex details */}
          <path
            d="M60 50 Q80 45, 100 50 Q120 45, 140 50"
            stroke={`${currentColor}80`}
            strokeWidth="1.5"
            fill="none"
            style={{
              opacity: 0.6 + glowIntensity * 0.4,
            }}
          />

          {/* Energy particles */}
          {[...Array(12)].map((_, i) => {
            const orbitRadius = 80 + i * 3
            const orbitSpeed = 0.02 + i * 0.001
            const x = 100 + Math.cos(pulsePhase * orbitSpeed + i) * orbitRadius
            const y = 80 + Math.sin(pulsePhase * orbitSpeed + i) * orbitRadius * 0.7
            const particleColor = energyColors[(i + Math.floor(pulsePhase)) % energyColors.length]
            
            return (
              <circle
                key={`particle-${i}`}
                cx={x}
                cy={y}
                r="1.5"
                fill={particleColor}
                style={{
                  opacity: 0.4 + Math.sin(pulsePhase + i * 0.5) * 0.4,
                  filter: `drop-shadow(0 0 4px ${particleColor})`,
                }}
              />
            )
          })}
        </svg>
      </div>

      {/* Energy waves */}
      <div 
        className="absolute inset-0 border-2 rounded-full"
        style={{
          borderColor: `${currentColor}30`,
          transform: `scale(${1 + glowIntensity * 0.5})`,
          opacity: glowIntensity * 0.5,
          animation: `pulse ${2 + intensity}s ease-in-out infinite`
        }}
      />
      
      <div 
        className="absolute inset-0 border rounded-full"
        style={{
          borderColor: `${currentColor}20`,
          transform: `scale(${1 + glowIntensity * 0.8})`,
          opacity: glowIntensity * 0.3,
          animation: `pulse ${3 + intensity}s ease-in-out infinite reverse`
        }}
      />
    </div>
  )
}
