import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the disease states according to SEIR model
export enum DiseaseState {
  Susceptible = 'Susceptible',
  Exposed = 'Exposed',
  Infectious = 'Infectious',
  Recovered = 'Recovered'
}

// Define the agent type 
export interface Agent {
  id: number;
  state: DiseaseState;
  timeInState: number;
  connections: number[];
}

// Define the simulation parameters
export interface SimulationParams {
  population: number;
  initialInfected: number;
  r0: number; // Basic reproduction number
  incubationPeriod: number; // Days before becoming infectious
  infectiousPeriod: number; // Days being infectious before recovery
  recoveryRate: number; // Percentage that recover
  contactRate: number; // Average contacts per day
  // Advanced parameters
  vaccinationRate?: number;
  maskUsage?: number;
  socialDistancing?: number;
}

// Simulation timeseries data
export interface TimeSeriesData {
  day: number;
  susceptible: number;
  exposed: number;
  infectious: number;
  recovered: number;
  dead: number;
  cumulative: number;
}

// Define the context type
interface SimulationContextType {
  simulationParams: SimulationParams;
  timeSeriesData: TimeSeriesData[];
  agents: Agent[];
  transmissionEvents: [number, number][]; // [source, target]
  updateParams: (params: Partial<SimulationParams>) => void;
  runSimulation: () => void;
  resetSimulation: () => void;
  currentDay: number;
  isRunning: boolean;
  isComplete: boolean;
}

// Default parameters for the simulation
const defaultParams: SimulationParams = {
  population: 1000,
  initialInfected: 5,
  r0: 2.5,
  incubationPeriod: 5,
  infectiousPeriod: 10,
  recoveryRate: 0.97,
  contactRate: 10,
  vaccinationRate: 0,
  maskUsage: 0,
  socialDistancing: 0
};

