"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Box, Typography, Container, Grid, Button } from "@mui/material"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
import FrostedCard from "../components/FrostedCard"
import ForceGraph from "../components/ForceGraph"
import SimulationControls from "../components/SimulationControls"
import StatisticsCards from "../components/StatisticsCards"
import { useSimulation } from "../context/SimulationContext"
import { colors } from "../theme/theme"

interface NetworkGraphPageProps {
  hasSimulation: boolean
  onReset?: () => void
}

const NetworkGraphPage: React.FC<NetworkGraphPageProps> = ({ hasSimulation, onReset }) => {
  const { timeSeriesData, network } = useSimulation()
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const forceGraphRef = useRef<React.ElementRef<typeof ForceGraph>>(null)

  // Calculate max steps based on time series data
  const maxSteps = timeSeriesData.length > 0 ? timeSeriesData.length - 1 : 0

  // Scroll to simulation section
  const scrollToSimulation = useCallback(() => {
    const homeTab = document.querySelector('[aria-label="Home"]') as HTMLElement
    if (homeTab) {
      homeTab.click()
    }

    setTimeout(() => {
      const element = document.getElementById("simulation-section")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }, [])

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Handle reset
  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  // Handle step forward
  const handleStepForward = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, maxSteps)
      if (next >= maxSteps) {
        setIsPlaying(false)
      }
      return next
    })
  }, [maxSteps])

  // Handle step back
  const handleStepBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  // Handle speed change
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed)
  }, [])

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    // Only run animation if playing is true and we have data
    if (!isPlaying || timeSeriesData.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    // Animation function
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }

      const deltaTime = timestamp - lastTimeRef.current
      const interval = 1000 / (speed * 2) // Adjust interval based on speed

      // Only update if enough time has passed
      if (deltaTime > interval) {
        // Step forward
        setCurrentStep((prev) => {
          const next = prev + 1
          // Stop animation if we reach the end
          if (next >= maxSteps) {
            setIsPlaying(false)
            return maxSteps
          }
          return next
        })

        // Update last time
        lastTimeRef.current = timestamp
      }

      // Continue animation if still playing
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup on unmount or when dependencies change
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isPlaying, speed, timeSeriesData.length, maxSteps])

  // Stop animation when reaching the end
  useEffect(() => {
    if (currentStep >= maxSteps && isPlaying) {
      setIsPlaying(false)
    }
  }, [currentStep, maxSteps, isPlaying])

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    if (forceGraphRef.current) {
      forceGraphRef.current.handleZoomIn?.()
    }
  }, [])

  const handleZoomOut = useCallback(() => {
    if (forceGraphRef.current) {
      forceGraphRef.current.handleZoomOut?.()
    }
  }, [])

  const handleZoomReset = useCallback(() => {
    if (forceGraphRef.current) {
      forceGraphRef.current.handleZoomReset?.()
    }
  }, [])

  // Show placeholder when no simulation data is available
  if (!hasSimulation) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, mt: "48px" }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FrostedCard sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              No Active Simulation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please configure a simulation to view the network graph visualization.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={scrollToSimulation}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  backgroundImage: "linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))",
                  color: "#0C0E1D",
                  fontWeight: "bold",
                }}
              >
                Configure Simulation
              </Button>
            </motion.div>
          </FrostedCard>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, mt: { xs: "40px", md: "48px" } }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            backgroundImage: "linear-gradient(90deg, #FF81FF, #51FAAA)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            mb: 4,
            fontSize: { xs: "1.75rem", md: "2.25rem" },
          }}
        >
          Disease Transmission Network
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3, height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5">Force-Directed Graph</Typography>
                <Button
                  variant="outlined"
                  onClick={onReset}
                  startIcon={<RefreshCw size={20} />}
                  sx={{
                    borderColor: colors.accent.primary,
                    color: colors.accent.primary,
                    "&:hover": {
                      borderColor: colors.accent.primary,
                      backgroundColor: "rgba(81, 250, 170, 0.1)",
                    },
                  }}
                >
                  Configure New Simulation
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  {[
                    { state: "Susceptible", color: colors.disease.susceptible },
                    { state: "Exposed", color: colors.disease.exposed },
                    { state: "Infectious", color: colors.disease.infectious },
                    { state: "Recovered", color: colors.disease.recovered },
                    { state: "Deceased", color: "#808080" },
                  ].map((item) => (
                    <Grid item key={item.state}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: item.color,
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.state}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box sx={{ height: { xs: "400px", md: "600px" }, width: "100%" }}>
                <ForceGraph
                  ref={forceGraphRef}
                  currentStep={currentStep}
                  isPlaying={isPlaying}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onZoomReset={handleZoomReset}
                />
              </Box>
            </FrostedCard>
          </Grid>

          <Grid item xs={12}>
            <SimulationControls
              isPlaying={isPlaying}
              speed={speed}
              currentStep={currentStep}
              maxSteps={maxSteps}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onSpeedChange={handleSpeedChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Current Statistics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Real-time disease spread metrics from the simulation.
              </Typography>

              <StatisticsCards />
            </FrostedCard>
          </Grid>

          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Network Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The force-directed graph shows how the disease spreads through the population.
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Nodes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Each circle represents an individual in the population. The color indicates their disease state: •
                  Blue: Susceptible individuals who can be infected • Pink: Exposed individuals in the incubation period
                  • Red: Infectious individuals actively spreading the disease • Green: Recovered individuals with
                  immunity • Gray: Deceased individuals
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Edges
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lines between nodes represent transmission events, showing the path of infection spread. Gray lines
                  indicate potential transmission paths, while red lines show active transmissions.
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Interaction
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Click and drag nodes to explore connections • Hover over nodes to see detailed information • Use
                  zoom controls to zoom in/out • Click and drag the background to pan • Use controls below to animate
                  the disease spread
                </Typography>
              </Box>
            </FrostedCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default NetworkGraphPage
