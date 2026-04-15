'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function PostHogProvider({ children }) {
  const router = useRouter()

  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window !== 'undefined' && !posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_placeholder', {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        person_profiles: 'always', // or 'identifed_only'
        capture_pageview: false // we handle this manually or just let Next.js do its thing, but usually we handle pageviews in Next app router
      })
    }
  }, [])

  return children
}
