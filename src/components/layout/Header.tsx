"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { categories } from "@/lib/categories";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-xl border-b border-white/5' 
        : 'bg-transparent'
    }`}>
      {/* Top bar - hidden when scrolled */}
      <div className={`border-b border-white/5 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'py-2 opacity-100'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center text-xs tracking-wide">
          <div className="flex items-center gap-6 text-gray-400">
            <a href="tel:+79000000000" className="hover:text-amber-500 transition">
              +7 (900) 000-00-00
            </a>
            <a href="mailto:info@motorsoft.pro" className="hover:text-amber-500 transition">
              info@motorsoft.pro
            </a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400">Online</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <span className="text-black font-black text-lg">M</span>
            </div>
            <span className="text-xl font-black tracking-[0.1em] uppercase">
              MOTOR<span className="text-amber-500">SOFT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm tracking-widest uppercase text-gray-300 hover:text-amber-500 transition font-medium">
              Главная
            </Link>
            <div className="relative group">
              <button className="text-sm tracking-widest uppercase text-gray-300 hover:text-amber-500 transition font-medium flex items-center gap-1">
                Каталог
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px] overflow-hidden">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    className="block px-5 py-3 hover:bg-amber-500/10 text-gray-300 hover:text-amber-500 transition text-sm tracking-wide border-b border-white/5 last:border-0"
                  >
                    <span className="mr-2">{cat.icon}</span> {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/price" className="text-sm tracking-widest uppercase text-gray-300 hover:text-amber-500 transition font-medium">
              Прайс
            </Link>
            <Link href="/about" className="text-sm tracking-widest uppercase text-gray-300 hover:text-amber-500 transition font-medium">
              О нас
            </Link>
            <Link href="/faq" className="text-sm tracking-widest uppercase text-gray-300 hover:text-amber-500 transition font-medium">
              FAQ
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="btn-gradient inline-flex items-center gap-2 text-sm px-6 py-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="tracking-widest uppercase font-bold">Start</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:border-amber-500/50 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/5 pt-4">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className="py-3 px-4 rounded-lg hover:bg-white/5 text-sm tracking-widest uppercase font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <div className="py-3 px-4">
                <span className="text-gray-500 text-xs tracking-widest uppercase">Каталог</span>
                <div className="mt-2 flex flex-col gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog/${cat.slug}`}
                      className="py-2 px-4 rounded-lg hover:bg-amber-500/10 text-gray-300 hover:text-amber-500 transition text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">{cat.icon}</span> {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/price"
                className="py-3 px-4 rounded-lg hover:bg-white/5 text-sm tracking-widest uppercase font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Прайс
              </Link>
              <Link
                href="/about"
                className="py-3 px-4 rounded-lg hover:bg-white/5 text-sm tracking-widest uppercase font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                О нас
              </Link>
              <Link
                href="/faq"
                className="py-3 px-4 rounded-lg hover:bg-white/5 text-sm tracking-widest uppercase font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <a
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="btn-gradient text-center py-3 mt-4 text-sm tracking-widest uppercase font-bold"
              >
                🚀 Заказать прошивку
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
