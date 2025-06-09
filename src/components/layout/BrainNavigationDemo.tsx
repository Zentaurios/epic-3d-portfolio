'use client'

import { useState } from 'react'
import { useNavigationManager } from '@/lib/hooks/useNavigationManager'
import { BRAIN_COLORS } from '@/lib/utils/constants'
import { Brain, Zap, Lightbulb, Calculator, Sparkles } from 'lucide-react'

interface NavigationRegion {
  id: 'consciousness' | 'memory' | 'creativity' | 'logic'
  label: string
  route: string
  description: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const navigationRegions: NavigationRegion[] = [
  {
    id: 'consciousness',
    label: 'Consciousness',
    route: '/',
    description: 'Core awareness and presence',
    icon: Brain
  },
  {
    id: 'memory',
    label: 'Memory',
    route: '/blog',
    description: 'Stored experiences and knowledge',
    icon: Sparkles
  },
  {
    id: 'creativity',
    label: 'Creativity',
    route: '/explore',
    description: 'Innovation and imagination',
    icon: Lightbulb
  },
  {
    id: 'logic',
    label: 'Logic',
    route: '/explore/technical-deep-dive',
    description: 'Analytical and systematic thinking',
    icon: Calculator
  }
]

export function BrainNavigationDemo() {
  const { navigationState, navigateWithTransition, currentRegion } = useNavigationManager()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleRegionChange = (region: NavigationRegion) => {
    navigateWithTransition(region.route, {
      transitionType: 'neural-pulse',
      intensity: 1.5
    })
  }

  return (
    <div className="fixed top-4 right-4 z-[99999]" style={{ zIndex: 99999 }}>
      {/* Main Brain Navigator */}
      <div
        className={`bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-4 transition-all duration-700 ${
          isExpanded ? 'w-80' : 'w-16'
        }`}
        style={{
          boxShadow: `0 0 40px ${BRAIN_COLORS[currentRegion].primary}40`
        }}
      >
        {/* Brain Status Indicator */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-xl transition-all duration-500 ${
              isExpanded ? 'bg-white/10' : 'bg-transparent'
            }`}
            style={{
              backgroundColor: isExpanded ? `${BRAIN_COLORS[currentRegion].primary}20` : undefined
            }}
          >
            <Brain
              className="w-6 h-6 transition-colors duration-500"
              style={{ color: BRAIN_COLORS[currentRegion].primary }}
            />
          </button>

          {isExpanded && (
            <div className="flex items-center space-x-2">
              <Zap
                className="w-4 h-4 animate-pulse"
                style={{ color: BRAIN_COLORS[currentRegion].accent }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: BRAIN_COLORS[currentRegion].secondary }}
              >
                {navigationRegions.find(r => r.id === currentRegion)?.label}
              </span>
            </div>
          )}
        </div>

        {/* Expanded Navigation */}
        {isExpanded && (
          <div className="mt-4 space-y-2">
            <div className="mb-3 text-xs text-white/60">
              Navigate through different regions of consciousness
            </div>

            {navigationRegions.map((region) => {
              const Icon = region.icon
              const isActive = currentRegion === region.id
              const isTransitioning = navigationState.isTransitioning

              return (
                <button
                  key={region.id}
                  onClick={() => handleRegionChange(region)}
                  disabled={isTransitioning}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 transform scale-105'
                      : 'bg-white/5 hover:bg-white/8'
                  } ${isTransitioning ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
                  style={{
                    borderLeft: isActive ? `3px solid ${BRAIN_COLORS[region.id].primary}` : '3px solid transparent',
                    boxShadow: isActive ? `0 4px 20px ${BRAIN_COLORS[region.id].primary}30` : undefined
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <Icon
                      className={`w-5 h-5 mt-0.5 transition-colors duration-300 ${
                        isTransitioning && isActive ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        color: isActive 
                          ? BRAIN_COLORS[region.id].primary 
                          : BRAIN_COLORS[region.id].secondary 
                      }}
                    />
                    <div className="flex-1">
                      <div
                        className="text-sm font-medium"
                        style={{ 
                          color: isActive 
                            ? BRAIN_COLORS[region.id].primary 
                            : '#ffffff' 
                        }}
                      >
                        {region.label}
                      </div>
                      <div className="mt-1 text-xs text-white/60">
                        {region.description}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}

            {/* Brain Activity Indicator */}
            <div className="pt-3 mt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Neural Activity</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-4 rounded-full transition-all duration-300 ${
                        i < (navigationState.isTransitioning ? 5 : 3)
                          ? 'animate-pulse'
                          : 'opacity-30'
                      }`}
                      style={{
                        backgroundColor: BRAIN_COLORS[currentRegion].accent,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transition Effect */}
      {navigationState.isTransitioning && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 99998 }}>
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: `radial-gradient(circle at center, ${BRAIN_COLORS[currentRegion].primary}20 0%, transparent 70%)`
            }}
          />
        </div>
      )}
    </div>
  )
}

// Simplified version for minimal UI
export function SimpleBrainNavigation() {
  const { currentRegion, navigateWithTransition } = useNavigationManager()

  return (
    <div className="fixed z-[99999] transform -translate-x-1/2 bottom-6 left-1/2" style={{ zIndex: 99999 }}>
      <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-black/80 backdrop-blur-lg border-white/10">
        {navigationRegions.map((region) => {
          const Icon = region.icon
          const isActive = currentRegion === region.id

          return (
            <button
              key={region.id}
              onClick={() => navigateWithTransition(region.route)}
              className={`p-2 rounded-full transition-all duration-300 ${
                isActive ? 'scale-110' : 'scale-100 hover:scale-105'
              }`}
              style={{
                backgroundColor: isActive ? `${BRAIN_COLORS[region.id].primary}30` : 'transparent'
              }}
              title={region.label}
            >
              <Icon
                className="w-4 h-4"
                style={{ 
                  color: isActive 
                    ? BRAIN_COLORS[region.id].primary 
                    : BRAIN_COLORS[region.id].secondary 
                }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
