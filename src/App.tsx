import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import theme from './theme/theme';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import NetworkGraphPage from './pages/NetworkGraphPage';
import StatisticsPage from './pages/StatisticsPage';
import { SimulationProvider } from './context/SimulationContext';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [simulationCompleted, setSimulationCompleted] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const startSimulation = () => {
    setSimulationStarted(true);
  };

  const handleSimulationComplete = (action: 'graph' | 'stats') => {
    setSimulationCompleted(true);
    setCurrentTab(action === 'graph' ? 1 : 2);
  };

  const resetSimulation = () => {
    setSimulationStarted(false);
    setSimulationCompleted(false);
    setCurrentTab(0);
  };

  // Handle tab switching logic
  useEffect(() => {
    // If user clicks home tab after simulation started, reset
    if (currentTab === 0 && simulationCompleted) {
      resetSimulation();
    }
  }, [currentTab, simulationCompleted]);

  // Add background circles
  const circles = Array.from({ length: 5 }).map((_, i) => ({
    size: Math.random() * 300 + 200,
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    opacity: Math.random() * 0.1 + 0.05,
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SimulationProvider>
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Circles */}
          {circles.map((circle, i) => (
            <Box
              key={i}
              sx={{
                position: 'fixed',
                width: circle.size,
                height: circle.size,
                borderRadius: '50%',
                top: circle.top,
                left: circle.left,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(81, 250, 170, 0.1) 0%, rgba(255, 129, 255, 0.1) 100%)',
                opacity: circle.opacity,
                filter: 'blur(100px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          ))}
          
          <Navigation 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
            simulationStarted={simulationStarted} 
          />
          
          <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
            <AnimatePresence mode="wait">
              {currentTab === 0 && (
                <HomePage
                  key="home"
                  onStartSimulation={startSimulation}
                  simulationStatus={{
                    started: simulationStarted,
                    completed: simulationCompleted
                  }}
                  onSimulationComplete={handleSimulationComplete}
                  onReset={resetSimulation}
                />
              )}
              
              {currentTab === 1 && (
                <NetworkGraphPage 
                  key="network"
                  hasSimulation={simulationStarted}
                  onReset={resetSimulation}
                />
              )}
              
              {currentTab === 2 && (
                <StatisticsPage 
                  key="stats"
                  hasSimulation={simulationStarted}
                  onReset={resetSimulation}
                />
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </SimulationProvider>
    </ThemeProvider>
  );
}

export default App;