import React from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { ActivitySquare } from 'lucide-react';
import { motion } from 'framer-motion';
import FrostedCard from '../components/FrostedCard';
import SimulationForm from '../components/SimulationForm';
import SimulationStatus from '../components/SimulationStatus';
import HeroBackground from '../components/HeroBackground';
import ParticlesEmbers from '../components/ParticlesEmbers';
import { colors } from '../theme/theme';

interface HomePageProps {
  onStartSimulation: () => void;
  simulationStatus: {
    started: boolean;
    completed: boolean;
  };
  onSimulationComplete: (action: 'graph' | 'stats') => void;
}

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
        <ParticlesEmbers direction="up" />
        
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
              background: colors.card.background,
              p: 3,
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            <Typography 
              variant="h1"
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mt: 2,
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
                maxWidth: '500px',
                mx: 'auto',
                mb: 3,
                fontSize: { xs: '0.9rem', md: '1rem' },
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
                py: 1.5,
                borderRadius: '12px',
                backgroundImage: 'linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))',
                color: '#0C0E1D',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              Configure Simulation
            </Button>
          </FrostedCard>
        </Container>

        {/* Glowing Bar */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 20px rgba(81, 250, 170, 0.3)',
              '0 0 40px rgba(81, 250, 170, 0.6)',
              '0 0 20px rgba(81, 250, 170, 0.3)'
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #51FAAA, transparent)',
            zIndex: 2
          }}
        />
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" id="simulation-section">
        <Box sx={{ py: 8 }}>
          {!simulationStatus.started && (
            <SimulationForm onStart={onStartSimulation} />
          )}
          
          <SimulationStatus 
            isRunning={simulationStatus.started && !simulationStatus.completed} 
            onComplete={onSimulationComplete}
          />

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
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;