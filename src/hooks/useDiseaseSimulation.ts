import { useCallback } from 'react';
import _ from 'lodash';
import { Node, Network, NodeState } from './useNetworkGenerator';

export interface SimulationParameters {
  reproductionNumber: number;
  recoveryRate: number;
  incubationPeriod: number;
  infectiousPeriod: number;
  vaccinationRate: number;
  socialDistancing: number;
}

export interface SimulationState {
  network: Network;
  currentDay: number;
  stats: {
    susceptible: number;
    exposed: number;
    infectious: number;
    recovered: number;
    dead: number;
  };
  stateHistory: Array<{
    day: number;
    susceptible: number;
    exposed: number;
    infectious: number;
    recovered: number;
    dead: number;
  }>;
}

export const useDiseaseSimulation = () => {
  // Initialize a simulation with given parameters
  const initializeSimulation = useCallback((
    network: Network,
    vaccinationRate: number
  ): SimulationState => {
    const { nodes } = network;
    
    // Apply vaccination to random subset of susceptible population
    if (vaccinationRate > 0) {
      const susceptibleNodes = nodes.filter(node => node.state === 'susceptible');
      const vaccinationCount = Math.floor(susceptibleNodes.length * vaccinationRate);
      
      const toVaccinate = _.sampleSize(susceptibleNodes, vaccinationCount);
      toVaccinate.forEach(node => {
        const nodeIndex = nodes.findIndex(n => n.id === node.id);
        if (nodeIndex !== -1) {
          nodes[nodeIndex].state = 'recovered'; // Vaccinated individuals start in recovered state
        }
      });
    }
    
    // Calculate initial statistics
    const stats = calculateStats(nodes);
    
    return {
      network: { nodes, edges: network.edges },
      currentDay: 0,
      stats,
      stateHistory: [{ day: 0, ...stats }]
    };
  }, []);
  
  // Process a single day of the simulation
  const simulateDay = useCallback((
    state: SimulationState,
    params: SimulationParameters
  ): SimulationState => {
    const { 
      reproductionNumber, 
      recoveryRate, 
      incubationPeriod, 
      infectiousPeriod, 
      socialDistancing 
    } = params;
    
    const { nodes, edges } = state.network;
    const newDay = state.currentDay + 1;
    
    // Create a copy of the nodes to track transitions in this step
    const updatedNodes = _.cloneDeep(nodes);
    
    // Hash table for quick node lookups by ID
    const nodeMap = new Map<number, Node>();
    updatedNodes.forEach(node => nodeMap.set(node.id, node));
    
    // Process state transitions - we make a single pass through all nodes
    // for maximum efficiency
    for (let i = 0; i < updatedNodes.length; i++) {
      const node = updatedNodes[i];
      
      switch (node.state) {
        case 'exposed':
          // Check if incubation period is complete
          if (newDay - (node.exposureTime || 0) >= incubationPeriod) {
            node.state = 'infectious';
            node.infectionTime = newDay;
          }
          break;
          
        case 'infectious':
          // Check if infectious period is complete
          if (newDay - (node.infectionTime || 0) >= infectiousPeriod) {
            // Determine if recovered or dead
            if (Math.random() < recoveryRate) {
              node.state = 'recovered';
              node.recoveryTime = newDay;
            } else {
              node.state = 'dead';
            }
          }
          break;
          
        case 'recovered':
          // No state transition for recovered individuals in this model
          break;
          
        case 'dead':
          // No state transition for dead individuals
          break;
      }
    }
    
    // Process infections by examining all edges with infectious nodes
    const transmissionProbabilityBase = reproductionNumber / infectiousPeriod;
    
    // Create an adjacency list for more efficient contact tracing
    const adjacencyList = new Map<number, number[]>();
    updatedNodes.forEach(node => {
      adjacencyList.set(node.id, node.connections);
    });
    
    // Process potential infections in batch
    updatedNodes.forEach(node => {
      if (node.state === 'infectious') {
        const connections = adjacencyList.get(node.id) || [];
        
        connections.forEach(contactId => {
          const contactNode = nodeMap.get(contactId);
          
          if (contactNode && contactNode.state === 'susceptible') {
            // Apply social distancing factor
            const contactProbability = 1 - socialDistancing;
            
            // Only proceed if contact actually happens (social distancing check)
            if (Math.random() < contactProbability) {
              // Determine if transmission occurs
              if (Math.random() < transmissionProbabilityBase) {
                contactNode.state = 'exposed';
                contactNode.exposureTime = newDay;
              }
            }
          }
        });
      }
    });
    
    // Calculate statistics for the current day
    const stats = calculateStats(updatedNodes);
    
    // Update history
    const stateHistory = [
      ...state.stateHistory,
      { day: newDay, ...stats }
    ];
    
    return {
      network: { nodes: updatedNodes, edges },
      currentDay: newDay,
      stats,
      stateHistory
    };
  }, []);
  
  // Helper function to calculate statistics
  const calculateStats = useCallback((nodes: Node[]) => {
    return nodes.reduce((acc, node) => {
      acc[node.state]++;
      return acc;
    }, {
      susceptible: 0,
      exposed: 0,
      infectious: 0,
      recovered: 0,
      dead: 0
    });
  }, []);
  
  // Run a full simulation for a given number of days
  const runSimulation = useCallback((
    initialState: SimulationState,
    params: SimulationParameters,
    days: number
  ): SimulationState => {
    let currentState = initialState;
    
    // Run the simulation for the specified number of days
    for (let day = 0; day < days; day++) {
      currentState = simulateDay(currentState, params);
      
      // Early termination if pandemic is over
      if (currentState.stats.exposed === 0 && currentState.stats.infectious === 0) {
        break;
      }
    }
    
    return currentState;
  }, [simulateDay]);
  
  return {
    initializeSimulation,
    simulateDay,
    runSimulation
  };
};