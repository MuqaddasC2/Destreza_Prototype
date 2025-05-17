import React from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';
import FrostedCard from '../components/FrostedCard';
import SimulationForm from '../components/SimulationForm';
import SimulationStatus from '../components/SimulationStatus';
import HeroBackground from '../components/HeroBackground';
import { colors } from '../theme/theme';

interface HomePageProps {
  onStartSimulation: () => void;
  simulationStatus: {
    started: boolean;
    completed: boolean;
  };
  onSimulationComplete: (action: 'graph' | 'stats') => void;
}

const BackgroundCircle = ({ size, top, left, right, bottom, delay = 0 }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.5, delay }}
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(81, 250, 170, 0.03) 0%, rgba(255, 129, 255, 0.02) 50%, rgba(0, 0, 0, 0) 70%)',
      backdropFilter: 'blur(60px)',
      top,
      left,
      right,
      bottom,
      zIndex: 0,
    }}
  />
);

const HomePage: React.FC<HomePageProps> = ({ 
  onStartSimulation, 
  simulationStatus,
  onSimulationComplete
}) => {
  const scrollToSimulation = () => {
    const element = document.getElementById('simulation-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: '48px' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: 'calc(100vh - 48px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <HeroBackground />
        
        <Container maxWidth="lg">
          <FrostedCard
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            sx={{
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
              background: 'rgba(12, 14, 29, 0.2)',
              backdropFilter: 'blur(20px)',
              p: 4,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            <ActivitySquare 
              size={80} 
              color={colors.accent.primary}
              strokeWidth={1.5}
              style={{ 
                margin: '0 auto',
                filter: 'drop-shadow(0 0 20px rgba(81, 250, 170, 0.5))'
              }}
            />
            
            <Typography 
              variant="h1"
              sx={{ 
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 700,
                mt: 4,
                mb: 2,
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
              variant="h4"
              sx={{
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              Advanced disease transmission simulator with real-time visualization and analysis
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={scrollToSimulation}
              component={motion.button}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(81, 250, 170, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
              sx={{
                px: 4,
                py: 2,
                borderRadius: '12px',
                backgroundImage: 'linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))',
                color: '#0C0E1D',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              Configure Simulation
            </Button>
          </FrostedCard>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" id="simulation-section">
        <Box sx={{ py: 8 }}>
          <FrostedCard 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              mb: 6,
            }}
          >
            <Typography variant="h4" mb={3} fontWeight="bold">
              About the Simulator
            </Typography>
            
            <Typography variant="body1" mb={4} color="text.secondary" lineHeight={1.7}>
              Destreza is a sophisticated disease transmission simulator that models how infections spread through populations. Using the SEIR model (Susceptible, Exposed, Infectious, Recovered), you can explore outbreak scenarios and observe the impact of various interventions on disease dynamics.
            </Typography>
            
            <Box>
              <Typography variant="h6" mb={2} color={colors.accent.primary}>
                Key Features
              </Typography>
              <Grid container spacing={3}>
                {[
                  'Dynamic force-directed network visualization',
                  'Real-time epidemic curve analysis',
                  'Interactive parameter adjustment',
                  'SEIR compartmental modeling',
                  'Configurable interventions',
                  'Advanced statistical analysis'
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'rgba(81, 250, 170, 0.1)',
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: colors.accent.primary,
                          mr: 2,
                        }}
                      />
                      <Typography variant="body2">
                        {feature}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </FrostedCard>

          {!simulationStatus.started && (
            <SimulationForm onStart={onStartSimulation} />
          )}
          
          <SimulationStatus 
            isRunning={simulationStatus.started && !simulationStatus.completed} 
            onComplete={onSimulationComplete}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;