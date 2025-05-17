import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Switch, FormControlLabel, Slider, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, FastForward } from 'lucide-react';
import FrostedCard from '../components/FrostedCard';
import ForceGraph from '../components/ForceGraph';
import StatisticsCards from '../components/StatisticsCards';
import { colors } from '../theme/theme';

const NetworkGraphPage: React.FC = () => {
  const [animateGraph, setAnimateGraph] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleStepForward = () => {
    // Implement step forward logic
  };
  
  const handleStepBack = () => {
    // Implement step back logic
  };
  
  const handleSpeedChange = (event: Event, newValue: number | number[]) => {
    setSimulationSpeed(newValue as number);
  };
  
  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ py: 4 }}
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
          <Grid item xs={12} lg={8}>
            <FrostedCard sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Network Graph
                </Typography>
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
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  {[
                    { state: 'Susceptible', color: colors.disease.susceptible },
                    { state: 'Exposed', color: colors.disease.exposed },
                    { state: 'Infectious', color: colors.disease.infectious },
                    { state: 'Recovered', color: colors.disease.recovered }
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
              
              <Box sx={{ height: 500, mb: 3 }}>
                <ForceGraph animate={animateGraph} />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <IconButton onClick={handleStepBack} sx={{ color: colors.text.primary }}>
                  <SkipBack size={24} />
                </IconButton>
                
                <Button
                  variant="contained"
                  onClick={handlePlayPause}
                  startIcon={isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  sx={{
                    backgroundColor: 'rgba(81, 250, 170, 0.1)',
                    border: '1px solid rgba(81, 250, 170, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(81, 250, 170, 0.2)',
                    }
                  }}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <IconButton onClick={handleStepForward} sx={{ color: colors.text.primary }}>
                  <SkipForward size={24} />
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, minWidth: 200 }}>
                  <FastForward size={16} style={{ marginRight: 8 }} />
                  <Slider
                    value={simulationSpeed}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onChange={handleSpeedChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}x`}
                    sx={{
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '& .MuiSlider-track': {
                        backgroundImage: 'linear-gradient(to right, #51FAAA, #FF81FF)',
                      },
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#51FAAA',
                        boxShadow: '0 0 8px #51FAAA',
                      },
                    }}
                  />
                </Box>
              </Box>
            </FrostedCard>
          </Grid>
          
          <Grid item xs={12} lg={4}>
            <FrostedCard sx={{ p: 3, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Current Statistics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Real-time disease spread metrics from the simulation.
              </Typography>
              
              <StatisticsCards />
            </FrostedCard>
            
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