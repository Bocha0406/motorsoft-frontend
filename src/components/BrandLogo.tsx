interface BrandLogoProps {
  brandName: string;
  className?: string;
}

// Маппинг брендов на URL логотипов из Simple Icons
// Примечание: некоторые бренды отсутствуют в Simple Icons, для них будет показана первая буква
const brandLogos: Record<string, string> = {
  // Европа
  'Alfa Romeo': 'https://cdn.simpleicons.org/alfaromeo/ff4500',
  'Audi': 'https://cdn.simpleicons.org/audi/ff4500',
  'BMW': 'https://cdn.simpleicons.org/bmw/ff4500',
  'Citroën': 'https://cdn.simpleicons.org/citroen/ff4500',
  'Fiat': 'https://cdn.simpleicons.org/fiat/ff4500',
  // Jaguar, Land Rover, Saab - нет в Simple Icons
  'Lamborghini': 'https://cdn.simpleicons.org/lamborghini/ff4500',
  'Mercedes-Benz': 'https://cdn.simpleicons.org/mercedes/ff4500',
  'Mini': 'https://cdn.simpleicons.org/mini/ff4500',
  'Opel': 'https://cdn.simpleicons.org/opel/ff4500',
  'Peugeot': 'https://cdn.simpleicons.org/peugeot/ff4500',
  'Porsche': 'https://cdn.simpleicons.org/porsche/ff4500',
  'Renault': 'https://cdn.simpleicons.org/renault/ff4500',
  'Seat': 'https://cdn.simpleicons.org/seat/ff4500',
  'Škoda': 'https://cdn.simpleicons.org/skoda/ff4500',
  'Smart': 'https://cdn.simpleicons.org/smart/ff4500',
  'Volkswagen': 'https://cdn.simpleicons.org/volkswagen/ff4500',
  'Volvo': 'https://cdn.simpleicons.org/volvo/ff4500',
  
  // Америка
  'Cadillac': 'https://cdn.simpleicons.org/cadillac/ff4500',
  'Chevrolet': 'https://cdn.simpleicons.org/chevrolet/ff4500',
  // Chrysler, Dodge - нет в Simple Icons
  'Ford': 'https://cdn.simpleicons.org/ford/ff4500',
  'Jeep': 'https://cdn.simpleicons.org/jeep/ff4500',
  'Tesla': 'https://cdn.simpleicons.org/tesla/ff4500',
  
  // Азия
  'Honda': 'https://cdn.simpleicons.org/honda/ff4500',
  'Hyundai': 'https://cdn.simpleicons.org/hyundai/ff4500',
  'Infiniti': 'https://cdn.simpleicons.org/infiniti/ff4500',
  // Isuzu, Ssangyong - нет в Simple Icons
  'Kia': 'https://cdn.simpleicons.org/kia/ff4500',
  'Lexus': 'https://cdn.simpleicons.org/lexus/ff4500',
  'Mazda': 'https://cdn.simpleicons.org/mazda/ff4500',
  'Mitsubishi': 'https://cdn.simpleicons.org/mitsubishi/ff4500',
  'Nissan': 'https://cdn.simpleicons.org/nissan/ff4500',
  'Subaru': 'https://cdn.simpleicons.org/subaru/ff4500',
  'Suzuki': 'https://cdn.simpleicons.org/suzuki/ff4500',
  'Toyota': 'https://cdn.simpleicons.org/toyota/ff4500',
};

// SVG логотипы для брендов, которых нет в Simple Icons
const customLogos: Record<string, string> = {
  // Jaguar - стилизованный логотип
  'Jaguar': `<svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="30" font-family="serif" font-size="20" font-weight="bold" fill="#ff4500" text-anchor="middle" font-style="italic">JAGUAR</text>
  </svg>`,
  // Land Rover
  'Land Rover': `<svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="20" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ff4500" text-anchor="middle">LAND</text>
    <text x="50" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ff4500" text-anchor="middle">ROVER</text>
  </svg>`,
  // Mercedes-Benz - звезда
  'Mercedes-Benz': `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="#ff4500" stroke-width="3" fill="none"/>
    <path d="M50 10 L50 50 L20 80" stroke="#ff4500" stroke-width="3" fill="none"/>
    <path d="M50 50 L80 80" stroke="#ff4500" stroke-width="3" fill="none"/>
    <path d="M50 50 L50 10" stroke="#ff4500" stroke-width="3" fill="none"/>
  </svg>`,
  // Dodge
  'Dodge': `<svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="35" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ff4500" text-anchor="middle">DODGE</text>
  </svg>`,
  // Chrysler
  'Chrysler': `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="60" y="35" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ff4500" text-anchor="middle">CHRYSLER</text>
  </svg>`,
  // Isuzu
  'Isuzu': `<svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="35" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ff4500" text-anchor="middle">ISUZU</text>
  </svg>`,
  // Ssangyong
  'Ssangyong': `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="60" y="35" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ff4500" text-anchor="middle">SSANGYONG</text>
  </svg>`,
  // Saab
  'Saab': `<svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="35" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ff4500" text-anchor="middle">SAAB</text>
  </svg>`,
};

export default function BrandLogo({ brandName, className = '' }: BrandLogoProps) {
  const logoUrl = brandLogos[brandName];
  const customLogo = customLogos[brandName];
  const firstLetter = brandName.charAt(0).toUpperCase();
  
  return (
    <div className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 flex items-center justify-center overflow-hidden group ${className}`}>
      {/* Gradient Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Brand Logo or Letter */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-6">
        {logoUrl ? (
          <img 
            src={logoUrl}
            alt={brandName}
            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
            onError={(e) => {
              // Fallback to letter if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'font-black text-5xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent';
                fallback.textContent = brandName.charAt(0).toUpperCase();
                parent.appendChild(fallback);
              }
            }}
          />
        ) : customLogo ? (
          <div 
            className="w-full h-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
            dangerouslySetInnerHTML={{ __html: customLogo }}
          />
        ) : (
          <div className="font-black text-5xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
            {firstLetter}
          </div>
        )}
      </div>
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`grid-${brandName.replace(/\s+/g, '-')}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-orange-500/50"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${brandName.replace(/\s+/g, '-')})`} />
        </svg>
      </div>
      
      {/* Corner Accent */}
      <div className="absolute top-2 right-2 w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 0L24 24L0 0H24Z" fill="url(#cornerGradient)" opacity="0.6"/>
          <defs>
            <linearGradient id="cornerGradient" x1="24" y1="0" x2="0" y2="24">
              <stop offset="0%" stopColor="#ff4500" />
              <stop offset="100%" stopColor="#ff6b00" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_rgba(255,69,0,0.2)]"></div>
    </div>
  );
}
