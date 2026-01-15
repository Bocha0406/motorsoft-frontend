"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import TelegramButton from "@/components/TelegramButton";

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
            <div className="relative w-10 h-10">
              <Image
                src="/logo-m.png"
                alt="MotorSoft"
                width={40}
                height={40}
                className="object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.7)] transition-all"
              />
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
            <Link href="/catalog" className="text-sm tracking-widest uppercase text-gray-300 hover:text-amber-500 transition font-medium">
              Каталог
            </Link>
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
          <div className="hidden md:flex items-center gap-3">
            <TelegramButton variant="secondary" size="sm">
              💬 TELEGRAM
            </TelegramButton>
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient inline-flex items-center gap-2 text-sm px-6 py-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.144.12.1.153.235.168.332.015.097.033.318.019.49z"/>
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
              <Link
                href="/catalog"
                className="py-3 px-4 rounded-lg hover:bg-white/5 text-sm tracking-widest uppercase font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </Link>
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
              <div className="mt-4 flex flex-col gap-3">
                <TelegramButton variant="outline" size="md" className="w-full">
                  💬 Открыть Telegram бота
                </TelegramButton>
                <a
                  href="https://t.me/MotorSoftBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gradient text-center py-3 text-sm tracking-widest uppercase font-bold cursor-pointer"
                >
                  🚀 Заказать прошивку
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
