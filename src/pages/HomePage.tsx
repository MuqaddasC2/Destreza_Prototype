"use client"

import type React from "react"
import { Box, Typography, Container, Grid, Button, Link } from "@mui/material"
import { motion } from "framer-motion"
import FrostedCard from "../components/FrostedCard"
import SimulationForm from "../components/SimulationForm"
import SimulationStatus from "../components/SimulationStatus"
import HeroBackground from "../components/HeroBackground"
import { colors } from "../theme/theme"
import CursorFollowParticles from "../components/CursorFollowParticles"

interface HomePageProps {
  onStartSimulation: () => void
  simulationStatus: {
    started: boolean
    completed: boolean
  }
  onSimulationComplete: (action: "graph" | "stats") => void
  onReset?: () => void
}

const HomePage: React.FC<HomePageProps> = ({ onStartSimulation, simulationStatus, onSimulationComplete, onReset }) => {
  const scrollToSimulation = () => {
    const element = document.getElementById("simulation-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", pt: "48px" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "calc(100vh - 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: { xs: "60px", md: "0" },
          paddingBottom: { xs: "60px", md: "0" },
        }}
      >
        <HeroBackground />
        <CursorFollowParticles />

        <Container maxWidth="lg">
          <FrostedCard
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 1,
              background: colors.card.background,
              p: 3,
              maxWidth: "500px",
              mx: "auto",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 700,
                mt: 2,
                mb: 2,
                background: "linear-gradient(90deg, #FF81FF, #51FAAA)",
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Destreza
            </Typography>

            <Typography
              variant="h4"
              sx={{
                color: "text.secondary",
                maxWidth: "500px",
                mx: "auto",
                mb: 3,
                fontSize: { xs: "0.9rem", md: "1rem" },
              }}
            >
              Advanced disease transmission simulator with real-time visualization and analysis
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={scrollToSimulation}
              component={motion.button}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(81, 250, 170, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                backgroundImage: "linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))",
                color: "#0C0E1D",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Configure Simulation
            </Button>
          </FrostedCard>
        </Container>

        {/* Bottom Glowing Bar */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 20px rgba(81, 250, 170, 0.3)",
              "0 0 40px rgba(81, 250, 170, 0.6)",
              "0 0 20px rgba(81, 250, 170, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #51FAAA, transparent)",
            zIndex: 2,
          }}
        />
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" id="simulation-section">
        <Box sx={{ py: 8 }}>
          {!simulationStatus.started && <SimulationForm onStart={onStartSimulation} />}

          <SimulationStatus
            isRunning={simulationStatus.started && !simulationStatus.completed}
            onComplete={onSimulationComplete}
            onReset={onReset}
          />

          <FrostedCard
            id="about-section"
            sx={{
              p: { xs: 3, md: 5 },
              mb: 6,
            }}
          >
            <Typography variant="h4" mb={3} fontWeight="bold">
              About the Simulator
            </Typography>

            <Typography variant="body1" mb={4} color="text.secondary" lineHeight={1.7}>
              Destreza is a sophisticated disease transmission simulator that combines advanced network modeling with
              real-time visualization. Using the Barabási-Albert algorithm, it generates realistic social networks that
              capture the complexity of human interactions, including super-spreader events. The simulation employs a
              force-directed graph visualization and implements the SEIRD (Susceptible, Exposed, Infectious, Recovered,
              Deceased) model to accurately simulate disease spread patterns similar to COVID-19, with configurable
              parameters for different virus variants and intervention strategies.
            </Typography>

            <Box>
              <Typography variant="h6" mb={2} color={colors.accent.primary}>
                Key Features
              </Typography>
              <Grid container spacing={3}>
                {[
                  "Scale-free network generation using Barabási-Albert model",
                  "Real-time force-directed graph visualization",
                  "SEIRD compartmental modeling with configurable parameters",
                  "Interactive parameter adjustment with immediate feedback",
                  "Comprehensive statistical analysis and visualization",
                  "Social distancing and vaccination intervention modeling",
                  "Super-spreader identification and tracking",
                  "Detailed epidemic curve analysis",
                  "Population state distribution monitoring",
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(81, 250, 170, 0.1)",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          flexShrink: 0,
                          borderRadius: "50%",
                          bgcolor: colors.accent.primary,
                          mr: 2,
                          boxShadow: `0 0 8px ${colors.accent.primary}`,
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": {
                              boxShadow: `0 0 0 0 ${colors.accent.primary}40`,
                            },
                            "70%": {
                              boxShadow: `0 0 0 6px ${colors.accent.primary}00`,
                            },
                            "100%": {
                              boxShadow: `0 0 0 0 ${colors.accent.primary}00`,
                            },
                          },
                        }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" mb={2} color={colors.accent.primary}>
                Sources
              </Typography>
              <Box component="ul" sx={{ pl: 3 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link href="https://covid19.who.int/" target="_blank" rel="noopener noreferrer" color="inherit">
                    WHO COVID-19 Dashboard
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link
                    href="https://www.cdc.gov/covid/hcp/clinical-care/covid19-presentation.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                  >
                    Clinical Presentation | COVID-19 - CDC
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link
                    href="https://www.nature.com/articles/s41598-021-95785-y"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                  >
                    Nature: Transmission dynamics of COVID-19 in different settings
                  </Link>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Link
                    href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9950018/"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                  >
                    European Journal of Medical Research: COVID-19 variants analysis
                  </Link>
                </Box>
              </Box>
            </Box>
          </FrostedCard>
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
