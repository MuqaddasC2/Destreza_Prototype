import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import FrostedCard from './FrostedCard';
import { colors } from '../theme/theme';

interface SimulationStatusProps {
  isRunning: boolean;
}

const simulationSteps = [
  "Initializing simulation engine...",
  "Loading geographical data...",
  "Generating agent population...",
  "Creating social network connections...",
  "Setting initial disease parameters...",
  "Configuring environmental factors...",
  "Calibrating transmission model...",
  "Running disease spread simulation...",
  "Calculating epidemic curves...",
  "Simulation complete! View results in the tabs above."
];

const SimulationStatus: React.FC<SimulationStatusProps> = ({ isRunning }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isRunning) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }
    
    // Simulate progress through steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < simulationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 800); // Advance to next step every 800ms
    
    // Simulate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const targetProgress = (currentStep / (simulationSteps.length - 1)) * 100;
        const nextProgress = Math.min(prev + 2, targetProgress);
        
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
        }
        
        return nextProgress;
      });
    }, 50); // Update progress every 50ms
    
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isRunning, currentStep]);
  
  if (!isRunning) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <FrostedCard 
        sx={{ p: 3, my: 4 }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h5" mb={3} fontWeight="bold">
          Simulation Status
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{
              borderRadius: 1,
              height: 10,
              backgroundColor: 'rgba(97, 96, 131, 0.3)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #FF81FF, #51FAAA)',
                boxShadow: '0 0 8px rgba(81, 250, 170, 0.5)',
              }
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'right' }}>
            {Math.round(progress)}%
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {simulationSteps.map((step, index) => (
            <Grid item xs={12} key={index}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  opacity: index <= currentStep ? 1 : 0.3,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: index <= currentStep ? 1 : 0,
                    backgroundColor: index === currentStep ? colors.accent.primary : colors.accent.tertiary
                  }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: index <= currentStep ? 
                      (index === currentStep ? colors.accent.primary : colors.accent.tertiary) : 
                      'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: index === currentStep ? `0 0 10px ${colors.accent.primary}` : 'none',
                  }}
                >
                  {index < currentStep && (
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: colors.background.dark,
                      }}
                    />
                  )}
                </Box>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontWeight: index === currentStep ? 'bold' : 'normal',
                    color: index === currentStep ? colors.accent.primary : colors.text.primary
                  }}
                >
                  {step}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </FrostedCard>
    </AnimatePresence>
  );
};

export default SimulationStatus;