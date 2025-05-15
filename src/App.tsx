import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import theme from './theme/theme';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import NetworkGraphPage from './pages/NetworkGraphPage';
import StatisticsPage from './pages/StatisticsPage';
import SimulationComplete from './components/SimulationComplete';
import { SimulationProvider } from './context/SimulationContext';

const BackgroundCircle = ({ size, top, left, delay }: { 
  size: number;
  top: string;
  left: string;
  delay: number;
}) => (
  <Box
    sx={{
      position: 'fixed',
      width: size,
      height: size,
      top,
      left,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(81, 250, 170, 0.05) 0%, rgba(81, 250, 170, 0) 70%)',
      backdropFilter: 'blur(8px)',
      zIndex: 0,
      animation: 'pulse 8s infinite',
      animationDelay: `${delay}s`,
      '@keyframes pulse': {
        '0%': {
          transform: 'scale(1)',
          opacity: 0.3,
        },
        '50%': {
          transform: 'scale(1.1)',
          opacity: 0.5,
        },
        '100%': {
          transform: 'scale(1)',
          opacity: 0.3,
        },
      },
    }}
  />
);

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
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Background Circles */}
          <BackgroundCircle size={800} top="-200px" left="-200px" delay={0} />
          <BackgroundCircle size={600} top="30%" left="60%" delay={2} />
          <BackgroundCircle size={400} top="70%" left="10%" delay={4} />
          <BackgroundCircle size={300} top="20%" left="80%" delay={1} />
          <BackgroundCircle size={200} top="80%" left="70%" delay={3} />
          
          <Navigation 
            currentTab={currentTab} 
            onTabChange={handleTabChange}
            simulationStarted={simulationCompleted} 
          />
          
          <Box sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 1 }}>
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