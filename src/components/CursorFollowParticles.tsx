"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { colors } from "../theme/theme"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  glowPhase: number
  creationTime: number
  lifespan: number
  fadeOutStartPct?: number
  sourceType?: number // 0-3 for edges, 4 for internal grid
}

const CursorFollowParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const isMouseMovingRef = useRef<boolean>(false)
  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const targetEdgeRef = useRef<"left" | "right" | null>(null)
  const frameCountRef = useRef<number>(0)
  const currentTimeRef = useRef<number>(0)

  // Create a new particle
  const createParticle = (width: number, height: number, now: number): Particle => {
    const particleColors = [colors.accent.primary, colors.accent.secondary, "#FFFFFF"]
    const color = particleColors[Math.floor(Math.random() * particleColors.length)]
    const size = Math.random() * 3 + 1

    // Determine source: 0-3 for edges, 4 for internal grid
    // Increase probability of edge particles to maintain the flow
    const isEdgeParticle = Math.random() < 0.7

    let sourceType: number

    if (isEdgeParticle) {
      // For edge particles, bias toward left and right edges
      // Original: equal 25% chance for each edge
      // New: 40% chance each for left and right, 10% each for top and bottom
      const edgeRandom = Math.random()
      if (edgeRandom < 0.4) {
        sourceType = 3 // Left edge (40% of edge particles)
      } else if (edgeRandom < 0.8) {
        sourceType = 1 // Right edge (40% of edge particles)
      } else if (edgeRandom < 0.9) {
        sourceType = 0 // Top edge (10% of edge particles)
      } else {
        sourceType = 2 // Bottom edge (10% of edge particles)
      }
    } else {
      sourceType = 4 // Internal grid
    }

    let x, y, speedX, speedY

    if (sourceType === 4) {
      // Internal grid generation
      // Create a virtual grid (e.g., 6x4)
      const gridCols = 6
      const gridRows = 4
      const cellWidth = width / gridCols
      const cellHeight = height / gridRows

      // Pick a random cell
      const cellX = Math.floor(Math.random() * gridCols)
      const cellY = Math.floor(Math.random() * gridRows)

      // Position within the cell (slightly randomized)
      x = cellX * cellWidth + Math.random() * cellWidth
      y = cellY * cellHeight + Math.random() * cellHeight

      // Random direction with lower speed for internal particles
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.3 + 0.1
      speedX = Math.cos(angle) * speed
      speedY = Math.sin(angle) * speed
    } else {
      // Edge generation (original logic)
      switch (sourceType) {
        case 0: // Top
          x = Math.random() * width
          y = -size * 2
          speedX = (Math.random() - 0.5) * 0.8
          speedY = Math.random() * 0.5 + 0.2
          break
        case 1: // Right
          // Generate more particles from right edge
          x = width + size * 10
          y = Math.random() * height
          speedX = -(Math.random() * 0.5 + 0.2)
          speedY = (Math.random() - 0.5) * 0.8
          break
        case 2: // Bottom
          x = Math.random() * width
          y = height + size * 2
          speedX = (Math.random() - 0.5) * 0.8
          speedY = -(Math.random() * 0.5 + 0.2)
          break
        case 3: // Left
          // Generate more particles from left edge
          x = -size * 10
          y = Math.random() * height
          speedX = Math.random() * 0.5 + 0.2
          speedY = (Math.random() - 0.5) * 0.8
          break
        default:
          // Fallback (should never happen)
          x = Math.random() * width
          y = -size * 2
          speedX = (Math.random() - 0.5) * 0.8
          speedY = Math.random() * 0.5 + 0.2
      }
    }

    let lifespan = Math.random() * 7000 + 8000 // Base lifespan: 8-15 seconds

    // Give left/right edge particles a longer lifespan
    if (sourceType === 1 || sourceType === 3) {
      // Right (1) or Left (3) edges
      // Calculate how long it would take to travel 3/4 of the screen width
      // based on the particle's speed
      const distanceToTravel = width * 0.75
      const speed = Math.abs(speedX)
      const timeNeeded = (distanceToTravel / speed) * 12.5 // Adjusted for the deltaTime factor

      // Ensure the lifespan is at least long enough to travel the required distance
      // Add some extra time to account for the fade out period
      lifespan = Math.max(lifespan, timeNeeded * 1.2)
    }

    // Add slight variation to when the particle starts fading out (75-85% of lifespan)
    const fadeOutStartPct = 0.75 + Math.random() * 0.1

    return {
      x,
      y,
      size,
      speedX,
      speedY,
      color,
      opacity: sourceType === 4 ? Math.random() * 0.3 + 0.1 : 0, // Internal particles start with some opacity
      glowPhase: Math.random() * Math.PI * 2,
      creationTime: now,
      lifespan,
      fadeOutStartPct,
      sourceType, // Track where the particle came from
    }
  }

  // Initialize particles
  const initParticles = (now: number) => {
    const particles: Particle[] = []

    // Create initial batch of particles
    for (let i = 0; i < 150; i++) {
      // Increased from 120 to 150 for more particles
      const particle = createParticle(dimensions.width, dimensions.height, now)

      // For initial particles, distribute them throughout the canvas
      if (i < 80) {
        // Distribute some particles across canvas
        particle.x = Math.random() * dimensions.width
        particle.y = Math.random() * dimensions.height
        particle.sourceType = 4 // Mark as internal
      } else if (i < 115) {
        // Add more particles specifically from left and right edges
        // Alternate between left and right
        if (i % 2 === 0) {
          // Left edge
          particle.x = -particle.size * 10
          particle.y = Math.random() * dimensions.height
          particle.speedX = Math.random() * 0.5 + 0.2
          particle.speedY = (Math.random() - 0.5) * 0.8
          particle.sourceType = 3
        } else {
          // Right edge
          particle.x = dimensions.width + particle.size * 10
          particle.y = Math.random() * dimensions.height
          particle.speedX = -(Math.random() * 0.5 + 0.2)
          particle.speedY = (Math.random() - 0.5) * 0.8
          particle.sourceType = 1
        }
      }
      // The rest will use their generated positions (from edges)

      // Stagger creation times so they don't all fade at once
      particle.creationTime = now - Math.random() * particle.lifespan * 0.8

      // Start with some opacity since they're already visible
      particle.opacity = Math.random() * 0.5 + 0.2

      particles.push(particle)
    }

    particlesRef.current = particles
  }

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Track mouse position with debounce for "stopped" detection
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const mouseX = event.clientX - rect.left

        // Mark that mouse is moving
        isMouseMovingRef.current = true

        // Clear any existing timer
        if (mouseTimerRef.current) {
          clearTimeout(mouseTimerRef.current)
        }

        // Set a timer to detect when mouse has stopped
        mouseTimerRef.current = setTimeout(() => {
          isMouseMovingRef.current = false

          // Calculate distance to left and right edges
          const distanceToLeft = mouseX
          const distanceToRight = dimensions.width - mouseX

          // Set target edge to the closer edge
          targetEdgeRef.current = distanceToLeft < distanceToRight ? "left" : "right"
        }, 150) // 150ms debounce
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (mouseTimerRef.current) {
        clearTimeout(mouseTimerRef.current)
      }
    }
  }, [dimensions.width])

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Initialize particles with current timestamp
    const startTime = performance.now()
    currentTimeRef.current = startTime
    initParticles(startTime)

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = Math.min(timestamp - lastTimeRef.current, 33) // Cap at ~30fps equivalent
      lastTimeRef.current = timestamp
      currentTimeRef.current = timestamp
      frameCountRef.current++

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add new particles periodically
      if (frameCountRef.current % 2 === 0) {
        // Changed from 3 to 2 to generate more particles
        // Ensure we're generating particles from all sources
        const newParticle = createParticle(canvas.width, canvas.height, timestamp)
        particlesRef.current.push(newParticle)
      }

      // Update and draw particles
      const particlesToKeep: Particle[] = []

      for (const particle of particlesRef.current) {
        // Calculate particle age
        const age = timestamp - particle.creationTime

        // Calculate lifecycle phase
        // 0-10% of lifespan: fade in
        // 10-fadeOutStartPct% of lifespan: full opacity
        // fadeOutStartPct-100% of lifespan: fade out
        const fadeInDuration = particle.lifespan * 0.1
        const fadeOutStart = particle.lifespan * (particle.fadeOutStartPct || 0.8)

        // Calculate base opacity from glow effect
        const baseOpacity = 0.2
        const opacityRange = 0.6
        const glowOpacity = baseOpacity + (Math.sin(particle.glowPhase) + 1) * 0.5 * opacityRange

        // Apply lifecycle fade
        let lifecycleOpacity = 1.0

        if (age < fadeInDuration) {
          // Fade in phase
          lifecycleOpacity = age / fadeInDuration
        } else if (age > fadeOutStart) {
          // Fade out phase
          const fadeOutProgress = (age - fadeOutStart) / (particle.lifespan - fadeOutStart)
          lifecycleOpacity = 1.0 - fadeOutProgress
        }

        // Apply both glow and lifecycle opacity
        particle.opacity = glowOpacity * lifecycleOpacity

        // Skip rendering and don't keep particles that are completely faded out
        if (particle.opacity <= 0.01) {
          continue
        }

        // Only adjust direction if mouse is not moving and we have a target edge
        if (!isMouseMovingRef.current && targetEdgeRef.current !== null) {
          // Apply a gentle force in the direction of the target edge
          if (targetEdgeRef.current === "left") {
            // Gradually adjust speed based on x position - stronger effect further from edge
            const distanceFromEdge = particle.x / canvas.width // 0 at left edge, 1 at right edge
            particle.speedX -= 0.01 * distanceFromEdge // Stronger pull when further from left edge
          } else if (targetEdgeRef.current === "right") {
            // Gradually adjust speed based on x position - stronger effect further from edge
            const distanceFromEdge = (canvas.width - particle.x) / canvas.width // 0 at right edge, 1 at left edge
            particle.speedX += 0.01 * distanceFromEdge // Stronger pull when further from right edge
          }
        }

        // Apply friction for smooth movement
        particle.speedX *= 0.98
        particle.speedY *= 0.98

        // Add very subtle natural movement
        particle.speedX += (Math.random() - 0.5) * 0.01
        particle.speedY += (Math.random() - 0.5) * 0.01

        // Update position
        particle.x += particle.speedX * deltaTime * 0.08
        particle.y += particle.speedY * deltaTime * 0.08

        // Update glow phase - all particles have same cycle duration but different starting phases
        particle.glowPhase += 0.0008 * deltaTime
        if (particle.glowPhase > Math.PI * 2) {
          particle.glowPhase -= Math.PI * 2
        }

        // Draw particle with glow
        const glowSize = particle.size * (1 + particle.opacity * 2)

        // Create glow effect
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize * 2)
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(1, "rgba(0,0,0,0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowSize * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.globalAlpha = particle.opacity * 0.3
        ctx.fill()

        // Draw particle core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()

        ctx.globalAlpha = 1

        // Keep this particle for the next frame
        particlesToKeep.push(particle)
      }

      // Replace the particles array with only the ones we want to keep
      particlesRef.current = particlesToKeep

      // Draw connections between nearby particles
      ctx.strokeStyle = `rgba(81, 250, 170, 0.15)`
      ctx.lineWidth = 0.5

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.globalAlpha = (1 - distance / 100) * 0.2 * p1.opacity * p2.opacity
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      // Ensure we maintain a good number of particles
      while (particlesRef.current.length < 150) {
        // Increased from 120 to 150
        particlesRef.current.push(createParticle(canvas.width, canvas.height, timestamp))
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </motion.div>
  )
}

export default CursorFollowParticles
