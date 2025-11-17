import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = true,
  animated = true,
  className = '',
  ...props
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  const baseCard = 'bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden';
  const hoverCard = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <motion.div
      className={`${baseCard} ${hoverCard} ${className}`}
      variants={animated ? containerVariants : {}}
      initial={animated ? 'hidden' : 'visible'}
      whileInView={animated ? 'visible' : {}}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={hover ? { y: -4 } : {}}
      {...(props as HTMLMotionProps<'div'>)}
    >
      {children}
    </motion.div>
  );
};
