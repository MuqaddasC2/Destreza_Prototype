import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ActivitySquare, BarChart3 } from 'lucide-react';
import FrostedCard from './FrostedCard';
import { colors } from '../theme/theme';

interface SimulationCompleteProps {
  onViewNetwork: () => void;
  onViewStats: () => void;
}

const SimulationComplete: React.FC<SimulationCompleteProps> = ({
  onViewNetwork,
  onViewStats,
}) => {
  return (
    <FrostedCard
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', my: 4 }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Your Simulation is Ready!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore the results through our interactive visualizations
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<ActivitySquare size={20} />}
          onClick={onViewNetwork}
          sx={{
            backgroundColor: 'rgba(81, 250, 170, 0.1)',
            border: '1px solid rgba(81, 250, 170, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(81, 250, 170, 0.2)',
              boxShadow: '0 0 20px rgba(81, 250, 170, 0.4)',
            }
          }}
        >
          See Network Graph
        </Button>
        
        <Button
          variant="contained"
          startIcon={<BarChart3 size={20} />}
          onClick={onViewStats}
          sx={{
            backgroundColor: 'rgba(81, 250, 170, 0.1)',
            border: '1px solid rgba(81, 250, 170, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(81, 250, 170, 0.2)',
              boxShadow: '0 0 20px rgba(81, 250, 170, 0.4)',
            }
          }}
        >
          Analyze Statistics
        </Button>
      </Box>
    </FrostedCard>
  );
}

export default SimulationComplete;