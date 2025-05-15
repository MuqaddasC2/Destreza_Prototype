import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { colors } from '../theme/theme';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
}

const RADIAN = Math.PI / 180;

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: payload[0].payload.fill,
              mr: 1,
            }}
          />
          <Typography variant="body2" fontWeight="bold">
            {payload[0].name}:
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {payload[0].value} ({payload[0].payload.percentage}%)
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

const RenderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent >= 0.05 ? (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

const PopulationPieChart: React.FC = () => {
  const { timeSeriesData } = useSimulation();
  const theme = useTheme();
  
  // Get the latest data
  const latestData = timeSeriesData.length > 0 ? timeSeriesData[timeSeriesData.length - 1] : null;
  
  if (!latestData) {
    return null;
  }
  
  const total = latestData.susceptible + latestData.exposed + latestData.infectious + latestData.recovered + latestData.dead;
  
  const data = [
    {
      name: 'Susceptible',
      value: latestData.susceptible,
      fill: colors.disease.susceptible,
      percentage: ((latestData.susceptible / total) * 100).toFixed(1)
    },
    {
      name: 'Exposed',
      value: latestData.exposed,
      fill: colors.disease.exposed,
      percentage: ((latestData.exposed / total) * 100).toFixed(1)
    },
    {
      name: 'Infectious',
      value: latestData.infectious,
      fill: colors.disease.infectious,
      percentage: ((latestData.infectious / total) * 100).toFixed(1)
    },
    {
      name: 'Recovered',
      value: latestData.recovered,
      fill: colors.disease.recovered,
      percentage: ((latestData.recovered / total) * 100).toFixed(1)
    },
    {
      name: 'Deaths',
      value: latestData.dead,
      fill: '#FF4D4F',
      percentage: ((latestData.dead / total) * 100).toFixed(1)
    }
  ];
  
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={RenderCustomizedLabel}
            outerRadius={140}
            innerRadius={60}
            paddingAngle={2}
            dataKey="value"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth={1}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry, index) => {
              const item = data[index];
              return (
                <Typography variant="body2" component="span" color="text.secondary">
                  {value}: {item.value} ({item.percentage}%)
                </Typography>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PopulationPieChart;