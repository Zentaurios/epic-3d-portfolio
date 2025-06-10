'use client'

import { MobileScrollTest } from '@/components/debug/MobileScrollTest'

export default function ScrollTestPage() {
  const sections = [
    { id: 'section1', title: 'Section 1', color: 'bg-blue-900' },
    { id: 'section2', title: 'Section 2', color: 'bg-purple-900' },
    { id: 'section3', title: 'Section 3', color: 'bg-green-900' },
    { id: 'section4', title: 'Section 4', color: 'bg-red-900' },
    { id: 'section5', title: 'Section 5', color: 'bg-yellow-900' },
    { id: 'section6', title: 'Section 6', color: 'bg-pink-900' },
    { id: 'section7', title: 'Section 7', color: 'bg-indigo-900' },
    { id: 'section8', title: 'Section 8', color: 'bg-teal-900' },
  ]

  return (
    <div className="w-full">
      <MobileScrollTest />
      
      {/* Fixed header for navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 border-b border-gray-700 bg-black/90 backdrop-blur-sm">
        <h1 className="text-lg font-bold text-white">Mobile Scroll Test</h1>
        <p className="text-gray-300 text-sm mt-1">
          🔧 Debug page for testing scroll functionality on mobile devices
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const element = document.getElementById(section.id)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-3 py-1 text-sm text-white bg-gray-700 rounded hover:bg-gray-600"
            >
              {section.title}
            </button>
          ))}
        </div>
        {/* Add validation button for production testing */}
        <button
          onClick={async () => {
            const validator = (window as { validateMobileScroll?: () => Promise<unknown> }).validateMobileScroll
            if (validator) {
              await validator()
            } else {
              console.log('Validator not available')
            }
          }}
          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          Run Scroll Validation
        </button>
      </div>

      {/* Test sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className={`min-h-screen flex items-center justify-center ${section.color} pt-32`}
        >
          <div className="text-center text-white">
            <h2 className="mb-4 text-4xl font-bold md:text-6xl">{section.title}</h2>
            <p className="max-w-2xl px-4 mx-auto text-lg md:text-xl opacity-80">
              This is test content for {section.title.toLowerCase()}. 
              Try scrolling on different devices to test the mobile scrolling implementation.
              The debug panel shows real-time scroll metrics.
            </p>
            <div className="mt-8 text-sm opacity-60">
              <p>Section {index + 1} of {sections.length}</p>
              <p>Scroll down to continue or use the navigation buttons above</p>
            </div>
          </div>
        </section>
      ))}

      {/* Bottom section with scroll-to-top */}
      <section className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <h2 className="mb-4 text-4xl font-bold md:text-6xl">End of Test</h2>
          <p className="max-w-2xl px-4 mx-auto mb-8 text-lg md:text-xl opacity-80">
            You`&apos;`ve reached the end of the scroll test. How did the scrolling feel on your device?
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Scroll to Top
          </button>
        </div>
      </section>
    </div>
  )
}
