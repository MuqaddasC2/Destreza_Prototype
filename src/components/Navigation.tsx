import React from 'react';
import { Box, Tabs, Tab, styled } from '@mui/material';
import { ActivitySquare, BarChart3, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: colors.background.dark,
  borderBottom: `1px solid ${colors.card.border}`,
  minHeight: '40px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  minWidth: 120,
  minHeight: '40px',
  color: colors.text.primary,
  transition: 'all 0.3s ease',
  position: 'relative',
  margin: '0 4px',
  
  '&.Mui-selected': {
    color: colors.accent.primary,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: colors.accent.primary,
      boxShadow: `0 0 8px ${colors.accent.primary}`,
    }
  },

  '&:hover': {
    color: colors.accent.primary,
  },
}));

const GlowingIcon = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
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
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        backgroundColor: colors.background.dark,
        borderBottom: `1px solid ${colors.card.border}`,
      }}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <StyledTabs
        value={currentTab}
        onChange={onTabChange}
        aria-label="navigation tabs"
        centered
      >
        <StyledTab
          icon={
            <GlowingIcon
              animate={{ 
                scale: currentTab === 0 ? 1.1 : 1
              }}
            >
              <Home size={18} />
            </GlowingIcon>
          }
          label="Home"
          iconPosition="start"
        />
        <StyledTab
          icon={
            <GlowingIcon
              animate={{ 
                scale: currentTab === 1 ? 1.1 : 1
              }}
            >
              <ActivitySquare size={18} />
            </GlowingIcon>
          }
          label="Network Graph"
          iconPosition="start"
        />
        <StyledTab
          icon={
            <GlowingIcon
              animate={{ 
                scale: currentTab === 2 ? 1.1 : 1
              }}
            >
              <BarChart3 size={18} />
            </GlowingIcon>
          }
          label="Statistics"
          iconPosition="start"
        />
      </StyledTabs>
    </Box>
  );
};

export default Navigation;