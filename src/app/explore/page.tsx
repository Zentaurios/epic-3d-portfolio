import { Suspense } from 'react'
import { ProjectGrid, ProjectGridSkeleton } from '@/components/explore/ProjectGrid'
import { TechStack, TechStackSkeleton } from '@/components/explore/TechStack'
import { client, projectQueries, getProjectStats } from '@/lib/sanity/client'
import type { Project } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creative Nexus - Explore Projects | Webb3Fitty',
  description: 'Navigate through a constellation of innovative creations spanning Web3, AI, and immersive digital experiences. Each project represents synaptic leaps in technological evolution.',
  keywords: ['webb3fitty', 'portfolio', 'projects', 'web3', 'blockchain', 'ai', 'machine learning', '3d development', 'fintech', 'dapp development', 'creative nexus'],
  authors: [{ name: "Webb3Fitty" }],
  creator: "Webb3Fitty",
  publisher: "Webb3Fitty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // OpenGraph metadata
  openGraph: {
    title: 'Creative Nexus - Explore Projects | Webb3Fitty',
    description: 'Navigate through innovative projects spanning Web3, AI, and immersive digital experiences.',
    type: 'website',
    locale: "en_US",
    url: 'https://webb3fitty.dev/explore',
    siteName: "Webb3Fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        width: 1200,
        height: 630,
        alt: "Creative Nexus - Explore Projects | Webb3Fitty",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Creative Nexus - Explore Projects | Webb3Fitty',
    description: 'Navigate through innovative projects spanning Web3, AI, and immersive digital experiences.',
    creator: "@webb3fitty",
    site: "@webb3fitty",
    images: [
      {
        url: "https://webb3fitty.dev/webb3fitty.png",
        alt: "Creative Nexus - Explore Projects | Webb3Fitty",
      }
    ],
  },

  // Additional metadata
  alternates: {
    canonical: "https://webb3fitty.dev/explore",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Projects specific metadata
  other: {
    'portfolio:author': 'Webb3Fitty',
    'portfolio:section': 'projects',
    'projects:categories': 'Web3,AI,Blockchain,Development',
    'content:type': 'portfolio',
  },
}

// Server-side data fetching
async function getExplorePageData() {
  try {
    const [projects, stats] = await Promise.all([
      client.fetch(projectQueries.getAllProjects),
      getProjectStats()
    ])
    
    return {
      projects: projects as Project[],
      stats
    }
  } catch (error) {
    console.error('Error fetching explore page data:', error)
    return {
      projects: [],
      stats: {
        totalProjects: 0,
        liveProjects: 0,
        categories: 0,
        technologies: 0,
        featuredProjects: 0
      }
    }
  }
}

