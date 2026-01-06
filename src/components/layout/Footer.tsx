import Link from "next/link";
import { categories } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">⚡</span>
              <span className="text-2xl font-bold text-white">
                Motor<span className="text-zinc-400">Soft</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              Профессиональный чип-тюнинг с 2014 года. Более 7000 прошивок в
              базе. Гарантия качества и поддержка 24/7.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Каталог</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/catalog/${cat.slug}`}
                    className="hover:text-zinc-300 transition text-sm"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/price"
                  className="hover:text-zinc-300 transition text-sm"
                >
                  Прайс-лист
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-zinc-300 transition text-sm"
                >
                  О компании
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-zinc-300 transition text-sm"
                >
                  Частые вопросы
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="hover:text-zinc-300 transition text-sm"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-zinc-300 transition text-sm"
                >
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+79000000000"
                  className="hover:text-zinc-300 transition text-sm flex items-center gap-2"
                >
                  📞 +7 (900) 000-00-00
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@motorsoft.pro"
                  className="hover:text-zinc-300 transition text-sm flex items-center gap-2"
                >
                  ✉️ info@motorsoft.pro
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/MotorSoftBot"
                  target="_blank"
                  className="hover:text-zinc-300 transition text-sm flex items-center gap-2"
                >
                  🤖 Telegram Bot
                </a>
              </li>
              <li className="text-sm text-gray-400">
                🕐 Работаем: 24/7
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2014–{new Date().getFullYear()} MotorSoft. Все права защищены.
          </p>
          <div className="flex gap-4">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="text-gray-400 hover:text-zinc-300 transition"
            >
              Telegram
            </a>
            <a
              href="https://wa.me/79000000000"
              target="_blank"
              className="text-gray-400 hover:text-green-400 transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
