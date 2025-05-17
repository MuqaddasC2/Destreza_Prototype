import React, { createContext, useContext, useState, ReactNode } from 'react';

// Disease states enum
export enum DiseaseState {
  Susceptible = 'Susceptible',
  Exposed = 'Exposed',
  Infectious = 'Infectious',
  Recovered = 'Recovered'
}

// Agent interface
export interface Agent {
  id: number;
  state: DiseaseState;
  exposureTime?: number;
  infectionTime?: number;
}

// Simulation parameters interface
export interface SimulationParams {
  population: number;
  initialInfected: number;
  r0: number;
  incubationPeriod: number;
  infectiousPeriod: number;
  recoveryRate: number;
  vaccinationRate?: number;
  socialDistancing?: number;
}

// Time series data interface
export interface TimeSeriesData {
  day: number;
  susceptible: number;
  exposed: number;
  infectious: number;
  recovered: number;
  dead: number;
}

// Context interface
interface SimulationContextType {
  simulationParams: SimulationParams;
  updateParams: (params: Partial<SimulationParams>) => void;
  agents: Agent[];
  timeSeriesData: TimeSeriesData[];
  transmissionEvents: [number, number][];
  currentDay: number;
  runSimulation: () => void;
}

// Default parameters
const defaultParams: SimulationParams = {
  population: 1000,
  initialInfected: 5,
  r0: 2.5,
  incubationPeriod: 5,
  infectiousPeriod: 14,
  recoveryRate: 0.97,
  vaccinationRate: 0,
  socialDistancing: 0
};

// Create context
const SimulationContext = createContext<SimulationContextType | null>(null);

// Provider component
export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(defaultParams);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [transmissionEvents, setTransmissionEvents] = useState<[number, number][]>([]);
  const [currentDay, setCurrentDay] = useState(0);

  // Update simulation parameters
  const updateParams = (params: Partial<SimulationParams>) => {
    setSimulationParams(prev => ({ ...prev, ...params }));
  };

  // Initialize agents
  const initializeAgents = () => {
    const newAgents: Agent[] = Array(simulationParams.population).fill(null).map((_, i) => ({
      id: i,
      state: i < simulationParams.initialInfected ? DiseaseState.Infectious : DiseaseState.Susceptible,
      infectionTime: i < simulationParams.initialInfected ? 0 : undefined
    }));
    setAgents(newAgents);
  };

  // Generate random connections using Barabási-Albert model
  const generateConnections = () => {
    const events: [number, number][] = [];
    const m = 3; // Number of connections for each new node
    const initialNodes = simulationParams.initialInfected;

    // Create initial complete graph
    for (let i = 0; i < initialNodes; i++) {
      for (let j = i + 1; j < initialNodes; j++) {
        events.push([i, j]);
      }
    }

    // Add remaining nodes with preferential attachment
    for (let i = initialNodes; i < simulationParams.population; i++) {
      const connections = new Set<number>();
      while (connections.size < m) {
        const target = Math.floor(Math.random() * i);
        if (!connections.has(target)) {
          connections.add(target);
          events.push([i, target]);
        }
      }
    }

    setTransmissionEvents(events);
  };

  // Run SEIR simulation
  const runSimulation = () => {
    initializeAgents();
    generateConnections();

    // Initialize time series data
    const initialData: TimeSeriesData = {
      day: 0,
      susceptible: simulationParams.population - simulationParams.initialInfected,
      exposed: 0,
      infectious: simulationParams.initialInfected,
      recovered: 0,
      dead: 0
    };
    setTimeSeriesData([initialData]);

    // Simulate for 100 days
    const simulationDays = 100;
    const newTimeSeriesData: TimeSeriesData[] = [initialData];
    const newAgents = [...agents];

    for (let day = 1; day <= simulationDays; day++) {
      // Process infections
      const transmissionProb = simulationParams.r0 / (simulationParams.infectiousPeriod * 10);
      
      transmissionEvents.forEach(([source, target]) => {
        const sourceAgent = newAgents[source];
        const targetAgent = newAgents[target];

        if (sourceAgent.state === DiseaseState.Infectious && 
            targetAgent.state === DiseaseState.Susceptible &&
            Math.random() < transmissionProb * (1 - (simulationParams.socialDistancing || 0))) {
          targetAgent.state = DiseaseState.Exposed;
          targetAgent.exposureTime = day;
        }
      });

      // Update states
      newAgents.forEach(agent => {
        if (agent.state === DiseaseState.Exposed && 
            day - (agent.exposureTime || 0) >= simulationParams.incubationPeriod) {
          agent.state = DiseaseState.Infectious;
          agent.infectionTime = day;
        }
        else if (agent.state === DiseaseState.Infectious && 
                day - (agent.infectionTime || 0) >= simulationParams.infectiousPeriod) {
          agent.state = Math.random() < simulationParams.recoveryRate ? 
            DiseaseState.Recovered : DiseaseState.Susceptible;
        }
      });

      // Update time series
      const dayData: TimeSeriesData = {
        day,
        susceptible: newAgents.filter(a => a.state === DiseaseState.Susceptible).length,
        exposed: newAgents.filter(a => a.state === DiseaseState.Exposed).length,
        infectious: newAgents.filter(a => a.state === DiseaseState.Infectious).length,
        recovered: newAgents.filter(a => a.state === DiseaseState.Recovered).length,
        dead: simulationParams.population - newAgents.filter(a => a.state !== DiseaseState.Recovered).length
      };
      newTimeSeriesData.push(dayData);
      setCurrentDay(day);
    }

    setTimeSeriesData(newTimeSeriesData);
    setAgents(newAgents);
  };

  return (
    <SimulationContext.Provider value={{
      simulationParams,
      updateParams,
      agents,
      timeSeriesData,
      transmissionEvents,
      currentDay,
      runSimulation
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

// Hook to use simulation context
export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};