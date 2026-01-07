interface BrandLogoProps {
  brandName: string;
  className?: string;
}

export default function BrandLogo({ brandName, className = '' }: BrandLogoProps) {
  const firstLetter = brandName.charAt(0).toUpperCase();
  
  return (
    <div className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 flex items-center justify-center overflow-hidden group ${className}`}>
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Car Icon with Brand Letter */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        {/* Car SVG Icon */}
        <svg 
          className="w-16 h-16 text-orange-500 drop-shadow-[0_0_15px_rgba(255,69,0,0.4)] group-hover:scale-110 transition-transform duration-300" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
        
        {/* Brand Letter */}
        <div className="font-black text-3xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent tracking-wider">
          {firstLetter}
        </div>
      </div>
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${brandName}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500/50"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${brandName})`} />
        </svg>
      </div>
      
      {/* Speed Lines Effect */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.3"/>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.5"/>
          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.3"/>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff4500" stopOpacity="0"/>
              <stop offset="50%" stopColor="#ff4500" stopOpacity="1"/>
              <stop offset="100%" stopColor="#ff4500" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Corner Accent */}
      <div className="absolute top-2 right-2 w-6 h-6">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 0L24 24L0 0H24Z" fill="url(#cornerGradient)" opacity="0.4"/>
          <defs>
            <linearGradient id="cornerGradient" x1="24" y1="0" x2="0" y2="24">
              <stop offset="0%" stopColor="#ff4500" />
              <stop offset="100%" stopColor="#ff6b00" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_rgba(255,69,0,0.3)]"></div>
    </div>
  );
}
