import React, { useCallback } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from 'react';

interface ParticlesEmbersProps {
  direction: 'up' | 'down';
}

const ParticlesEmbers: React.FC<ParticlesEmbersProps> = ({ direction }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      initParticles();
    }
  }, [initialized]);

  const initParticles = useCallback(async () => {
    await initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
    setInitialized(true);
  }, []);

  if (!initialized) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '100%',
        [direction === 'up' ? 'bottom' : 'top']: 0,
        pointerEvents: 'none',
      }}
    >
      <Particles
        options={{
          particles: {
            number: {
              value: 150,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#51FAAA"
            },
            shape: {
              type: "polygon",
              polygon: {
                sides: 6,
                density: 20
              }
            },
            opacity: {
              value: 0.5,
              random: true,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.1,
                sync: false
              }
            },
            move: {
              enable: true,
              speed: 4,
              direction: "top",
              random: true,
              straight: false,
              outModes: {
                top: "destroy",
                bottom: "none",
                default: "destroy"
              },
              attract: {
                enable: false
              }
            }
          },
          interactivity: {
            detectsOn: "canvas",
            events: {
              onHover: {
                enable: false
              },
              resize: true
            }
          },
          detectRetina: true,
          background: {
            color: "transparent"
          },
          fullScreen: {
            enable: false,
            zIndex: 0
          },
          emitters: {
            direction: "top",
            position: {
              x: 50,
              y: 100
            },
            rate: {
              delay: 0.1,
              quantity: 2
            },
            size: {
              width: 100,
              height: 0
            }
          }
        }}
      />
    </div>
  );
};

export default ParticlesEmbers;