import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Switch, FormControlLabel, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import FrostedCard from '../components/FrostedCard';
import ForceGraph from '../components/ForceGraph';
import StatisticsCards from '../components/StatisticsCards';
import { colors } from '../theme/theme';

interface NetworkGraphPageProps {
  hasSimulation: boolean;
  onReset?: () => void;
}

const NetworkGraphPage: React.FC<NetworkGraphPageProps> = ({ hasSimulation, onReset }) => {
  const [animateGraph, setAnimateGraph] = useState(true);
  
  const scrollToSimulation = () => {
    const homeTab = document.querySelector('[aria-label="Home"]');
    if (homeTab) {
      (homeTab as HTMLElement).click();
    }
    
    setTimeout(() => {
      const element = document.getElementById('simulation-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };
  
  if (!hasSimulation) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, mt: '48px' }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FrostedCard sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              No Active Simulation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please configure a simulation to view the network graph visualization.
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={scrollToSimulation}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  backgroundImage: 'linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))',
                  color: '#0C0E1D',
                  fontWeight: 'bold',
                }}
              >
                Configure Simulation
              </Button>
            </motion.div>
          </FrostedCard>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 12, mt: '48px' }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            backgroundImage: 'linear-gradient(90deg, #FF81FF, #51FAAA)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            mb: 4,
          }}
        >
          Disease Transmission Network
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Force-Directed Graph
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={animateGraph}
                        onChange={(e) => setAnimateGraph(e.target.checked)}
                        color="primary"
                      />
                    } 
                    label="Animate Growth" 
                  />
                  <Button
                    variant="outlined"
                    onClick={onReset}
                    startIcon={<RefreshCw size={20} />}
                    sx={{
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
              
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  {[
                    { state: 'Susceptible', color: colors.disease.susceptible },
                    { state: 'Exposed', color: colors.disease.exposed },
                    { state: 'Infectious', color: colors.disease.infectious },
                    { state: 'Recovered', color: colors.disease.recovered },
                    { state: 'Deceased', color: '#808080' }
                  ].map((item) => (
                    <Grid item key={item.state}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: item.color,
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {item.state}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Box sx={{ height: '600px', width: '100%' }}>
                <ForceGraph animate={animateGraph} />
              </Box>
            </FrostedCard>
          </Grid>
          
          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Current Statistics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Real-time disease spread metrics from the simulation.
              </Typography>
              
              <StatisticsCards />
            </FrostedCard>
          </Grid>
          
          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Network Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The force-directed graph shows how the disease spreads through the population.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Nodes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Each circle represents an individual in the population. The color indicates their disease state.
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Edges
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lines between nodes represent transmission events, showing who infected whom.
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Interaction
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You can drag nodes to reposition them and explore the network structure. Hover over nodes for more information.
                </Typography>
              </Box>
            </FrostedCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default NetworkGraphPage;