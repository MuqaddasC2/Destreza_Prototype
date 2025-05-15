import React from 'react';
import { Box, Tabs, Tab, styled } from '@mui/material';
import { ActivitySquare, BarChart3, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-flexContainer': {
    gap: '16px',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  minWidth: 160,
  color: colors.text.primary,
  transition: 'all 0.3s ease',
  position: 'relative',
  borderRadius: '50px',
  padding: '12px 24px',
  backgroundColor: 'rgba(81, 250, 170, 0.05)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(81, 250, 170, 0.2)',
  
  '&.Mui-selected': {
    color: colors.accent.primary,
    backgroundColor: 'rgba(81, 250, 170, 0.1)',
    boxShadow: '0 0 15px rgba(81, 250, 170, 0.3)',
    border: '1px solid rgba(81, 250, 170, 0.4)',
  },

  '&:hover': {
    backgroundColor: 'rgba(81, 250, 170, 0.15)',
    boxShadow: '0 0 20px rgba(81, 250, 170, 0.4)',
  },
}));

const BackgroundCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(81, 250, 170, 0.05) 0%, rgba(81, 250, 170, 0) 70%)',
  backdropFilter: 'blur(8px)',
}));

interface NavigationProps {
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  simulationStarted: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentTab, 
  onTabChange,
  simulationStarted
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        paddingY: 2,
        position: 'relative',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${colors.card.border}`,
        overflow: 'hidden',
      }}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Background Circles */}
      <BackgroundCircle
        sx={{
          width: '400px',
          height: '400px',
          top: '-200px',
          left: '10%',
        }}
      />
      <BackgroundCircle
        sx={{
          width: '300px',
          height: '300px',
          bottom: '-150px',
          right: '20%',
        }}
      />
      <BackgroundCircle
        sx={{
          width: '200px',
          height: '200px',
          top: '-100px',
          right: '10%',
        }}
      />
      
      <StyledTabs
        value={currentTab}
        onChange={onTabChange}
        centered
        aria-label="navigation tabs"
        TabIndicatorProps={{ sx: { display: 'none' } }}
      >
        <StyledTab
          icon={
            <Home size={20} />
          }
          label="Home"
          iconPosition="start"
        />
        <StyledTab
          icon={
            <ActivitySquare size={20} />
          }
          label="Network Graph"
          iconPosition="start"
          disabled={!simulationStarted}
        />
        <StyledTab
          icon={
            <BarChart3 size={20} />
          }
          label="Statistics"
          iconPosition="start"
          disabled={!simulationStarted}
        />
      </StyledTabs>
    </Box>
  );
};

export default Navigation;