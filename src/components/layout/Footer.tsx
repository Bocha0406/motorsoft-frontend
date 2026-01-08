import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] text-gray-400 mt-8">
      <div className="container mx-auto px-6 pt-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo-m.png"
                  alt="MotorSoft"
                  width={40}
                  height={40}
                  className="object-contain drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(245,158,11,0.7)] transition-all"
                />
              </div>
              <span className="text-xl font-black tracking-[0.1em] uppercase text-white">
                MOTOR<span className="text-amber-500">SOFT</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 tracking-wide leading-relaxed">
              Профессиональный чип-тюнинг с 2006 года. Более 20000+ прошивок в
              базе. Гарантия качества и техподдержка.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs tracking-widest uppercase text-gray-500">ONLINE</span>
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
            <p className="text-xs text-gray-400 mb-4 tracking-wide">Приглашаем к сотрудничеству!</p>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:motorsoft@ya.ru"
                  className="hover:text-amber-500 transition text-sm flex items-center gap-3 tracking-wide"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  motorsoft@ya.ru
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/MotorSoftBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-500 transition text-sm flex items-center gap-3 tracking-wide cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.144.12.1.153.235.168.332.015.097.033.318.019.49z"/>
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
            © 2006–{new Date().getFullYear()} MOTORSOFT. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-amber-500 transition text-xs tracking-widest uppercase cursor-pointer"
            >
              Telegram
            </a>
            <a
              href="https://wa.me/78612435620"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-500 transition text-xs tracking-widest uppercase cursor-pointer"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
