"use client"

import type React from "react"
import { Box, Slider, Button, Typography } from "@mui/material"
import { Play, Pause, StepBack, StepForward, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import FrostedCard from "./FrostedCard"
import { colors } from "../theme/theme"

interface SimulationControlsProps {
  isPlaying: boolean
  speed: number
  onPlayPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBack: () => void
  onSpeedChange: (value: number) => void
  currentStep: number
  maxSteps: number
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  speed,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBack,
  onSpeedChange,
  currentStep,
  maxSteps,
}) => {
  const marks = [
    { value: 0.5, label: "Slow" },
    { value: 1, label: "Normal" },
    { value: 2, label: "Fast" },
  ]

  return (
    <FrostedCard sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Simulation Controls
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, justifyContent: "center" }}>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<RotateCcw size={20} />}
          sx={{
            color: "#fff",
            borderColor: "#fff",
            "&:hover": {
              borderColor: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          Reset
        </Button>

        <Button
          onClick={onStepBack}
          variant="outlined"
          disabled={currentStep === 0}
          startIcon={<StepBack size={20} />}
          sx={{
            borderColor: colors.accent.primary,
            color: colors.accent.primary,
            "&:hover": {
              borderColor: colors.accent.primary,
              backgroundColor: "rgba(81, 250, 170, 0.1)",
            },
          }}
        >
          Back
        </Button>

        <Button
          onClick={onPlayPause}
          variant="contained"
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={currentStep >= maxSteps}
          startIcon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
          sx={{
            backgroundImage: "linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))",
            color: "#0C0E1D",
            fontWeight: "bold",
            px: 4,
            "&:hover": {
              boxShadow: "0 0 20px rgba(81, 250, 170, 0.5)",
            },
          }}
        >
          {isPlaying ? "Pause" : "Animate"}
        </Button>

        <Button
          onClick={onStepForward}
          variant="outlined"
          disabled={currentStep >= maxSteps}
          startIcon={<StepForward size={20} />}
          sx={{
            borderColor: colors.accent.primary,
            color: colors.accent.primary,
            "&:hover": {
              borderColor: colors.accent.primary,
              backgroundColor: "rgba(81, 250, 170, 0.1)",
            },
          }}
        >
          Forward
        </Button>
      </Box>

      <Box sx={{ px: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Animation Speed
        </Typography>
        <Slider
          value={speed}
          min={0.5}
          max={2}
          step={0.1}
          marks={marks}
          onChange={(_, value) => onSpeedChange(value as number)}
          sx={{
            "& .MuiSlider-rail": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
            "& .MuiSlider-track": {
              backgroundImage: "linear-gradient(to right, #51FAAA, #FF81FF)",
            },
            "& .MuiSlider-thumb": {
              backgroundColor: "#51FAAA",
              boxShadow: "0 0 8px #51FAAA",
            },
            "& .MuiSlider-mark": {
              backgroundColor: "#616083",
            },
            "& .MuiSlider-markLabel": {
              color: "#616083",
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 2, px: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Progress: Day {currentStep} of {maxSteps}
        </Typography>
        <Slider
          value={currentStep}
          min={0}
          max={maxSteps}
          step={1}
          onChange={(_, value) => {
            const newStep = value as number
            if (newStep > currentStep) {
              for (let i = currentStep; i < newStep; i++) {
                onStepForward()
              }
            } else if (newStep < currentStep) {
              for (let i = currentStep; i > newStep; i--) {
                onStepBack()
              }
            }
          }}
          sx={{
            "& .MuiSlider-rail": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
            "& .MuiSlider-track": {
              backgroundImage: "linear-gradient(to right, #51FAAA, #FF81FF)",
            },
            "& .MuiSlider-thumb": {
              backgroundColor: "#51FAAA",
              boxShadow: "0 0 8px #51FAAA",
            },
          }}
        />
      </Box>
    </FrostedCard>
  )
}

export default SimulationControls
