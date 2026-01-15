"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/lib/categories";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-800 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+79000000000" className="hover:text-amber-500">
              +7 (900) 000-00-00
            </a>
            <a href="mailto:info@motorsoft.pro" className="hover:text-amber-500">
              info@motorsoft.pro
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="bg-amber-500 text-black px-3 py-1 rounded font-medium hover:bg-amber-400 transition"
            >
              🤖 Telegram Bot
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            <span className="text-2xl font-bold tracking-tight">
              MOTOR<span className="text-amber-500">SOFT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-amber-500 transition">
              Главная
            </Link>
            <div className="relative group">
              <button className="hover:text-amber-500 transition flex items-center gap-1">
                Каталог <span>▼</span>
              </button>
              <div className="absolute top-full left-0 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    className="block px-4 py-2 hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/price" className="hover:text-amber-500 transition">
              Прайс
            </Link>
            <Link href="/about" className="hover:text-amber-500 transition">
              О нас
            </Link>
            <Link href="/faq" className="hover:text-amber-500 transition">
              FAQ
            </Link>
            <Link href="/contacts" className="hover:text-amber-500 transition">
              Контакты
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="bg-amber-500 text-black px-6 py-2 rounded font-semibold hover:bg-amber-400 transition uppercase text-sm tracking-wide"
            >
              Заказать прошивку
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="py-2 hover:text-amber-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <div className="py-2">
                <span className="text-gray-400">Каталог:</span>
                <div className="ml-4 mt-2 flex flex-col gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/catalog/${cat.slug}`}
                      className="py-1 hover:text-amber-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/price"
                className="py-2 hover:text-amber-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Прайс
              </Link>
              <Link
                href="/about"
                className="py-2 hover:text-amber-500"
                onClick={() => setIsMenuOpen(false)}
              >
                О нас
              </Link>
              <Link
                href="/faq"
                className="py-2 hover:text-amber-500"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/contacts"
                className="py-2 hover:text-amber-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
              <a
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="bg-amber-500 text-black text-center py-2 rounded mt-2 font-semibold"
              >
                🤖 Заказать в Telegram
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
