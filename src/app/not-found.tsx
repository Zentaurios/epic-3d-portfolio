import { Metadata } from 'next'
import Link from 'next/link'
import { Brain, Home, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: '404 - Brain on Drugs | Webb3Fitty',
  description: 'Page not found - Looks like this brain went a bit haywire.',
  robots: 'noindex, nofollow',
}

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-950 via-red-900 to-black">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Brain Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse">
            <Brain className="w-32 h-32 mx-auto text-red-500/30" />
          </div>
          <Brain className="w-32 h-32 mx-auto text-red-400 animate-bounce" />
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <AlertTriangle className="w-8 h-8 text-yellow-400 animate-ping" />
          </div>
        </div>

        {/* Glitchy 404 Text */}
        <div className="mb-8">
          <h1 className="relative mb-4 font-bold text-red-500 text-8xl md:text-9xl">
            <span className="relative inline-block">
              4
              <span className="absolute inset-0 text-red-300 transform translate-x-1 translate-y-1 animate-pulse">4</span>
            </span>
            <span className="relative inline-block mx-2">
              0
              <span className="absolute inset-0 text-red-300 transform -translate-x-1 translate-y-1 animate-pulse">0</span>
            </span>
            <span className="relative inline-block">
              4
              <span className="absolute inset-0 text-red-300 transform translate-x-1 -translate-y-1 animate-pulse">4</span>
            </span>
          </h1>
          
          <h2 className="mb-2 text-3xl font-bold text-red-400 md:text-4xl animate-pulse">
            Brain on Drugs
          </h2>
          
          <p className="max-w-lg mx-auto mb-8 text-xl leading-relaxed text-red-200/80">
            Looks like this neural pathway got a bit too creative. 
            The page you're looking for has wandered off into the digital void.
          </p>
        </div>

        {/* Glitch Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-2 h-32 transform top-1/3 left-1/4 bg-red-500/20 animate-pulse rotate-12"></div>
          <div className="absolute w-1 h-24 transform -rotate-45 top-2/3 right-1/4 bg-red-400/30 animate-pulse"></div>
          <div className="absolute w-3 h-16 top-1/2 left-1/3 bg-red-600/10 animate-ping"></div>
        </div>

        {/* Rehab Button */}
        <Link 
          href="/"
          className="relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden font-semibold text-white transition-all duration-300 transform rounded-full group bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
        >
          {/* Button Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          
          <Home className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-lg">Rehab</span>
          
          {/* Healing Sparkles */}
          <div className="absolute w-2 h-2 rounded-full opacity-75 -top-1 -right-1 bg-emerald-300 animate-ping"></div>
          <div className="absolute w-1 h-1 rounded-full -bottom-1 -left-1 bg-emerald-400 animate-pulse"></div>
        </Link>

        {/* Recovery Message */}
        <p className="mt-6 text-sm italic text-red-300/60">
          Don't worry, we'll get this brain back to normal functioning.
        </p>

        {/* Floating Error Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-red-400/40 rounded-full animate-bounce`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
