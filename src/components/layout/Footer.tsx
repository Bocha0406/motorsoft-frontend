import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] text-gray-400 border-t border-white/5">
      {/* Gradient line on top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
                <span className="text-black font-black text-lg">M</span>
              </div>
              <span className="text-xl font-black tracking-[0.1em] uppercase text-white">
                MOTOR<span className="text-amber-500">SOFT</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 tracking-wide leading-relaxed">
              Профессиональный чип-тюнинг с 2014 года. Более 7000 прошивок в
              базе. Гарантия качества и поддержка 24/7.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs tracking-widest uppercase text-gray-500">Online 24/7</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-amber-500 font-bold text-xs tracking-[0.2em] uppercase mb-6">Каталог</h3>
            <ul className="space-y-3">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="hover:text-amber-500 transition text-sm tracking-wide"
                  >
                    <span className="opacity-50 mr-2">{cat.icon}</span> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-amber-500 font-bold text-xs tracking-[0.2em] uppercase mb-6">Информация</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/price"
                  className="hover:text-amber-500 transition text-sm tracking-wide"
                >
                  Прайс-лист
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-500 transition text-sm tracking-wide"
                >
                  О компании
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-amber-500 transition text-sm tracking-wide"
                >
                  Частые вопросы
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="hover:text-amber-500 transition text-sm tracking-wide"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-amber-500 transition text-sm tracking-wide"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-amber-500 font-bold text-xs tracking-[0.2em] uppercase mb-6">Контакты</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+79000000000"
                  className="hover:text-amber-500 transition text-sm flex items-center gap-3 tracking-wide"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  +7 (900) 000-00-00
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@motorsoft.pro"
                  className="hover:text-amber-500 transition text-sm flex items-center gap-3 tracking-wide"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  info@motorsoft.pro
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/MotorSoftBot"
                  target="_blank"
                  className="hover:text-amber-500 transition text-sm flex items-center gap-3 tracking-wide"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  Telegram Bot
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 tracking-wide">
            © 2014–{new Date().getFullYear()} MOTORSOFT. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="text-gray-500 hover:text-amber-500 transition text-xs tracking-widest uppercase"
            >
              Telegram
            </a>
            <a
              href="https://wa.me/79000000000"
              target="_blank"
              className="text-gray-500 hover:text-green-500 transition text-xs tracking-widest uppercase"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
