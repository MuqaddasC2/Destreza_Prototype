import React, { useState } from 'react';
import {
  Box,
  TextField,
  Slider,
  Typography,
  Button,
  Collapse,
  Grid,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Link,
} from '@mui/material';
import { ChevronDown, ChevronUp, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import FrostedCard from './FrostedCard';
import { useSimulation, SimulationParams } from '../context/SimulationContext';
import { colors } from '../theme/theme';

const LabelTooltip: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Tooltip title={title}>
      <IconButton size="small" sx={{ ml: 1, color: colors.text.secondary }}>
        <Info size={16} />
      </IconButton>
    </Tooltip>
  );
};

const SimulationForm: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { simulationParams, updateParams, runSimulation } = useSimulation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [covidMenuAnchor, setCovidMenuAnchor] = useState<null | HTMLElement>(null);
  
  const handleSliderChange = (name: keyof SimulationParams) => (event: Event, value: number | number[]) => {
    updateParams({ [name]: value as number });
  };

  const handleInputChange = (name: keyof SimulationParams) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;
    if (!isNaN(value)) {
      updateParams({ [name]: value });
    }
  };

  const handleStart = () => {
    runSimulation();
    onStart();
  };

  const applyCovidParams = (variant: 'original' | 'delta') => {
    const params = variant === 'original' ? {
      r0: 3.32,
      recoveryRate: 0.8,
      incubationPeriod: 5,
      vaccinationRate: 0.5,
      infectiousPeriod: 8,
      socialDistancing: 0.1
    } : {
      r0: 4.87,
      recoveryRate: 0.7,
      incubationPeriod: 3,
      vaccinationRate: 0.7,
      infectiousPeriod: 15,
      socialDistancing: 0.5
    };
    
    updateParams(params);
    setCovidMenuAnchor(null);
  };

  const scrollToAbout = () => {
    const element = document.getElementById('about-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <FrostedCard sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" mb={4} fontWeight="bold">
        Simulation Parameters
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography>
                Population Size
                <LabelTooltip title="Total number of individuals in the simulation" />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Slider
                value={simulationParams.population}
                min={100}
                max={1000}
                step={100}
                onChange={handleSliderChange('population')}
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
              <TextField
                value={simulationParams.population}
                onChange={handleInputChange('population')}
                type="number"
                variant="outlined"
                size="small"
                inputProps={{ min: 100, max: 1000, step: 100 }}
                sx={{ width: 150, ml: 2 }}
              />
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography>
                Initial Infected
                <LabelTooltip title="Number of infected individuals at the start" />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Slider
                value={simulationParams.initialInfected}
                min={1}
                max={50}
                step={1}
                onChange={handleSliderChange('initialInfected')}
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
              <TextField
                value={simulationParams.initialInfected}
                onChange={handleInputChange('initialInfected')}
                type="number"
                variant="outlined"
                size="small"
                inputProps={{ min: 1, max: 50, step: 1 }}
                sx={{ width: 150, ml: 2 }}
              />
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography>
                R₀ (Basic Reproduction Number)
                <LabelTooltip title="Average number of people infected by each case" />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Slider
                value={simulationParams.r0}
                min={0.5}
                max={10}
                step={0.1}
                onChange={handleSliderChange('r0')}
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
              <TextField
                value={simulationParams.r0}
                onChange={handleInputChange('r0')}
                type="number"
                variant="outlined"
                size="small"
                inputProps={{ min: 0.5, max: 10, step: 0.1 }}
                sx={{ width: 150, ml: 2 }}
              />
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography>
                Recovery Rate
                <LabelTooltip title="Percentage of infected who recover (vs. mortality)" />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Slider
                value={simulationParams.recoveryRate}
                min={0.5}
                max={1}
                step={0.01}
                onChange={handleSliderChange('recoveryRate')}
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
              <Typography sx={{ ml: 2, width: 150 }}>
                {Math.round(simulationParams.recoveryRate * 100)}%
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, mb: 3 }}>
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowAdvanced(!showAdvanced)}
          startIcon={showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          sx={{ mb: 2 }}
        >
          Advanced Parameters
        </Button>
        
        <Collapse in={showAdvanced}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography>
                    Incubation Period (days)
                    <LabelTooltip title="Days before an exposed person becomes infectious" />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={simulationParams.incubationPeriod}
                    min={1}
                    max={30}
                    step={1}
                    onChange={handleSliderChange('incubationPeriod')}
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
                  <TextField
                    value={simulationParams.incubationPeriod}
                    onChange={handleInputChange('incubationPeriod')}
                    type="number"
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 30, step: 1 }}
                    sx={{ width: 150, ml: 2 }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography>
                    Infectious Period (days)
                    <LabelTooltip title="Days a person remains infectious" />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={simulationParams.infectiousPeriod}
                    min={1}
                    max={30}
                    step={1}
                    onChange={handleSliderChange('infectiousPeriod')}
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
                  <TextField
                    value={simulationParams.infectiousPeriod}
                    onChange={handleInputChange('infectiousPeriod')}
                    type="number"
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 30, step: 1 }}
                    sx={{ width: 150, ml: 2 }}
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography>
                    Vaccination Rate
                    <LabelTooltip title="Percentage of population that is vaccinated" />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={simulationParams.vaccinationRate || 0}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handleSliderChange('vaccinationRate')}
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
                  <Typography sx={{ ml: 2, width: 150 }}>
                    {Math.round((simulationParams.vaccinationRate || 0) * 100)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography>
                    Social Distancing
                    <LabelTooltip title="Reduction in contact rate due to social distancing measures" />
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Slider
                    value={simulationParams.socialDistancing || 0}
                    min={0}
                    max={1}
                    step={0.01}
                    onChange={handleSliderChange('socialDistancing')}
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
                  <Typography sx={{ ml: 2, width: 150 }}>
                    {Math.round((simulationParams.socialDistancing || 0) * 100)}%
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={(e) => setCovidMenuAnchor(e.currentTarget)}
                    startIcon={<AlertTriangle size={18} />}
                    sx={{
                      backgroundImage: 'linear-gradient(45deg, #FF4D4F, #FF81FF)',
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundImage: 'linear-gradient(45deg, #FF6961, #FF99FF)',
                        boxShadow: '0 0 15px rgba(255, 77, 79, 0.5)',
                      },
                      boxShadow: '0 0 10px rgba(255, 77, 79, 0.3)',
                    }}
                  >
                    Apply COVID-19 Values
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    Values based on collected data from peer-reviewed studies and world-renowned sources.{' '}
                    <Link
                      component="button"
                      variant="body2"
                      onClick={scrollToAbout}
                      sx={{
                        color: colors.accent.primary,
                        textShadow: `0 0 5px ${colors.accent.primary}`,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      See Sources
                    </Link>
                  </Typography>
                </Box>

                <Menu
                  anchorEl={covidMenuAnchor}
                  open={Boolean(covidMenuAnchor)}
                  onClose={() => setCovidMenuAnchor(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{
                    '& .MuiPaper-root': {
                      backgroundColor: 'rgba(12, 14, 29, 0.9)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      minWidth: '200px',
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => applyCovidParams('original')}
                    sx={{
                      color: colors.accent.primary,
                      '&:hover': {
                        backgroundColor: 'rgba(81, 250, 170, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      Original Strain
                      <Tooltip title="The initial SARS-CoV-2 strain identified in 2019, characterized by moderate transmissibility and severity">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <Info size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </MenuItem>
                  <MenuItem
                    onClick={() => applyCovidParams('delta')}
                    sx={{
                      color: colors.accent.secondary,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 129, 255, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      Delta Variant
                      <Tooltip title="A highly transmissible SARS-CoV-2 variant that emerged in late 2020, known for increased infectivity and disease severity">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <Info size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </Collapse>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStart}
          component={motion.button}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 0 15px rgba(81, 250, 170, 0.5)' 
          }}
          whileTap={{ scale: 0.95 }}
          sx={{
            px: 5,
            py: 1.5,
            borderRadius: '12px',
            backgroundImage: 'linear-gradient(45deg, #51FAAA, rgba(81, 250, 170, 0.8))',
            color: '#0C0E1D',
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Start Simulation
        </Button>
      </Box>
    </FrostedCard>
  );
};

export default SimulationForm;