import React from 'react';
import {
  LineChart,
  Line,
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

const TimeSeriesChart: React.FC = () => {
  const { timeSeriesData } = useSimulation();
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={timeSeriesData}
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
              value: 'Population',
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: theme.palette.text.secondary },
            }}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: 20,
            }}
          />
          <Line
            type="monotone"
            dataKey="susceptible"
            name="Susceptible"
            stroke={colors.disease.susceptible}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="exposed"
            name="Exposed"
            stroke={colors.disease.exposed}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="infectious"
            name="Infectious"
            stroke={colors.disease.infectious}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="recovered"
            name="Recovered"
            stroke={colors.disease.recovered}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="dead"
            name="Deaths"
            stroke="#FF4D4F"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TimeSeriesChart;