import React from 'react';
import { motion } from 'framer-motion';

const BubbleAnimation = () => {
  const bubbles = Array.from({ length: 30 });

  const generateGradient = (isGolden) => {
    if (isGolden) {
      return 'radial-gradient(circle at 30% 30%, #ffd700 0%, #e7c568 50%, #daa520 100%)';
    }
    return 'radial-gradient(circle at 30% 30%, #6ba4b8 0%, #335262 50%, #1e3d4a 100%)';
  };

  return (
    <div className="fixed bottom-0 right-0 w-32 h-96 overflow-hidden pointer-events-none">
      {bubbles.map((_, index) => {
        const isGolden = Math.random() > 0.6;
        const size = Math.random() * 24 + 12;
        const startX = Math.random() * 24 + 8;
        
        return (
          <motion.div
            key={index}
            className="absolute rounded-full backdrop-blur-sm"
            style={{
              width: size,
              height: size,
              background: generateGradient(isGolden),
              boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.1), 
                         inset 2px 2px 4px rgba(255,255,255,0.2)`,
            }}
            initial={{
              x: startX,
              y: 400,
              scale: 0.3,
              opacity: 0,
            }}
            animate={{
              y: -100,
              x: [startX, startX + Math.sin(index) * 15],
              scale: [0.3, 1, 0.8],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              repeatType: 'loop',
              ease: [0.43, 0.13, 0.23, 0.96],
              delay: Math.random() * 4,
            }}
          />
        );
      })}
    </div>
  );
};

export default BubbleAnimation;