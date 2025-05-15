import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import FrostedCard from '../components/FrostedCard';
import TimeSeriesChart from '../components/TimeSeriesChart';
import DailyIncidenceChart from '../components/DailyIncidenceChart';
import PopulationPieChart from '../components/PopulationPieChart';
import { colors } from '../theme/theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chart-tabpanel-${index}`}
      aria-labelledby={`chart-tab-${index}`}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const ChartsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          Epidemic Curves & Analysis
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  aria-label="chart tabs"
                  sx={{
                    '& .MuiTabs-indicator': {
                      backgroundColor: colors.accent.primary,
                      height: 3,
                      borderRadius: '3px',
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: colors.text.primary,
                      '&.Mui-selected': {
                        color: colors.accent.primary,
                      },
                    },
                  }}
                >
                  <Tab label="Cumulative Cases" />
                  <Tab label="Daily New Cases" />
                  <Tab label="Population Distribution" />
                </Tabs>
              </Box>
              
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Cumulative Disease Progression
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    This chart shows the total number of cases in each disease state over time.
                  </Typography>
                </Box>
                <TimeSeriesChart />
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Daily Incidence
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    This chart shows the new cases reported each day by disease state.
                  </Typography>
                </Box>
                <DailyIncidenceChart />
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Current Population Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    This chart shows the current distribution of the population across disease states.
                  </Typography>
                </Box>
                <PopulationPieChart />
              </TabPanel>
            </FrostedCard>
          </Grid>
          
          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Chart Interpretation Guide
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Cumulative Chart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      The time series chart shows the total count of individuals in each disease state over time. It helps visualize the overall progression of the epidemic and identify when it peaks.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Daily Incidence Chart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      The bar chart shows new cases each day, which helps identify when transmission is accelerating or decelerating. The epidemic peak occurs when daily new cases start to decline.
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Population Distribution
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      The pie chart provides a snapshot of the current population distribution across all disease states, showing the relative proportion of each state in the overall population.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </FrostedCard>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ChartsPage;