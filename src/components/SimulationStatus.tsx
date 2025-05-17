import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Grid, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivitySquare, BarChart3, RefreshCw } from 'lucide-react';
import FrostedCard from './FrostedCard';
import { colors } from '../theme/theme';

interface SimulationStatusProps {
  isRunning: boolean;
  onComplete?: (action: 'graph' | 'stats') => void;
  onReset?: () => void;
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
  "Simulation complete!"
];

const SimulationStatus: React.FC<SimulationStatusProps> = ({ isRunning, onComplete, onReset }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCompletionButtons, setShowCompletionButtons] = useState(false);
  
  useEffect(() => {
    if (!isRunning) {
      setCurrentStep(0);
      setProgress(0);
      setShowCompletionButtons(false);
      return;
    }
    
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < simulationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setShowCompletionButtons(true);
          return prev;
        }
      });
    }, 800);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const targetProgress = (currentStep / (simulationSteps.length - 1)) * 100;
        const nextProgress = Math.min(prev + 2, targetProgress);
        
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
        }
        
        return nextProgress;
      });
    }, 50);
    
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isRunning, currentStep]);
  
  if (!isRunning && !showCompletionButtons) {
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
        
        <AnimatePresence mode="wait">
          {!showCompletionButtons ? (
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
          ) : (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ 
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                Your simulation is ready!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => onComplete?.('graph')}
                  startIcon={<ActivitySquare size={20} />}
                  sx={{
                    backgroundImage: 'linear-gradient(45deg, #FF81FF, #51FAAA)',
                    color: '#0C0E1D',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      boxShadow: '0 0 20px rgba(81, 250, 170, 0.5)',
                    }
                  }}
                >
                  Observe Network Graph
                </Button>
                <Button
                  variant="contained"
                  onClick={() => onComplete?.('stats')}
                  startIcon={<BarChart3 size={20} />}
                  sx={{
                    backgroundImage: 'linear-gradient(45deg, #51FAAA, #FF81FF)',
                    color: '#0C0E1D',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': {
                      boxShadow: '0 0 20px rgba(255, 129, 255, 0.5)',
                    }
                  }}
                >
                  Analyze Statistics
                </Button>
                <Button
                  variant="outlined"
                  onClick={onReset}
                  startIcon={<RefreshCw size={20} />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    borderColor: colors.accent.primary,
                    color: colors.accent.primary,
                    '&:hover': {
                      borderColor: colors.accent.primary,
                      backgroundColor: 'rgba(81, 250, 170, 0.1)',
                    }
                  }}
                >
                  Configure New Simulation
                </Button>
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </FrostedCard>
    </AnimatePresence>
  );
};

export default SimulationStatus;