"use client"

import { useCallback } from "react"
import _ from "lodash"

// Define node types for our disease model
export type NodeState = "susceptible" | "exposed" | "infectious" | "recovered" | "dead"

export interface Node {
  id: number
  state: NodeState
  connections: number[]
  exposureTime?: number
  infectionTime?: number
  recoveryTime?: number
  position?: { x: number; y: number; z: number }
  fixed?: boolean
}

export interface Network {
  nodes: Node[]
  edges: [number, number][]
}

// Generate a scale-free network using Barabási-Albert model
export const useNetworkGenerator = () => {
  const generateBarabasiAlbertNetwork = useCallback(
    (
      populationSize: number,
      m0 = 5, // Initial connected network size
      m = 3, // Number of edges to attach from a new node to existing nodes
      initialInfected = 5,
    ): Network => {
      // Parameter validation
      if (populationSize < m0) {
        throw new Error(`Population size (${populationSize}) must be greater than initial network size (${m0})`)
      }

      if (initialInfected > populationSize) {
        throw new Error(`Initial infected (${initialInfected}) cannot exceed population size (${populationSize})`)
      }

      // Create initial complete network of m0 nodes
      const nodes: Node[] = Array(m0)
        .fill(null)
        .map((_, i) => ({
          id: i,
          state: "susceptible",
          connections: [],
          position: {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            z: Math.random() * 100 - 50,
          },
        }))

      // Connect all initial nodes to each other (complete graph)
      for (let i = 0; i < m0; i++) {
        for (let j = i + 1; j < m0; j++) {
          nodes[i].connections.push(j)
          nodes[j].connections.push(i)
        }
      }

      // Track all edges for easy access
      const edges: [number, number][] = []
      for (let i = 0; i < m0; i++) {
        for (let j = i + 1; j < m0; j++) {
          edges.push([i, j])
        }
      }

      // Add remaining nodes using preferential attachment
      for (let i = m0; i < populationSize; i++) {
        // Create new node
        const newNode: Node = {
          id: i,
          state: "susceptible",
          connections: [],
          position: {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            z: Math.random() * 100 - 50,
          },
        }
        nodes.push(newNode)

        // Create edge probabilities based on node degrees (preferential attachment)
        const connectionCounts = nodes.map((node) => node.connections.length)
        const totalConnections = _.sum(connectionCounts)

        // Select m unique nodes using roulette wheel selection
        const selectedIndices = new Set<number>()

        while (selectedIndices.size < m && selectedIndices.size < i) {
          // Generate cumulative probabilities
          let cumulativeProbability = 0
          const probabilities: number[] = []

          for (let j = 0; j < i; j++) {
            const probability = connectionCounts[j] / totalConnections
            cumulativeProbability += probability
            probabilities.push(cumulativeProbability)
          }

          // Select based on roulette wheel
          const random = Math.random()
          for (let j = 0; j < i; j++) {
            if (random <= probabilities[j] && !selectedIndices.has(j)) {
              selectedIndices.add(j)
              break
            }
          }

          // Fallback if probability selection fails
          if (selectedIndices.size < m && selectedIndices.size < i) {
            // Add random nodes if we're struggling to add enough
            const availableNodes = _.range(0, i).filter((idx) => !selectedIndices.has(idx))
            if (availableNodes.length > 0) {
              const randomIdx = Math.floor(Math.random() * availableNodes.length)
              selectedIndices.add(availableNodes[randomIdx])
            }
          }
        }

        // Connect the new node to selected nodes
        selectedIndices.forEach((targetIdx) => {
          newNode.connections.push(targetIdx)
          nodes[targetIdx].connections.push(i)
          edges.push([i, targetIdx])
        })
      }

      // Set initial infected
      const infectedIndices = _.sampleSize(_.range(populationSize), initialInfected)
      infectedIndices.forEach((idx) => {
        nodes[idx].state = "infectious"
        nodes[idx].infectionTime = 0
      })

      return { nodes, edges }
    },
    [],
  )

  return { generateBarabasiAlbertNetwork }
}
