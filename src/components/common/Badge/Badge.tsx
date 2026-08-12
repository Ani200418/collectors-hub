import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm' }) => {
  return (
    <span className={`badge badge--${variant} badge--${size}`}>
      {children}
    </span>
  );
};

export default Badge;
