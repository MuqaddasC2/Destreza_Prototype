import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';
import FrostedCard from '../components/FrostedCard';
import SimulationForm from '../components/SimulationForm';
import SimulationStatus from '../components/SimulationStatus';
import { colors } from '../theme/theme';

interface HomePageProps {
  onStartSimulation: () => void;
  simulationStatus: {
    started: boolean;
    completed: boolean;
  };
}

const HomePage: React.FC<HomePageProps> = ({ 
  onStartSimulation, 
  simulationStatus 
}) => {
  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: { xs: 4, md: 8 },
            mb: 4
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 3
            }}
          >
            <ActivitySquare 
              size={64} 
              color={colors.accent.primary}
              strokeWidth={1.5}
              style={{ 
                filter: 'drop-shadow(0 0 12px rgba(81, 250, 170, 0.7))'
              }}
              component={motion.svg}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                type: 'spring',
                stiffness: 200
              }}
            />
          </Box>
          
          <Typography 
            variant="h2" 
            component={motion.h2}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            sx={{ 
              mb: 2,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #FF81FF, #51FAAA)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Destreza
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary"
            component={motion.h5}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            sx={{ mb: 5 }}
          >
            Advanced Disease Spread Simulator
          </Typography>
          
          <FrostedCard 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              maxWidth: 900, 
              mx: 'auto', 
              mb: 5,
              position: 'relative',
              overflow: 'hidden',
            }}
            component={motion.div}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                width: '200px', 
                height: '200px', 
                background: 'radial-gradient(circle, rgba(81, 250, 170, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
                top: '-50px',
                right: '-50px',
                borderRadius: '50%',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
            
            <Box 
              sx={{ 
                position: 'absolute', 
                width: '150px', 
                height: '150px', 
                background: 'radial-gradient(circle, rgba(255, 129, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
                bottom: '-50px',
                left: '30%',
                borderRadius: '50%',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
            
            <Typography variant="h4" mb={3} fontWeight="bold">
              Visualize the spread of infectious diseases
            </Typography>
            
            <Typography variant="body1" mb={4} color="text.secondary" lineHeight={1.7}>
              Destreza is a sophisticated disease transmission simulator that allows you to model how infections spread through populations. Using the SEIR model (Susceptible, Exposed, Infectious, Recovered), you can explore outbreak scenarios and observe the impact of various interventions on disease dynamics.
            </Typography>
            
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <Typography variant="body1" lineHeight={1.7}>
                <Typography component="span" fontWeight="bold" color={colors.accent.primary}>
                  Key features:
                </Typography>
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>Dynamic, force-directed graph visualization</li>
                  <li>Interactive parameter adjustment</li>
                  <li>Real-time epidemic curves</li>
                  <li>SEIR compartmental modeling</li>
                  <li>Configurable interventions (vaccination, social distancing)</li>
                </ul>
              </Typography>
            </Box>
          </FrostedCard>

          {!simulationStatus.started && (
            <SimulationForm onStart={onStartSimulation} />
          )}
          
          <SimulationStatus isRunning={simulationStatus.started && !simulationStatus.completed} />
        </Box>
      </motion.div>
    </Container>
  );
};

export default HomePage;