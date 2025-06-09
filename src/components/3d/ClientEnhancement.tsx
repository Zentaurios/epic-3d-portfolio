'use client'

import { BlogPost, Project } from '@/types'
import { HomeContent } from '@/components/layout/HomeContent'

interface BrainContent {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  about: {
    title: string
    content: string
    skills: string[]
  }
  blogs: BlogPost[]
  projects: Project[]
}

interface ClientEnhancementProps {
  content: BrainContent
}

function BrainLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          {/* Animated neural network */}
          <div className="w-32 h-24 border border-purple-400/30 rounded-full mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent animate-pulse"></div>
            {/* Neural nodes */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-300"></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-700"></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping delay-1000"></div>
            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full">
              <line x1="25%" y1="25%" x2="75%" y2="33%" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.3" className="animate-pulse" />
              <line x1="75%" y1="33%" x2="33%" y2="75%" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" className="animate-pulse delay-500" />
              <line x1="33%" y1="75%" x2="66%" y2="75%" stroke="#10b981" strokeWidth="0.5" opacity="0.3" className="animate-pulse delay-700" />
            </svg>
          </div>
          <p className="text-purple-300 animate-pulse">Activating Neural Networks...</p>
          <p className="text-sm text-purple-400/70 mt-2">Synchronizing brain regions...</p>
        </div>
      </div>
    </div>
  )
}

export default function ClientEnhancement({ content }: ClientEnhancementProps) {
  return (
    <div className="relative w-full min-h-screen">
      {/* Content overlay that works with brain universe background */}
      <HomeContent content={content} />
    </div>
  )
}
