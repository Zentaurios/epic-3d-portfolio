'use client'

// Compatibility layer for existing code that uses useLenisScroll
// This provides a drop-in replacement that works with the new UnifiedScrollProvider

import { useUnifiedScrollHook } from '@/lib/hooks/useLenisScroll'

// Re-export for backward compatibility
export const useLenisScroll = useUnifiedScrollHook
export { useUnifiedScrollHook }

// Export the new provider for components that want to migrate
export { UnifiedScrollProvider, useUnifiedScroll } from '@/components/providers/UnifiedScrollProvider'
