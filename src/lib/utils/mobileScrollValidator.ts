/**
 * Mobile Scrolling Validation Script
 * This script helps validate that mobile scrolling is working correctly
 */

interface ScrollTestResult {
  deviceType: 'mobile' | 'desktop'
  scrollMethod: 'lenis' | 'native'
  touchSupport: boolean
  scrollPerformance: 'good' | 'poor' | 'failed'
  details: string[]
}

export class MobileScrollValidator {
  private results: ScrollTestResult

  constructor() {
    this.results = {
      deviceType: this.detectDeviceType(),
      scrollMethod: this.detectScrollMethod(),
      touchSupport: this.detectTouchSupport(),
      scrollPerformance: 'good',
      details: []
    }
  }

  private detectDeviceType(): 'mobile' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth <= 768
    const isIOS = /ipad|iphone|ipod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const hasNoHover = window.matchMedia('(hover: none)').matches

    const isMobile = isMobileUserAgent || isIOS || 
                    (isTouchDevice && isSmallScreen) || 
                    (hasCoarsePointer && hasNoHover)

    return isMobile ? 'mobile' : 'desktop'
  }

  private detectScrollMethod(): 'lenis' | 'native' {
    const lenis = (window as { lenis?: object }).lenis
    return lenis ? 'lenis' : 'native'
  }

  private detectTouchSupport(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }

  public async runValidation(): Promise<ScrollTestResult> {
    this.results.details = []

    // Test 1: Check if scrolling works at all
    const initialScrollY = window.scrollY
    this.results.details.push(`Initial scroll position: ${initialScrollY}`)

    // Test 2: Try to scroll programmatically
    const testScrollPosition = 100
    window.scrollTo({ top: testScrollPosition, behavior: 'smooth' })

    await this.wait(500) // Wait for scroll to complete

    const afterScrollY = window.scrollY
    this.results.details.push(`After programmatic scroll: ${afterScrollY}`)

    if (Math.abs(afterScrollY - testScrollPosition) > 10) {
      this.results.scrollPerformance = 'poor'
      this.results.details.push('⚠️ Programmatic scrolling not working properly')
    }

    // Test 3: Check scroll height calculation
    const documentHeight = document.documentElement.scrollHeight
    const viewportHeight = window.innerHeight
    const maxScroll = documentHeight - viewportHeight

    this.results.details.push(`Document height: ${documentHeight}`)
    this.results.details.push(`Viewport height: ${viewportHeight}`)
    this.results.details.push(`Max scroll: ${maxScroll}`)

    if (maxScroll <= 0) {
      this.results.scrollPerformance = 'failed'
      this.results.details.push('❌ No scrollable content detected')
    }

    // Test 4: Check CSS scroll behavior
    const htmlOverflow = getComputedStyle(document.documentElement).overflow
    const bodyOverflow = getComputedStyle(document.body).overflow
    
    this.results.details.push(`HTML overflow: ${htmlOverflow}`)
    this.results.details.push(`Body overflow: ${bodyOverflow}`)

    if (this.results.deviceType === 'mobile' && htmlOverflow === 'hidden') {
      this.results.scrollPerformance = 'poor'
      this.results.details.push('⚠️ HTML overflow hidden on mobile - may prevent scrolling')
    }

    // Test 5: Lenis-specific tests
    if (this.results.scrollMethod === 'lenis') {
      const lenis = (window as { lenis?: { limit: number, scroll: number } }).lenis
      if (lenis) {
        this.results.details.push(`Lenis limit: ${lenis.limit}`)
        this.results.details.push(`Lenis scroll: ${lenis.scroll}`)

        if (lenis.limit < maxScroll - 50) {
          this.results.scrollPerformance = 'poor'
          this.results.details.push('⚠️ Lenis limit is less than actual scrollable height')
        }
      }
    }

    // Restore original scroll position
    window.scrollTo({ top: initialScrollY, behavior: 'smooth' })

    return this.results
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  public generateReport(): string {
    const { deviceType, scrollMethod, touchSupport, scrollPerformance, details } = this.results

    let report = `📱 Mobile Scroll Validation Report\n`
    report += `=====================================\n\n`
    report += `Device Type: ${deviceType.toUpperCase()}\n`
    report += `Scroll Method: ${scrollMethod.toUpperCase()}\n`
    report += `Touch Support: ${touchSupport ? 'YES' : 'NO'}\n`
    report += `Performance: ${scrollPerformance.toUpperCase()}\n\n`
    
    report += `Details:\n`
    details.forEach(detail => {
      report += `  • ${detail}\n`
    })

    return report
  }
}

// Global function to run validation (available in both dev and production for mobile debugging)
if (typeof window !== 'undefined') {
  (window as { validateMobileScroll?: () => Promise<ScrollTestResult> }).validateMobileScroll = async () => {
    const validator = new MobileScrollValidator()
    const result = await validator.runValidation()
    
    // In production, only log if there are issues
    if (process.env.NODE_ENV === 'production') {
      if (result.scrollPerformance !== 'good') {
        console.warn('📱 Mobile Scroll Issue Detected:', validator.generateReport())
      }
    } else {
      // In development, always log the full report
      console.log(validator.generateReport())
    }
    
    return result
  }
}
