import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  description,
  children,
  className = '',
  ...props
}) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-500',
      iconBg: 'bg-blue-100',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      icon: 'text-green-500',
      iconBg: 'bg-green-100',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      icon: 'text-yellow-500',
      iconBg: 'bg-yellow-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: 'text-red-500',
      iconBg: 'bg-red-100',
    },
  };

  const style = styles[type];

  const icons = {
    info: <Info size={20} />,
    success: <CheckCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    error: <AlertCircle size={20} />,
  };

  return (
    <motion.div
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg p-4 flex gap-3 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${style.iconBg} ${style.icon} rounded-lg p-2 flex-shrink-0`}>
        {icons[type]}
      </div>
      <div className="flex-1">
        {title && <h3 className="font-semibold">{title}</h3>}
        {description && <p className="text-sm opacity-90">{description}</p>}
        {children}
      </div>
    </motion.div>
  );
};
