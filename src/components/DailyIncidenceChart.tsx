import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { useSimulation } from '../context/SimulationContext';
import { colors } from '../theme/theme';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(12, 14, 29, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: 2,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
          Day {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={`tooltip-item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: entry.color,
                mr: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {entry.name}:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return null;
};

const DailyIncidenceChart: React.FC = () => {
  const { timeSeriesData } = useSimulation();
  const theme = useTheme();
  
  // Calculate daily new cases
  const dailyData = useMemo(() => {
    return timeSeriesData.map((data, index) => {
      const previousDay = index > 0 ? timeSeriesData[index - 1] : null;
      
      const newExposed = previousDay 
        ? Math.max(0, data.exposed - previousDay.exposed + (data.infectious - previousDay.infectious)) 
        : data.exposed;
        
      const newInfectious = previousDay 
        ? Math.max(0, data.infectious - previousDay.infectious + (data.recovered - previousDay.recovered)) 
        : data.infectious;
        
      const newRecovered = previousDay 
        ? Math.max(0, data.recovered - previousDay.recovered)
        : data.recovered;
        
      const newDead = previousDay 
        ? Math.max(0, data.dead - previousDay.dead)
        : data.dead;
      
      return {
        day: data.day,
        newExposed,
        newInfectious,
        newRecovered,
        newDead
      };
    });
  }, [timeSeriesData]);
  
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dailyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            label={{ value: 'Days', position: 'insideBottomRight', offset: -10 }}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <YAxis
            label={{
              value: 'New Cases',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: theme.palette.text.secondary },
            }}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          <Bar
            dataKey="newExposed"
            name="New Exposed"
            fill={colors.disease.exposed}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="newInfectious"
            name="New Infectious"
            fill={colors.disease.infectious}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="newRecovered"
            name="New Recovered"
            fill={colors.disease.recovered}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="newDead"
            name="New Deaths"
            fill="#FF4D4F"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DailyIncidenceChart;