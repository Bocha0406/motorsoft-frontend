import Link from "next/link";

export const metadata = {
  title: "О компании | MotorSoft",
  description: "Профессиональный чип-тюнинг с 2014 года. Более 7000 прошивок в базе.",
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white">
            Главная
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white">О нас</span>
        </nav>

        <h1 className="text-4xl font-bold mb-8">О компании MotorSoft</h1>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-lg text-gray-300 mb-6">
              <strong className="text-white">MotorSoft</strong> — это команда
              профессионалов в области чип-тюнинга с опытом работы более 10 лет.
              Мы специализируемся на модификации прошивок ЭБУ для всех типов
              транспорта.
            </p>
            <p className="text-gray-400 mb-6">
              Наша миссия — сделать чип-тюнинг доступным и удобным. Мы
              разработали автоматизированную систему, которая позволяет получить
              качественную прошивку всего за несколько минут.
            </p>
            <p className="text-gray-400 mb-6">
              Мы работаем с более чем 200 марками автомобилей и 40 типами ЭБУ.
              Наша база данных содержит более 7000 калибровок, которая
              постоянно пополняется.
            </p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Наши преимущества</h2>
            <ul className="space-y-4">
              {[
                {
                  icon: "⚡",
                  title: "Скорость",
                  desc: "Готовая прошивка за 15-30 минут",
                },
                {
                  icon: "🔒",
                  title: "Безопасность",
                  desc: "Все файлы проверяются перед отправкой",
                },
                {
                  icon: "💰",
                  title: "Честные цены",
                  desc: "Прозрачное ценообразование без скрытых платежей",
                },
                {
                  icon: "🛡️",
                  title: "Гарантия",
                  desc: "1 год гарантии на все работы",
                },
                {
                  icon: "🔄",
                  title: "Доработка",
                  desc: "Бесплатные правки в течение 7 дней",
                },
                {
                  icon: "📞",
                  title: "Поддержка 24/7",
                  desc: "Всегда на связи в Telegram",
                },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "2014", label: "Год основания" },
            { value: "7000+", label: "Прошивок в базе" },
            { value: "2783", label: "Довольных клиентов" },
            { value: "200+", label: "Марок авто" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-400">
                {stat.value}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team/Equipment */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Оборудование и ПО</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "💻",
                title: "WinOLS",
                desc: "Профессиональное ПО для калибровки",
              },
              {
                icon: "🔧",
                title: "CMD Flash",
                desc: "Оборудование для чтения/записи ЭБУ",
              },
              {
                icon: "📊",
                title: "Dyno Stand",
                desc: "Диностенд для проверки результатов",
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Отправьте файл прошивки в Telegram и получите результат уже через
            15-30 минут
          </p>
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition inline-block hover:bg-gray-100"
          >
            🤖 Связаться в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
