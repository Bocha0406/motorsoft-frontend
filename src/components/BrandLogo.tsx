import Image from 'next/image';

interface BrandLogoProps {
  brandName: string;
  className?: string;
}

// Маппинг брендов на URL логотипов
const brandLogos: Record<string, string> = {
  'Alfa Romeo': 'https://cdn.simpleicons.org/alfaromeo/FF0000',
  'Audi': 'https://cdn.simpleicons.org/audi/FF0000',
  'BMW': 'https://cdn.simpleicons.org/bmw/FF0000',
  'Citroën': 'https://cdn.simpleicons.org/citroen/FF0000',
  'Fiat': 'https://cdn.simpleicons.org/fiat/FF0000',
  'Jaguar': 'https://cdn.simpleicons.org/jaguar/FF0000',
  'Lamborghini': 'https://cdn.simpleicons.org/lamborghini/FF0000',
  'Land Rover': 'https://cdn.simpleicons.org/landrover/FF0000',
  'Mercedes-Benz': 'https://cdn.simpleicons.org/mercedes/FF0000',
  'Mini': 'https://cdn.simpleicons.org/mini/FF0000',
  'Opel': 'https://cdn.simpleicons.org/opel/FF0000',
  'Peugeot': 'https://cdn.simpleicons.org/peugeot/FF0000',
  'Porsche': 'https://cdn.simpleicons.org/porsche/FF0000',
  'Renault': 'https://cdn.simpleicons.org/renault/FF0000',
  'Saab': 'https://cdn.simpleicons.org/saab/FF0000',
  'Seat': 'https://cdn.simpleicons.org/seat/FF0000',
  'Škoda': 'https://cdn.simpleicons.org/skoda/FF0000',
  'Smart': 'https://cdn.simpleicons.org/smart/FF0000',
  'Volkswagen': 'https://cdn.simpleicons.org/volkswagen/FF0000',
  'Volvo': 'https://cdn.simpleicons.org/volvo/FF0000',
  'Cadillac': 'https://cdn.simpleicons.org/cadillac/FF0000',
  'Chevrolet': 'https://cdn.simpleicons.org/chevrolet/FF0000',
  'Chrysler': 'https://cdn.simpleicons.org/chrysler/FF0000',
  'Dodge': 'https://cdn.simpleicons.org/dodge/FF0000',
  'Ford': 'https://cdn.simpleicons.org/ford/FF0000',
  'Tesla': 'https://cdn.simpleicons.org/tesla/FF0000',
  'Honda': 'https://cdn.simpleicons.org/honda/FF0000',
  'Hyundai': 'https://cdn.simpleicons.org/hyundai/FF0000',
  'Infiniti': 'https://cdn.simpleicons.org/infiniti/FF0000',
  'Kia': 'https://cdn.simpleicons.org/kia/FF0000',
  'Lexus': 'https://cdn.simpleicons.org/lexus/FF0000',
  'Mazda': 'https://cdn.simpleicons.org/mazda/FF0000',
  'Mitsubishi': 'https://cdn.simpleicons.org/mitsubishi/FF0000',
  'Nissan': 'https://cdn.simpleicons.org/nissan/FF0000',
  'Subaru': 'https://cdn.simpleicons.org/subaru/FF0000',
  'Suzuki': 'https://cdn.simpleicons.org/suzuki/FF0000',
  'Toyota': 'https://cdn.simpleicons.org/toyota/FF0000',
};

export default function BrandLogo({ brandName, className = '' }: BrandLogoProps) {
  const logoUrl = brandLogos[brandName];
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
            className="w-full h-full object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            style={{ filter: 'brightness(0) saturate(100%) invert(47%) sepia(97%) saturate(2476%) hue-rotate(360deg) brightness(101%) contrast(107%)' }}
          />
        ) : (
          <div className="font-black text-6xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
            {firstLetter}
          </div>
        )}
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
