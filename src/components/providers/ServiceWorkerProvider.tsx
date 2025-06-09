'use client'

import { useEffect } from 'react'

export function ServiceWorkerProvider() {
  useEffect(() => {
    // Only register service worker in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SW === 'true') {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
              console.log('Service worker registered:', registration)
            })
            .catch((error) => {
              console.error('Error registering service worker:', error)
            })
        })
      }
    } else {
      console.log('Service worker registration skipped in development')
    }
  }, [])

  return null // This component doesn't render anything
}