// Create the context with initial default values
export const SimulationContext = createContext<SimulationContextType>({
  simulationParams: defaultParams,
  timeSeriesData: [],
  agents: [],
  transmissionEvents: [],
  updateParams: () => {},
  runSimulation: () => {},
  resetSimulation: () => {},
  currentDay: 0,
  isRunning: false,
  isComplete: false
});

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(defaultParams);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [transmissionEvents, setTransmissionEvents] = useState<[number, number][]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Update simulation parameters
  const updateParams = (params: Partial<SimulationParams>) => {
    setSimulationParams(prev => ({ ...prev, ...params }));
  };

  // Reset simulation to initial state
  const resetSimulation = () => {
    setTimeSeriesData([]);
    setAgents([]);
    setTransmissionEvents([]);
    setCurrentDay(0);
    setIsRunning(false);
    setIsComplete(false);
  };

  // Generate a network of agents - simplified for demonstration
  const generateAgentNetwork = (params: SimulationParams): Agent[] => {
    const agents: Agent[] = [];
    
    // Create all agents first
    for (let i = 0; i < params.population; i++) {
      agents.push({
        id: i,
        state: i < params.initialInfected ? DiseaseState.Infectious : DiseaseState.Susceptible,
        timeInState: 0,
        connections: []
      });
    }
    
    // Create connections (simplified network)
    for (let i = 0; i < params.population; i++) {
      const numContacts = Math.floor(Math.random() * params.contactRate) + 1;
      for (let j = 0; j < numContacts; j++) {
        // Generate a random connection (avoid self-loops)
        let target;
        do {
          target = Math.floor(Math.random() * params.population);
        } while (target === i || agents[i].connections.includes(target));
        
        // Add bidirectional connections
        agents[i].connections.push(target);
        agents[target].connections.push(i);
      }
    }
    
    return agents;
  };

  // Run a single step of the simulation
  const simulateDay = (currentAgents: Agent[], day: number): { 
    updatedAgents: Agent[], 
    newTransmissions: [number, number][],
    daySummary: TimeSeriesData
  } => {
    const updatedAgents = [...currentAgents];
    const newTransmissions: [number, number][] = [];
    
    // Count initial state
    let susceptible = 0;
    let exposed = 0;
    let infectious = 0;
    let recovered = 0;
    
    currentAgents.forEach(agent => {
      switch(agent.state) {
        case DiseaseState.Susceptible: susceptible++; break;
        case DiseaseState.Exposed: exposed++; break;
        case DiseaseState.Infectious: infectious++; break;
        case DiseaseState.Recovered: recovered++; break;
      }
    });
    
    // Process each agent
    for (let i = 0; i < updatedAgents.length; i++) {
      const agent = updatedAgents[i];
      
      // Increment time in current state
      agent.timeInState++;
      
      switch(agent.state) {
        case DiseaseState.Susceptible:
          // Check if infected by connections
          for (const contactId of agent.connections) {
            const contact = currentAgents[contactId];
            if (contact.state === DiseaseState.Infectious) {
              // Probability of infection based on R0 and contact parameters
              if (Math.random() < simulationParams.r0 / simulationParams.contactRate / simulationParams.infectiousPeriod) {
                agent.state = DiseaseState.Exposed;
                agent.timeInState = 0;
                newTransmissions.push([contactId, i]);
                break;
              }
            }
          }
          break;
          
        case DiseaseState.Exposed:
          // Check if incubation period is over
          if (agent.timeInState >= simulationParams.incubationPeriod) {
            agent.state = DiseaseState.Infectious;
            agent.timeInState = 0;
          }
          break;
          
        case DiseaseState.Infectious:
          // Check if infectious period is over
          if (agent.timeInState >= simulationParams.infectiousPeriod) {
            // Determine if agent recovers or dies
            if (Math.random() < simulationParams.recoveryRate) {
              agent.state = DiseaseState.Recovered;
            } else {
              // Remove agent from network (simulating death)
              // For simplicity, we'll just mark them as recovered but could handle differently
              agent.state = DiseaseState.Recovered;
              // Remove all connections to this agent
              agent.connections = [];
            }
            agent.timeInState = 0;
          }
          break;
          
        case DiseaseState.Recovered:
          // Recovered agents stay recovered (no reinfection in this simple model)
          break;
      }
    }
    
    // Recount after updates
    susceptible = 0;
    exposed = 0;
    infectious = 0;
    recovered = 0;
    updatedAgents.forEach(agent => {
      switch(agent.state) {
        case DiseaseState.Susceptible: susceptible++; break;
        case DiseaseState.Exposed: exposed++; break;
        case DiseaseState.Infectious: infectious++; break;
        case DiseaseState.Recovered: recovered++; break;
      }
    });
    
    // Calculate dead (simplified)
    const previousTotal = day > 0 ? timeSeriesData[day-1].cumulative : 0;
    const currentCumulative = exposed + infectious + recovered;
    const dead = Math.floor((currentCumulative - previousTotal) * (1 - simulationParams.recoveryRate));
    
    const daySummary: TimeSeriesData = {
      day,
      susceptible,
      exposed,
      infectious,
      recovered,
      dead,
      cumulative: currentCumulative
    };
    
    return { updatedAgents, newTransmissions, daySummary };
  };

  // Run the full simulation
  const runSimulation = () => {
    setIsRunning(true);
    setIsComplete(false);
    
    // Generate initial agent network
    const initialAgents = generateAgentNetwork(simulationParams);
    setAgents(initialAgents);
    
    // Initial count
    let susceptible = 0;
    let exposed = 0;
    let infectious = 0;
    let recovered = 0;
    
    initialAgents.forEach(agent => {
      switch(agent.state) {
        case DiseaseState.Susceptible: susceptible++; break;
        case DiseaseState.Exposed: exposed++; break;
        case DiseaseState.Infectious: infectious++; break;
        case DiseaseState.Recovered: recovered++; break;
      }
    });
    
    // Set initial day data
    setTimeSeriesData([{
      day: 0,
      susceptible,
      exposed,
      infectious,
      recovered,
      dead: 0,
      cumulative: exposed + infectious + recovered
    }]);
    
    // Start the simulation loop
    let currentAgents = [...initialAgents];
    let allTransmissions: [number, number][] = [];
    let day = 0;
    
    // For demo purposes, we'll run a fixed number of days
    const simulateAsync = () => {
      const MAX_DAYS = 90; // Run for 90 days max
      
      // Simulate the next day
      const { updatedAgents, newTransmissions, daySummary } = simulateDay(currentAgents, day + 1);
      currentAgents = updatedAgents;
      allTransmissions = [...allTransmissions, ...newTransmissions];
      
      // Update state
      setAgents(updatedAgents);
      setTransmissionEvents(allTransmissions);
      setTimeSeriesData(prev => [...prev, daySummary]);
      setCurrentDay(day + 1);
      
      day++;
      
      // Continue simulation if pandemic still active and we're under max days
      if (day < MAX_DAYS && daySummary.infectious > 0) {
        setTimeout(simulateAsync, 200); // Control simulation speed
      } else {
        setIsRunning(false);
        setIsComplete(true);
      }
    };
    
    // Start the simulation loop
    setTimeout(simulateAsync, 500);
  };

  return (
    <SimulationContext.Provider
      value={{
        simulationParams,
        timeSeriesData,
        agents,
        transmissionEvents,
        updateParams,
        runSimulation,
        resetSimulation,
        currentDay,
        isRunning,
        isComplete
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

// Custom hook for easy context usage
export const useSimulation = () => useContext(SimulationContext);