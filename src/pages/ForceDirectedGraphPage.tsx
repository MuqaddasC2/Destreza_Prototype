import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Switch, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import FrostedCard from '../components/FrostedCard';
import ForceGraph from '../components/ForceGraph';
import StatisticsCards from '../components/StatisticsCards';
import { colors } from '../theme/theme';

const ForceDirectedGraphPage: React.FC = () => {
  const [animateGraph, setAnimateGraph] = useState(true);
  
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
                  Force-Directed Graph
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
              
              <Box sx={{ height: 500 }}>
                <ForceGraph animate={animateGraph} />
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

export default ForceDirectedGraphPage;