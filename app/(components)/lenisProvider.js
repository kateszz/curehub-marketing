'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis to GSAP ticker for smooth integration
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // Disable GSAP's lag smoothing to prevent conflicts
    gsap.ticker.lagSmoothing(0)

    // Optional: Log scroll values for debugging
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // console.log({ scroll, limit, velocity, direction, progress })
    })

    // Cleanup function
    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  return children
}