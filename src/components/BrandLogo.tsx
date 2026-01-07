interface BrandLogoProps {
  brandName: string;
  className?: string;
}

export default function BrandLogo({ brandName, className = '' }: BrandLogoProps) {
  const firstLetter = brandName.charAt(0).toUpperCase();
  
  return (
    <div className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 flex items-center justify-center overflow-hidden ${className}`}>
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Brand Letter/Logo */}
      <div className="relative z-10 font-black text-6xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,69,0,0.5)]">
        {firstLetter}
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500/30"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Corner Accent */}
      <div className="absolute top-2 right-2 w-8 h-8">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 0L32 32L0 0H32Z" fill="url(#cornerGradient)" opacity="0.3"/>
          <defs>
            <linearGradient id="cornerGradient" x1="32" y1="0" x2="0" y2="32">
              <stop offset="0%" stopColor="#ff4500" />
              <stop offset="100%" stopColor="#ff8c00" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
