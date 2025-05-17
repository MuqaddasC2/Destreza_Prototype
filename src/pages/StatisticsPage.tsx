import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Tabs, Tab, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
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

interface StatisticsPageProps {
  hasSimulation: boolean;
  onReset?: () => void;
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

const StatisticsPage: React.FC<StatisticsPageProps> = ({ hasSimulation, onReset }) => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const scrollToSimulation = () => {
    const homeTab = document.querySelector('[role="tab"][aria-label="Home"]');
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
              Please configure a simulation to view the statistical analysis.
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
    <Container maxWidth="lg" sx={{ py: 12, mt: '48px'  }}>
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
          Epidemic Curves & Analysis
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <FrostedCard sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  aria-label="chart tabs"
                  sx={{
                    flexGrow: 1,
                    mr: 2,
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

export default StatisticsPage;