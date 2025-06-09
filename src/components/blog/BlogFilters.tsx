'use client'

import { useState } from 'react'
import { Filter, TrendingUp, Calendar, Clock } from 'lucide-react'

const categories = [
  { id: 'all', label: 'All Posts', count: 24, color: 'purple' },
  { id: 'web3', label: 'Web3', count: 8, color: 'purple' },
  { id: 'ai', label: 'AI & Machine Learning', count: 6, color: 'cyan' },
  { id: 'react', label: 'React & Next.js', count: 5, color: 'blue' },
  { id: '3d', label: '3D & WebGL', count: 3, color: 'emerald' },
  { id: 'tools', label: 'Dev Tools', count: 2, color: 'amber' },
]

const popularTags = [
  'TypeScript', 'Blockchain', 'Smart Contracts', 'Three.js', 
  'Performance', 'Web3', 'DeFi', 'NFTs', 'AI', 'Machine Learning'
]

export function BlogFilters() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Filter className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Explore Topics</h2>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden px-4 py-2 glass rounded-lg text-purple-400 hover:text-purple-300 smooth-transition"
          >
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Category Filters */}
        <div className={`glass-dark p-6 rounded-2xl mb-8 ${isExpanded ? 'block' : 'hidden md:block'}`}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>Categories</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl smooth-transition group ${
                  selectedCategory === category.id
                    ? `glow-${category.color} bg-${category.color}-600/20 border-${category.color}-500`
                    : 'glass hover:bg-white/5'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    selectedCategory === category.id
                      ? `text-${category.color}-300`
                      : 'text-white group-hover:text-purple-300'
                  }`}>
                    {category.count}
                  </div>
                  <div className={`text-sm ${
                    selectedCategory === category.id
                      ? `text-${category.color}-200`
                      : 'text-gray-400 group-hover:text-gray-300'
                  }`}>
                    {category.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Popular Tags */}
        <div className={`glass-dark p-6 rounded-2xl mb-8 ${isExpanded ? 'block' : 'hidden md:block'}`}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Popular Tags</span>
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 glass rounded-full text-sm text-gray-300 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/50 smooth-transition border border-transparent"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
          <div className="glass p-4 text-center hover:glow-purple smooth-transition">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white mb-1">156</div>
            <div className="text-sm text-gray-400">Hours of Content</div>
          </div>
          
          <div className="glass p-4 text-center hover:glow-cyan smooth-transition">
            <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white mb-1">50K+</div>
            <div className="text-sm text-gray-400">Monthly Readers</div>
          </div>
          
          <div className="glass p-4 text-center hover:glow-amber smooth-transition">
            <Filter className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white mb-1">12</div>
            <div className="text-sm text-gray-400">Tutorial Series</div>
          </div>
          
          <div className="glass p-4 text-center hover:glow-emerald smooth-transition">
            <Calendar className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white mb-1">Weekly</div>
            <div className="text-sm text-gray-400">New Articles</div>
          </div>
        </div>
      </div>
    </section>
  )
}
