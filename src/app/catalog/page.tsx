"use client";

import { useState } from 'react';
import { brands, getBrandsByRegion, regionNames } from '@/lib/brands';
import BrandLogo from '@/components/BrandLogo';
import PriceRequestModal from '@/components/PriceRequestModal';

export default function CatalogPage() {
  const regions = ['europe', 'america', 'asia', 'china'] as const;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleBrandClick = (brandName: string) => {
    setSelectedBrand(brandName);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,69,0,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,140,0,0.1),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Каталог марок
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Нажмите на марку вашего автомобиля — откроется форма запроса стоимости с уже выбранным брендом
          </p>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {regions.map((region) => {
            const regionBrands = getBrandsByRegion(region);
            
            return (
              <div key={region} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold text-white">
                    {regionNames[region]}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {regionBrands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandClick(brand.name)}
                      className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 text-left"
                    >
                      {/* Brand Logo */}
                      <div className="aspect-square mb-3">
                        <BrandLogo brandName={brand.name} className="w-full h-full" />
                      </div>
                      
                      <h3 className="text-center font-semibold text-white group-hover:text-orange-500 transition-colors text-sm">
                        {brand.name}
                      </h3>

                      {/* Hover effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-all duration-300 pointer-events-none"></div>
                    </button>
                  ))}
                </div>

                {region === 'china' && (
                  <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-orange-400 text-sm">
                      🇨🇳 Работаем с китайскими брендами: полная диагностика, Stage 1-3, ECO-тюнинг
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Не нашли свою марку?
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Свяжитесь с нами — работаем практически со всеми марками автомобилей!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:motorsoft@ya.ru"
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-center"
              >
                ✉️ motorsoft@ya.ru
              </a>
              <a
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 text-center"
              >
                💬 Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Price Request Modal */}
      <PriceRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        initialBrand={selectedBrand}
      />
    </div>
  );
}
