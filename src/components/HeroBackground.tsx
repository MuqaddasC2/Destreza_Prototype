import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { Vector2 } from 'three';
import { useTheme } from '@mui/material';
import { colors } from '../theme/theme';

const mouse = new Vector2();

const Polyhedron = ({ position = [0, 0, 0], scale = 1, opacity = 0.6, index = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialPosition = useRef(position);
  const theme = useTheme();

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    
    // Update mouse position with dampening for smoother movement
    mouse.x = pointer.x * 0.5;
    mouse.y = pointer.y * 0.5;
    
    // Calculate position offset based on mouse movement
    const offsetX = mouse.x * (0.2 + index * 0.05);
    const offsetY = mouse.y * (0.2 + index * 0.05);
    
    // Update position with smooth interpolation
    meshRef.current.position.x = initialPosition.current[0] + offsetX;
    meshRef.current.position.y = initialPosition.current[1] + offsetY;
    
    // Rotate based on time
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshPhongMaterial
        color={colors.accent.primary}
        opacity={opacity}
        transparent
        depthWrite={false}
      />
      <Edges
        scale={1}
        threshold={15}
        color={colors.accent.primary}
      />
    </mesh>
  );
};

const HeroBackground: React.FC = () => {
  // Generate random positions for multiple polyhedrons
  const polyhedrons = [
    { position: [0, 0, 6], scale: 1, opacity: 0.4 },
    { position: [-5, 3, 4], scale: 0.7, opacity: 0.3 },
    { position: [5, -2, 3], scale: 0.5, opacity: 0.2 },
    { position: [-3, -4, 5], scale: 0.6, opacity: 0.15 },
    { position: [4, 4, 2], scale: 0.4, opacity: 0.2 },
    { position: [-4, 0, 3], scale: 0.5, opacity: 0.25 },
    { position: [3, -3, 4], scale: 0.45, opacity: 0.2 },
    { position: [-6, -2, 3], scale: 0.8, opacity: 0.15 }, // Bottom left
    { position: [6, 2, 3], scale: 0.8, opacity: 0.15 }    // Top right
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      {polyhedrons.map((props, index) => (
        <Polyhedron key={index} {...props} index={index} />
      ))}
    </Canvas>
  );
};

export default HeroBackground;