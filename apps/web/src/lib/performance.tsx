'use client'

import { useEffect, useState, lazy, ComponentType } from 'react'

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
  })

  useEffect(() => {
    // Core Web Vitals monitoring
    if (typeof window !== 'undefined') {
      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
        })
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        setMetrics(prev => ({ ...prev, cls: clsValue }))
      }).observe({ entryTypes: ['layout-shift'] })

      // First Contentful Paint (FCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
        })
      }).observe({ entryTypes: ['paint'] })

      // Time to First Byte (TTFB)
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          setMetrics(prev => ({ ...prev, ttfb: entry.responseStart - entry.requestStart }))
        })
      }).observe({ entryTypes: ['navigation'] })
    }
  }, [])

  return metrics
}

// Lazy loading wrapper for components
export function lazyLoadComponent(importFunc: () => Promise<any>, fallback?: ComponentType) {
  return lazy(importFunc)
}

// Image optimization component
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  ...props
}: {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  [key: string]: any
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  )
}

// Bundle size monitoring
export function useBundleAnalyzer() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Monitor bundle size in development
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceResourceTiming | any) => {
          if (entry.name.includes('bundle')) {
            console.log('Bundle size:', entry.transferSize || 0, 'bytes')
          }
        })
      })
      observer.observe({ entryTypes: ['resource'] })

      return () => observer.disconnect()
    }
  }, [])
}

// Memory usage monitoring
export function useMemoryMonitor() {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number
    total: number
    limit: number
  } | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const updateMemory = () => {
        const mem = (performance as any).memory
        setMemoryUsage({
          used: mem.usedJSHeapSize,
          total: mem.totalJSHeapSize,
          limit: mem.jsHeapSizeLimit,
        })
      }

      updateMemory()
      const interval = setInterval(updateMemory, 5000)

      return () => clearInterval(interval)
    }
  }, [])

  return memoryUsage
}

// Resource loading optimization
export function useResourceHints() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Preconnect to external domains
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://images.unsplash.com',
      ]

      domains.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = domain
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      })

      // Preload critical resources
      const criticalResources = [
        '/favicon.ico',
      ]

      criticalResources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = resource
        link.as = resource.endsWith('.js') ? 'script' : 'image'
        document.head.appendChild(link)
      })
    }
  }, [])
}

// Service worker registration for caching
export function useServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])
}