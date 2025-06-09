'use client'

import React from 'react'
import { Brain, MessageCircle } from 'lucide-react'
import { useAIAgent } from './AIAgentProvider'

export const AIAgentButton: React.FC = () => {
  const { isOpen, toggleChat } = useAIAgent()

  return (
    <div className="fixed z-50 transform -translate-x-1/2 bottom-6 right-6">
      <div className="w-full max-w-6xl px-4 mx-auto">
        <div className="flex justify-end">
          <button
            onClick={toggleChat}
            className={`
              group relative overflow-hidden
              bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600
              hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500
              text-white p-4 rounded-full shadow-2xl
              transition-all duration-300 ease-out
              ${isOpen ? 'scale-95' : 'scale-100 hover:scale-105'}
              focus:outline-none focus:ring-4 focus:ring-purple-500/30
            `}
            aria-label={isOpen ? 'Close AI Agent' : 'Open AI Agent'}
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-50 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 blur-md group-hover:opacity-75"></div>
            
            {/* Icon container with animation */}
            <div className="relative z-10 flex items-center justify-center">
              {isOpen ? (
                <MessageCircle 
                  size={24} 
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
              ) : (
                <Brain 
                  size={24} 
                  className="transition-transform duration-300 group-hover:rotate-12"
                />
              )}
            </div>

            {/* Pulse animation when closed */}
            {!isOpen && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 animate-pulse opacity-30"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
