import React from 'react';
import { Box, Tabs, Tab, styled } from '@mui/material';
import { ActivitySquare, BarChart3, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../theme/theme';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '2px',
    background: colors.accent.primary,
    boxShadow: `0 0 10px ${colors.accent.primary}`,
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  minWidth: 100,
  color: colors.text.primary,
  transition: 'all 0.3s ease',
  position: 'relative',
  
  '&.Mui-selected': {
    color: colors.accent.primary,
  },

  '&:hover': {
    color: colors.accent.primary,
    opacity: 0.9,
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
        paddingY: 2,
        position: 'relative',
        backdropFilter: 'blur(8px)',
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
        centered
        aria-label="navigation tabs"
      >
        <StyledTab
          icon={
            <GlowingIcon
              animate={{ 
                filter: currentTab === 0 ? 'drop-shadow(0 0 4px #51FAAA)' : 'none',
                scale: currentTab === 0 ? 1.1 : 1
              }}
            >
              <Home size={20} />
            </GlowingIcon>
          }
          label="Home"
          iconPosition="start"
        />
        <StyledTab
          icon={
            <GlowingIcon
              animate={{ 
                filter: currentTab === 1 ? 'drop-shadow(0 0 4px #51FAAA)' : 'none',
                scale: currentTab === 1 ? 1.1 : 1
              }}
            >
              <ActivitySquare size={20} />
            </GlowingIcon>
          }
          label="Force-Directed Graph"
          iconPosition="start"
          disabled={!simulationStarted}
        />
        <StyledTab
          icon={
            <GlowingIcon
              animate={{ 
                filter: currentTab === 2 ? 'drop-shadow(0 0 4px #51FAAA)' : 'none',
                scale: currentTab === 2 ? 1.1 : 1
              }}
            >
              <BarChart3 size={20} />
            </GlowingIcon>
          }
          label="Charts"
          iconPosition="start"
          disabled={!simulationStarted}
        />
      </StyledTabs>
    </Box>
  );
};

export default Navigation;