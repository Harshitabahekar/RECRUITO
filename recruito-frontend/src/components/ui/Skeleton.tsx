import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  count?: number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  count = 1,
  circle = false,
  className = '',
}) => {
  const skeletons = Array(count).fill(0);

  return (
    <>
      {skeletons.map((_, i) => (
        <motion.div
          key={i}
          className={`${width} ${height} ${circle ? 'rounded-full' : 'rounded-lg'} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 ${className}`}
          animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        />
      ))}
    </>
  );
};
