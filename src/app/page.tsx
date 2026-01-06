import Link from "next/link";
import { mainCategories, requestCategories } from "@/lib/categories";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-zinc-700/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Профессиональный{" "}
              <span className="gradient-text">чип-тюнинг</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Увеличение мощности до <strong className="text-white">50%</strong>, 
              отключение экологии, индивидуальная калибровка. 
              <br className="hidden md:block" />
              Более <strong className="text-zinc-300">7000 прошивок</strong> в базе. 
              Работаем с 2014 года.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="btn-primary text-lg px-10 py-5"
              >
                🤖 Заказать в Telegram
              </a>
              <Link
                href="/price"
                className="bg-white/10 hover:bg-white/20 backdrop-blur px-10 py-5 rounded-xl font-semibold text-lg transition text-center border border-white/20"
              >
                📋 Посмотреть прайс
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto">
            {[
              { value: "7000+", label: "Прошивок в базе" },
              { value: "2783", label: "Довольных клиентов" },
              { value: "10+", label: "Лет опыта" },
              { value: "24/7", label: "Поддержка" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-zinc-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories - Through Database */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✓ Автоматически через базу
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Легковые авто и <span className="gradient-text">джипы</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Более 7000 готовых прошивок. Отправьте файл — получите результат за 15-30 минут
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog/${cat.slug}`}
                className="group card hover:border-green-500/50 text-center"
              >
                <div className="text-7xl mb-5">{cat.icon}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-green-400 transition">
                  {cat.name}
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">{cat.description}</p>
                <div className="mt-6 inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-medium">
                  Выбрать марку →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Request Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              📞 По запросу
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Спецтехника и <span className="gradient-text">водный транспорт</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Индивидуальная работа с каждым запросом. Напишите нам — рассчитаем стоимость
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {requestCategories.map((cat) => (
              <a
                key={cat.id}
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="group card hover:border-orange-500/50 text-center"
              >
                <div className="text-6xl mb-4">{cat.icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-sm">{cat.description}</p>
                <div className="mt-4 text-orange-400 text-sm font-medium">
                  Написать →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Наши <span className="gradient-text">услуги</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Полный спектр услуг по модификации прошивок ЭБУ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "⚡",
                title: "Stage 1",
                subtitle: "Базовый тюнинг",
                desc: "Увеличение мощности до 30% без аппаратных изменений",
                features: [
                  "Оптимизация топливных карт",
                  "Коррекция углов зажигания",
                  "Увеличение давления турбины",
                ],
                price: "от 8 000 ₽",
              },
              {
                icon: "🔥",
                title: "Stage 2",
                subtitle: "Продвинутый тюнинг",
                desc: "Максимальная производительность с модификациями",
                features: [
                  "Удаление катализатора",
                  "Даунпайп / выхлоп",
                  "Впускная система",
                ],
                price: "от 15 000 ₽",
                popular: true,
              },
              {
                icon: "🌿",
                title: "Экология",
                subtitle: "Отключение систем",
                desc: "Отключение экологических систем автомобиля",
                features: [
                  "Удаление EGR",
                  "Отключение AdBlue",
                  "Удаление DPF/FAP",
                ],
                price: "от 3 000 ₽",
              },
            ].map((service, i) => (
              <div
                key={i}
                className={`card relative ${service.popular ? 'border-zinc-500/50 ring-2 ring-zinc-500/20' : ''}`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Популярно
                  </div>
                )}
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-3xl font-bold mb-1">{service.title}</h3>
                <p className="text-zinc-400 font-medium mb-4">{service.subtitle}</p>
                <p className="text-gray-400 mb-6 text-lg">{service.desc}</p>
                <ul className="space-y-3 mb-6">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-lg">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-2xl font-bold text-white">{service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Как это <span className="gradient-text">работает</span>
            </h2>
            <p className="text-xl text-gray-400">
              Всего 3 простых шага через Telegram
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Загрузите файл",
                desc: "Отправьте стоковую прошивку боту в Telegram. Мы автоматически определим марку и тип ЭБУ.",
              },
              {
                step: "2",
                title: "Выберите опции",
                desc: "Укажите нужные модификации: Stage 1/2, отключение экологии, и другие опции.",
              },
              {
                step: "3",
                title: "Получите результат",
                desc: "Скачайте готовую модифицированную прошивку после оплаты. Обычно 15-30 минут.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-500 to-zinc-700 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-zinc-500/30">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="btn-primary text-lg px-10 py-5"
            >
              🤖 Попробовать сейчас
            </a>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Наши <span className="gradient-text">гарантии</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: "🛡️",
                title: "Пожизненная гарантия",
                desc: "На весь срок службы автомобиля независимо от пробега",
              },
              {
                icon: "🔄",
                title: "Бесплатные обновления",
                desc: "Обновление программы на актуальную версию в любое время",
              },
              {
                icon: "💰",
                title: "100% возврат денег",
                desc: "Если результат не устроил — вернём деньги в течение месяца",
              },
              {
                icon: "📞",
                title: "Поддержка 24/7",
                desc: "Всегда на связи в Telegram, ответим в течение 5 минут",
              },
            ].map((item, i) => (
              <div key={i} className="card text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-zinc-800 to-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Готовы увеличить мощность?
          </h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Присоединяйтесь к 2783 довольным клиентам. 
            <br />
            <strong className="text-white">Первый заказ со скидкой 10%!</strong>
          </p>
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="bg-white text-zinc-900 hover:bg-zinc-200 px-10 py-5 rounded-xl font-bold text-xl transition inline-block shadow-lg"
          >
            Начать в Telegram →
          </a>
        </div>
      </section>
    </div>
  );
}
