import React, { ReactNode } from 'react';
import { Card, CardProps, Box, styled } from '@mui/material';
import { motion } from 'framer-motion';

// Extended Card component with frosted glass effect
const GlassCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  backgroundColor: 'rgba(12, 14, 29, 0.7)', 
  backdropFilter: 'blur(32px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
  },
  
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.4)',
    transform: 'translateY(-3px)',
  }
}));

// Overlay gradient for the card
const GradientOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  opacity: 0.05,
  pointerEvents: 'none',
  backgroundImage: 'linear-gradient(125deg, rgba(81, 250, 170, 0.1), rgba(255, 129, 255, 0.1))',
});

// Optional accent line decoration
const AccentLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '4px',
  height: '100%',
  background: 'linear-gradient(to bottom, #51FAAA, rgba(81, 250, 170, 0))',
}));

interface FrostedCardProps extends CardProps {
  children: ReactNode;
  showAccent?: boolean;
  hoverEffect?: boolean;
  layoutId?: string;
}

const FrostedCard: React.FC<FrostedCardProps> = ({ 
  children, 
  showAccent = false, 
  hoverEffect = true,
  layoutId,
  ...props 
}) => {
  // We'll wrap with motion.div if layoutId is provided
  const CardComponent = layoutId ? 
    motion(GlassCard) : 
    GlassCard;
  
  const motionProps = layoutId ? { layoutId } : {};
  
  return (
    <CardComponent 
      {...props} 
      {...motionProps}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GradientOverlay />
      {showAccent && <AccentLine />}
      {children}
    </CardComponent>
  );
};

export default FrostedCard;