export default async function ExplorePage() {
  const data = await getExplorePageData()
  
  return (
    <>
      {/* Explore Content - Creativity Region Context */}
      <div className="relative z-10 w-full min-h-screen">
        <main className="relative z-10">
          {/* Explore Header - Creative Consciousness */}
          <section 
            id="explore-header" 
            data-section="explore-header"
            className="page-section brain-region-creativity"
          >
            <div className="text-center content-wrapper max-w-7xl">
              {/* Neural creativity indicator */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-cyan-500/5 to-emerald-500/5" />
              
              <h1 className="relative mb-8 text-5xl font-bold md:text-7xl heading-gradient">
                Creative Nexus
                {/* Innovation sparks */}
                <div className="absolute w-3 h-3 rounded-full -top-4 -right-4 bg-cyan-400 animate-ping" />
                <div className="absolute w-2 h-2 delay-500 rounded-full top-1/2 -left-6 bg-emerald-400 animate-ping" />
                <div className="absolute bottom-0 w-1 h-1 delay-1000 bg-purple-400 rounded-full right-1/4 animate-ping" />
              </h1>
              
              <p className="max-w-4xl mx-auto mb-12 text-xl leading-relaxed text-gray-300 md:text-2xl">
                Navigate through a constellation of innovative creations spanning Web3, AI, 
                and immersive digital experiences. Each project represents synaptic leaps 
                in technological evolution and creative expression.
              </p>
              
              {/* Creative Output Stats with Neural Enhancement */}
              <div className="grid grid-cols-2 gap-6 mb-16 md:grid-cols-4">
                <div className="relative p-6 overflow-hidden transition-colors border glass-dark border-cyan-500/20 hover:border-cyan-400/40 group">
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/5 group-hover:opacity-100" />
                  <div className="mb-2 text-3xl font-bold transition-transform text-cyan-300 group-hover:scale-110">
                    {data.stats.totalProjects || 0}{data.stats.totalProjects > 0 ? '+' : ''}
                  </div>
                  <div className="text-gray-400">Neural Projects</div>
                  {/* Creative pulse */}
                  <div className="absolute w-2 h-2 rounded-full top-2 right-2 bg-cyan-400 animate-pulse" />
                </div>
                <div className="relative p-6 overflow-hidden transition-colors border glass-dark border-emerald-500/20 hover:border-emerald-400/40 group">
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/5 group-hover:opacity-100" />
                  <div className="mb-2 text-3xl font-bold transition-transform text-emerald-300 group-hover:scale-110">
                    {data.stats.categories || 0}
                  </div>
                  <div className="text-gray-400">Tech Paradigms</div>
                  <div className="absolute w-2 h-2 delay-300 rounded-full top-2 right-2 bg-emerald-400 animate-pulse" />
                </div>
                <div className="relative p-6 overflow-hidden transition-colors border glass-dark border-purple-500/20 hover:border-purple-400/40 group">
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-purple-500/0 to-purple-500/5 group-hover:opacity-100" />
                  <div className="mb-2 text-3xl font-bold text-purple-300 transition-transform group-hover:scale-110">
                    {data.stats.technologies || 0}+
                  </div>
                  <div className="text-gray-400">Code Synapses</div>
                  <div className="absolute w-2 h-2 delay-700 bg-purple-400 rounded-full top-2 right-2 animate-pulse" />
                </div>
                <div className="relative p-6 overflow-hidden transition-colors border glass-dark border-amber-500/20 hover:border-amber-400/40 group">
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-amber-500/0 to-amber-500/5 group-hover:opacity-100" />
                  <div className="mb-2 text-3xl font-bold transition-transform text-amber-300 group-hover:scale-110">∞</div>
                  <div className="text-gray-400">Innovation Flow</div>
                  <div className="absolute w-2 h-2 delay-1000 rounded-full top-2 right-2 bg-amber-400 animate-pulse" />
                </div>
              </div>
              
              {/* Creative Philosophy */}
              <div className="relative max-w-4xl p-8 mx-auto overflow-hidden border glass-dark border-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />
                <blockquote className="relative z-10 text-xl italic leading-relaxed text-gray-300 md:text-2xl">
                  `&quot;`Every line of code is a neural pathway to innovation. Every project 
                  is a creative synapse firing across the digital consciousness, 
                  reshaping what`&apos;`s possible in our interconnected reality.`&quot;`
                </blockquote>
                <cite className="block mt-4 font-semibold text-cyan-400">- Webb3Fitty`&apos;`s Creative Core</cite>
                {/* Thought patterns */}
                <div className="absolute flex gap-1 bottom-4 right-4">
                  <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                  <div className="w-1 h-1 delay-200 rounded-full bg-emerald-400 animate-ping" />
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping delay-400" />
                </div>
              </div>
            </div>
          </section>
          
          {/* Neural Tech Stack */}
          <section 
            id="tech-stack" 
            data-section="tech-stack"
            className="brain-region-creativity"
          >
            <Suspense fallback={<TechStackSkeleton />}>
              <TechStack />
            </Suspense>
          </section>
          
          {/* Creative Project Grid */}
          <section 
            id="project-grid" 
            data-section="project-grid"
            className="brain-region-creativity"
          >
            <Suspense fallback={<ProjectGridSkeleton />}>
              <ProjectGrid initialProjects={data.projects} stats={data.stats} />
            </Suspense>
          </section>
          
          {/* Innovation Call to Action */}
          <section 
            id="cta" 
            data-section="cta"
            className="flex items-center justify-center min-h-screen p-8 brain-region-creativity"
          >
            <div className="relative max-w-4xl mx-auto text-center">
              {/* Neural background activity */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 rounded-3xl blur-xl" />
              
              <h2 className="relative z-10 mb-8 text-4xl font-bold md:text-5xl heading-gradient">
                Ready to Ignite Innovation?
              </h2>
              <p className="relative z-10 mb-12 text-xl leading-relaxed text-gray-300">
                Let`&apos;`s synchronize our creative frequencies and build projects that transcend 
                digital boundaries. Whether it`&apos;`s Web3 evolution, AI consciousness, or 
                immersive reality experiences, together we can architect legendary solutions.
              </p>
              
              <div className="relative z-10 flex flex-col justify-center gap-6 sm:flex-row">
                <button className="relative px-8 py-4 overflow-hidden text-lg font-semibold text-white transform rounded-full group bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 smooth-transition glow-cyan hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    Initiate Collaboration
                    <svg className="w-5 h-5 group-hover:translate-x-1 smooth-transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                
                <button className="relative px-8 py-4 overflow-hidden text-lg font-semibold transform border rounded-full group glass-dark border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/20 smooth-transition hover:scale-105">
                  <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center gap-2">
                    Neural Resume
                    <svg className="w-5 h-5 group-hover:scale-110 smooth-transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                </button>
              </div>
              
              {/* Innovation indicators */}
              <div className="absolute flex gap-2 top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <div className="w-2 h-2 delay-700 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}


