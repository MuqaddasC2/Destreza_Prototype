import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { Activity, Users, ThermometerSun, Skull, HeartPulse, Clock } from 'lucide-react';
import FrostedCard from './FrostedCard';
import { useSimulation } from '../context/SimulationContext';
import { colors } from '../theme/theme';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}> = ({ title, value, icon, color, delay }) => {
  return (
    <FrostedCard
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      sx={{ p: 2, height: '100%' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor: `${color}20`,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </Box>
    </FrostedCard>
  );
};

const StatisticsCards: React.FC = () => {
  const { timeSeriesData, currentDay } = useSimulation();
  
  // Get the current data
  const currentData = timeSeriesData.length > 0 
    ? timeSeriesData[timeSeriesData.length - 1] 
    : { susceptible: 0, exposed: 0, infectious: 0, recovered: 0, dead: 0, day: 0 };
  
  // Calculate total cases
  const totalCases = currentData.exposed + currentData.infectious + currentData.recovered + currentData.dead;
  
  // Calculate active cases
  const activeCases = currentData.exposed + currentData.infectious;
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Current Day"
          value={currentDay}
          icon={<Clock size={24} color={colors.accent.primary} />}
          color={colors.accent.primary}
          delay={0}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Population"
          value={currentData.susceptible + activeCases + currentData.recovered + currentData.dead}
          icon={<Users size={24} color="#5B8FF9" />}
          color="#5B8FF9"
          delay={0.1}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Active Cases"
          value={activeCases}
          icon={<Activity size={24} color="#FF4D4F" />}
          color="#FF4D4F"
          delay={0.2}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Exposed"
          value={currentData.exposed}
          icon={<ThermometerSun size={24} color={colors.disease.exposed} />}
          color={colors.disease.exposed}
          delay={0.3}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Infectious"
          value={currentData.infectious}
          icon={<HeartPulse size={24} color={colors.disease.infectious} />}
          color={colors.disease.infectious}
          delay={0.4}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Deaths"
          value={currentData.dead}
          icon={<Skull size={24} color="#FF4D4F" />}
          color="#FF4D4F"
          delay={0.5}
        />
      </Grid>
    </Grid>
  );
};

export default StatisticsCards;