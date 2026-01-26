import React from 'react';
import { cn } from '../../lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  noPadding = false,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        // Base styles
        "relative overflow-hidden rounded-xl transition-all duration-200",
        // Glassmorphism effect (Dark mode dominant)
        "bg-slate-800/40 backdrop-blur-md border border-white/5 shadow-xl shadow-black/20",
        // Hover effect optional
        // "hover:bg-slate-800/50 hover:border-white/10", 
        !noPadding && "p-6",
        className
      )} 
      {...props}
    >
      {/* Optional: subtil bruit de fond ou dégradé interne pour donner de la texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Contenu avec z-index pour être au dessus du gradient */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};