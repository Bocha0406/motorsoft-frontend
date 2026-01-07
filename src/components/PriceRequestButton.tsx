"use client";

import { useState } from "react";
import PriceRequestModal from "./PriceRequestModal";

interface PriceRequestButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}

export default function PriceRequestButton({
  className = "",
  variant = "primary",
  size = "md",
  children,
}: PriceRequestButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseClasses = "inline-flex items-center justify-center gap-2 font-bold tracking-widest uppercase transition-all cursor-pointer";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: "btn-gradient",
    secondary: "bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 text-white hover:text-amber-500 rounded-lg",
    outline: "border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black rounded-lg",
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        {children || (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Запросить цену
          </>
        )}
      </button>
      
      <PriceRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
