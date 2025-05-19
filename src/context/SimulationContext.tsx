"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from "react"
import { useNetworkGenerator, type Network } from "../hooks/useNetworkGenerator"
import { useDiseaseSimulation, type SimulationParameters, type SimulationState } from "../hooks/useDiseaseSimulation"

// Simulation parameters interface
export interface SimulationParams {
  population: number
  initialInfected: number
  r0: number
  incubationPeriod: number
  infectiousPeriod: number
  recoveryRate: number
  vaccinationRate?: number
  socialDistancing?: number
}

// Time series data interface
export interface TimeSeriesData {
  day: number
  susceptible: number
  exposed: number
  infectious: number
  recovered: number
  dead: number
}

// Context interface
interface SimulationContextType {
  simulationParams: SimulationParams
  updateParams: (params: Partial<SimulationParams>) => void
  network: Network | null
  timeSeriesData: TimeSeriesData[]
  currentDay: number
  running: boolean
  setRunning: (running: boolean) => void
  speed: number
  setSpeed: (speed: number) => void
  runSimulation: () => void
  resetSimulation: () => void
}

// Default parameters
const defaultParams: SimulationParams = {
  population: 200,
  initialInfected: 10,
  r0: 2.5,
  incubationPeriod: 5,
  infectiousPeriod: 14,
  recoveryRate: 0.97,
  vaccinationRate: 0,
  socialDistancing: 0,
}

// Create context
const SimulationContext = createContext<SimulationContextType | null>(null)

// Provider component
export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(defaultParams)
  const [network, setNetwork] = useState<Network | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [currentDay, setCurrentDay] = useState(0)
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(5)

  const animationRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)

  const { generateBarabasiAlbertNetwork } = useNetworkGenerator()
  const { initializeSimulation, simulateDay } = useDiseaseSimulation()

  // Update simulation parameters
  const updateParams = (params: Partial<SimulationParams>) => {
    setSimulationParams((prev) => ({ ...prev, ...params }))
  }

  // Initialize or reset simulation
  const initializeNetwork = useCallback(() => {
    try {
      console.log("Initializing network with params:", simulationParams)

      // Generate new network
      const newNetwork = generateBarabasiAlbertNetwork(
        simulationParams.population,
        5, // m0
        3, // m
        simulationParams.initialInfected,
      )
      setNetwork(newNetwork)

      // Initialize simulation state
      const initialState = initializeSimulation(newNetwork, simulationParams.vaccinationRate || 0)

      // Pre-compute simulation steps to ensure we have data for visualization
      const params: SimulationParameters = {
        reproductionNumber: simulationParams.r0,
        recoveryRate: simulationParams.recoveryRate,
        incubationPeriod: simulationParams.incubationPeriod,
        infectiousPeriod: simulationParams.infectiousPeriod,
        vaccinationRate: simulationParams.vaccinationRate || 0,
        socialDistancing: simulationParams.socialDistancing || 0,
      }

      // Pre-compute at least 30 days of simulation data
      let currentState = initialState
      const precomputedHistory = [initialState.stateHistory[0]]

      for (let i = 0; i < 30; i++) {
        currentState = simulateDay(currentState, params)
        precomputedHistory.push(currentState.stateHistory[currentState.stateHistory.length - 1])

        // Stop if the epidemic is over (no more exposed or infectious individuals)
        if (currentState.stats.exposed === 0 && currentState.stats.infectious === 0) {
          break
        }
      }

      console.log("Precomputed history:", precomputedHistory)

      // Update with the pre-computed data
      setTimeSeriesData(precomputedHistory)
      setCurrentDay(0)
      setRunning(false)
    } catch (error) {
      console.error("Error initializing network:", error)
    }
  }, [simulationParams, generateBarabasiAlbertNetwork, initializeSimulation, simulateDay])

  // Run simulation
  const runSimulation = useCallback(() => {
    if (!network) {
      initializeNetwork()
      return
    }
    setRunning(true)
  }, [network, initializeNetwork])

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setRunning(false)
    initializeNetwork()
  }, [initializeNetwork])

  // Animation effect
  useEffect(() => {
    if (!network || !running) return

    const animate = (timestamp: number) => {
      const interval = 1000 / speed

      if (timestamp - lastUpdateTimeRef.current >= interval) {
        const params: SimulationParameters = {
          reproductionNumber: simulationParams.r0,
          recoveryRate: simulationParams.recoveryRate,
          incubationPeriod: simulationParams.incubationPeriod,
          infectiousPeriod: simulationParams.infectiousPeriod,
          vaccinationRate: simulationParams.vaccinationRate || 0,
          socialDistancing: simulationParams.socialDistancing || 0,
        }

        const currentState: SimulationState = {
          network,
          currentDay,
          stats: timeSeriesData[timeSeriesData.length - 1],
          stateHistory: timeSeriesData,
        }

        const newState = simulateDay(currentState, params)

        setNetwork(newState.network)
        setTimeSeriesData(newState.stateHistory)
        setCurrentDay(newState.currentDay)

        lastUpdateTimeRef.current = timestamp

        if (newState.stats.exposed === 0 && newState.stats.infectious === 0) {
          setRunning(false)
          return
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [network, running, speed, currentDay, timeSeriesData, simulationParams, simulateDay])

  return (
    <SimulationContext.Provider
      value={{
        simulationParams,
        updateParams,
        network,
        timeSeriesData,
        currentDay,
        running,
        setRunning,
        speed,
        setSpeed,
        runSimulation,
        resetSimulation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  )
}

// Hook to use simulation context
export const useSimulation = () => {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider")
  }
  return context
}
