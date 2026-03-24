import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'light';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  // Base: 8px rounded (rounded-lg), font-medium
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";
  
  const variants = {
    // Brand Blue #1F6AE1 matches primary-600 config
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20 focus:ring-primary-500 border border-transparent",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-md shadow-secondary-500/20 focus:ring-secondary-500 border border-transparent",
    outline: "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    light: "bg-white text-primary-800 hover:bg-slate-100 shadow-md focus:ring-primary-500 border border-transparent",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
