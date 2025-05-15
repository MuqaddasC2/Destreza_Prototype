import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import theme from './theme/theme';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import NetworkGraphPage from './pages/ForceDirectedGraphPage';
import StatisticsPage from './pages/StatisticsPage';
import SimulationComplete from './components/SimulationComplete';
import { SimulationProvider } from './context/SimulationContext';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    if (showCompletionPrompt) {
      setShowCompletionPrompt(false);
    }
  };

  const startSimulation = () => {
    setSimulationStarted(true);
    
    // Simulate a delay before completing the simulation
    setTimeout(() => {
      setSimulationCompleted(true);
      setShowCompletionPrompt(true);
    }, 5000); // 5 second simulation for demonstration
  };

  const resetSimulation = () => {
    setSimulationStarted(false);
    setSimulationCompleted(false);
    setShowCompletionPrompt(false);
    setCurrentTab(0);
  };

  const handleViewNetwork = () => {
    setCurrentTab(1);
    setShowCompletionPrompt(false);
  };

  const handleViewStats = () => {
    setCurrentTab(2);
    setShowCompletionPrompt(false);
  };

  // Handle tab switching logic
  useEffect(() => {
    // If user clicks home tab after simulation started, reset
    if (currentTab === 0 && simulationCompleted) {
      // Optional: ask for confirmation before resetting
      // For now we'll just reset
      resetSimulation();
    }
  }, [currentTab, simulationCompleted]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SimulationProvider>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navigation 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
            simulationStarted={simulationCompleted} 
          />
          
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <AnimatePresence mode="wait">
              {currentTab === 0 && (
                <HomePage
                  key="home"
                  onStartSimulation={startSimulation}
                  simulationStatus={{
                    started: simulationStarted,
                    completed: simulationCompleted
                  }}
                />
              )}
              
              {showCompletionPrompt && simulationCompleted && currentTab === 0 && (
                <SimulationComplete
                  onViewNetwork={handleViewNetwork}
                  onViewStats={handleViewStats}
                />
              )}
              
              {currentTab === 1 && simulationCompleted && (
                <NetworkGraphPage key="network" />
              )}
              
              {currentTab === 2 && simulationCompleted && (
                <StatisticsPage key="statistics" />
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </SimulationProvider>
    </ThemeProvider>
  );
}

export default App;