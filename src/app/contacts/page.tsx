import Link from "next/link";

export const metadata = {
  title: "Контакты | MotorSoft",
  description: "Свяжитесь с нами для заказа чип-тюнинга",
};

export default function ContactsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white">
            Главная
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white">Контакты</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8">Контакты</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <p className="text-gray-400 mb-8">
              Свяжитесь с нами любым удобным способом. Мы работаем 24/7 и
              отвечаем на все обращения.
            </p>

            <div className="space-y-6">
              {/* Telegram */}
              <a
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition group"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-blue-400 transition">
                    Telegram Bot
                  </h3>
                  <p className="text-gray-400">@MotorSoftBot — основной канал связи</p>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+79000000000"
                className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition group"
              >
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-2xl">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-green-400 transition">
                    Телефон
                  </h3>
                  <p className="text-gray-400">+7 (900) 000-00-00</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@motorsoft.pro"
                className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition group"
              >
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-2xl">
                  ✉️
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-red-400 transition">
                    Email
                  </h3>
                  <p className="text-gray-400">info@motorsoft.pro</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/79000000000"
                target="_blank"
                className="flex items-center gap-4 bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition group"
              >
                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-2xl">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-green-400 transition">
                    WhatsApp
                  </h3>
                  <p className="text-gray-400">+7 (900) 000-00-00</p>
                </div>
              </a>
            </div>
          </div>

          {/* Info Card */}
          <div className="space-y-6">
            {/* Working hours */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🕐</span> Режим работы
              </h3>
              <p className="text-gray-400">
                Мы работаем <strong className="text-white">24/7</strong> без
                выходных и праздников. Среднее время ответа в Telegram — 5
                минут.
              </p>
            </div>

            {/* Location */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span> Расположение
              </h3>
              <p className="text-gray-400">
                Мы работаем удалённо по всей России и СНГ. Нет необходимости
                приезжать — просто отправьте файл через Telegram.
              </p>
            </div>

            {/* Payment */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">💳</span> Способы оплаты
              </h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Банковские карты (Visa, MasterCard, МИР)</li>
                <li>• СБП (Система быстрых платежей)</li>
                <li>• Криптовалюта (BTC, USDT)</li>
                <li>• Баланс аккаунта</li>
              </ul>
            </div>

            {/* Requisites */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🏢</span> Реквизиты
              </h3>
              <p className="text-gray-400 text-sm">
                ИП Иванов Иван Иванович<br />
                ИНН: 000000000000<br />
                ОГРНИП: 000000000000000
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Самый быстрый способ связи
          </h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Напишите нашему Telegram боту и получите ответ в течение 5 минут
          </p>
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition inline-block hover:bg-gray-100"
          >
            🤖 Написать в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
