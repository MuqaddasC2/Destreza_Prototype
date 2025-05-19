"use client"

import type React from "react"
import { Box, Slider, Button, Typography, Stack, Paper } from "@mui/material"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import FrostedCard from "./FrostedCard"
import { colors } from "../theme/theme"

interface SimulationControlsProps {
  isPlaying: boolean
  speed: number
  currentStep: number
  maxSteps: number
  onPlayPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBack: () => void
  onSpeedChange: (value: number) => void
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isPlaying,
  speed,
  currentStep,
  maxSteps,
  onPlayPause,
  onReset,
  onStepForward,
  onStepBack,
  onSpeedChange,
}) => {
  const marks = [
    { value: 0.5, label: "Slow" },
    { value: 1, label: "Normal" },
    { value: 2, label: "Fast" },
  ]

  // Calculate progress percentage
  const progressPercentage = maxSteps > 0 ? (currentStep / maxSteps) * 100 : 0

  return (
    <FrostedCard sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Simulation Controls
      </Typography>

      {/* Animation Controls */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: "rgba(12, 14, 29, 0.4)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ color: colors.accent.primary }}>
          Animation Controls
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={onReset}
            startIcon={<RotateCcw size={18} />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "white",
              "&:hover": {
                borderColor: colors.accent.primary,
                backgroundColor: "rgba(81, 250, 170, 0.1)",
              },
            }}
          >
            Reset
          </Button>
          <Button
            onClick={onStepBack}
            variant="outlined"
            disabled={currentStep <= 0}
            startIcon={<SkipBack size={18} />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "white",
              "&:hover": {
                borderColor: colors.accent.primary,
                backgroundColor: "rgba(81, 250, 170, 0.1)",
              },
              "&.Mui-disabled": {
                borderColor: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.3)",
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
            disabled={maxSteps <= 0 || currentStep >= maxSteps}
            startIcon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
            sx={{
              backgroundImage: "linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))",
              color: "#0C0E1D",
              fontWeight: "bold",
              px: 3,
              "&:hover": {
                boxShadow: "0 0 20px rgba(81, 250, 170, 0.5)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(81, 250, 170, 0.3)",
                color: "rgba(12, 14, 29, 0.5)",
              },
            }}
          >
            {isPlaying ? "Pause" : "Animate"}
          </Button>
          <Button
            onClick={onStepForward}
            variant="outlined"
            disabled={currentStep >= maxSteps}
            startIcon={<SkipForward size={18} />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "white",
              "&:hover": {
                borderColor: colors.accent.primary,
                backgroundColor: "rgba(81, 250, 170, 0.1)",
              },
              "&.Mui-disabled": {
                borderColor: "rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            Forward
          </Button>
        </Stack>

        {/* Progress Bar */}
        <Box sx={{ px: 1, mb: 2 }}>
          <Box
            sx={{
              height: "6px",
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${progressPercentage}%`,
                backgroundImage: "linear-gradient(to right, #51FAAA, #FF81FF)",
                borderRadius: "3px",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Day {currentStep}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total: {maxSteps} days
            </Typography>
          </Box>
        </Box>

        {/* Speed Control */}
        <Box sx={{ px: 1 }}>
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
      </Paper>
    </FrostedCard>
  )
}

export default SimulationControls
