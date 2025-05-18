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
  const animationRef = useRef<number>()
  const maxSteps = useRef(0)

  // Calculate max steps when simulation data changes
  useEffect(() => {
    if (timeSeriesData.length > 0) {
      // Find the step where all nodes are either recovered or dead
      for (let i = 0; i < timeSeriesData.length; i++) {
        const data = timeSeriesData[i]
        if (data.infectious === 0 && data.exposed === 0) {
          maxSteps.current = i
          break
        }
      }
      // If we never found a point where all nodes recovered/died, use the last step
      if (maxSteps.current === 0) {
        maxSteps.current = timeSeriesData.length - 1
      }
    }
  }, [timeSeriesData])

  const scrollToSimulation = () => {
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
  }

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handleStepForward = useCallback(() => {
    setCurrentStep((prev) => {
      const nextStep = prev + 1
      if (nextStep >= maxSteps.current) {
        setIsPlaying(false)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        return maxSteps.current
      }
      return nextStep
    })
  }, [])

  const handleStepBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  // Animation loop using requestAnimationFrame
  useEffect(() => {
    let lastTime = 0
    const interval = 1000 / (speed * 2) // Adjusted for smoother animation

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const delta = timestamp - lastTime

      if (delta > interval) {
        handleStepForward()
        lastTime = timestamp
      }

      if (isPlaying && currentStep < maxSteps.current) {
        animationRef.current = requestAnimationFrame(animate)
      } else if (currentStep >= maxSteps.current) {
        setIsPlaying(false)
      }
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, speed, handleStepForward, currentStep])

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
                <ForceGraph currentStep={currentStep} isPlaying={isPlaying} />
              </Box>
            </FrostedCard>
          </Grid>

          <Grid item xs={12}>
            <SimulationControls
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onSpeedChange={setSpeed}
              currentStep={currentStep}
              maxSteps={maxSteps.current}
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
                  mouse wheel or buttons to zoom in/out • Click and drag the background to pan • Use controls below to
                  animate the disease spread
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
