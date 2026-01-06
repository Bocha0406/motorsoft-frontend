import Link from "next/link";
import { mainCategories, requestCategories } from "@/lib/categories";

export default function HomePage() {
  return (
    <div className="bg-[#050505]">
      {/* Hero Section with Spotlight */}
      <section className="relative py-32 md:py-44 overflow-hidden spotlight">
        {/* Background effects */}
        <div className="absolute inset-0">
          {/* Main spotlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-amber-500/20 via-amber-500/5 to-transparent blur-3xl"></div>
          {/* Side glows */}
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]"></div>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-400 tracking-widest uppercase">Premium Chip Tuning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-wider">
              <span className="text-white">ПРОФЕССИОНАЛЬНЫЙ</span>
              <br />
              <span className="gradient-text text-glow">ЧИП-ТЮНИНГ</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed tracking-wide">
              Увеличение мощности до <strong className="text-amber-500 text-glow">+50%</strong>
              <span className="mx-3 text-gray-600">•</span>
              Отключение экологии
              <span className="mx-3 text-gray-600">•</span>
              <strong className="text-amber-500">7000+</strong> прошивок
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="btn-primary group"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.144.12.1.153.235.168.332.015.097.033.318.019.49z"/></svg>
                <span>Заказать прошивку</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
              <Link
                href="/price"
                className="btn-secondary"
              >
                Смотреть прайс
              </Link>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-5xl mx-auto">
            {[
              { value: "7000+", label: "Прошивок" },
              { value: "2783", label: "Клиентов" },
              { value: "10+", label: "Лет опыта" },
              { value: "24/7", label: "Поддержка" },
            ].map((stat, i) => (
              <div key={i} className="stat-card group">
                <div className="text-3xl md:text-4xl font-black text-amber-500 mb-1 tracking-wider group-hover:text-glow transition-all">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Categories - Through Database */}
      <section className="py-24 section-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-6">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              <span className="text-amber-500 text-xs tracking-[0.2em] uppercase font-semibold">Автоматически</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-wider">
              ЛЕГКОВЫЕ АВТО И <span className="gradient-text">ДЖИПЫ</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto tracking-wide">
              Более 7000 готовых прошивок. Отправьте файл — получите результат за 15-30 минут
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog/${cat.slug}`}
                className="group card text-center"
              >
                <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">{cat.icon}</div>
                <h3 className="text-lg font-bold mb-2 tracking-wider uppercase group-hover:text-amber-500 transition">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-sm tracking-wide">{cat.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-amber-500 text-xs font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all">
                  <span>Выбрать</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Request Categories */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6">
              <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-semibold">По запросу</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-wider">
              СПЕЦТЕХНИКА И <span className="gradient-text">ВОДНЫЙ ТРАНСПОРТ</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto tracking-wide">
              Индивидуальная работа с каждым запросом. Напишите нам — рассчитаем стоимость
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {requestCategories.map((cat) => (
              <a
                key={cat.id}
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="group card text-center"
              >
                <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">{cat.icon}</div>
                <h3 className="text-base font-bold mb-1 tracking-wider uppercase group-hover:text-amber-500 transition">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-xs tracking-wide">{cat.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-amber-500 text-xs font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Запрос</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-6">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-amber-500 text-xs tracking-[0.2em] uppercase font-semibold">Услуги</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-wider">
              ВЫБЕРИТЕ <span className="gradient-text">STAGE</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto tracking-wide">
              Полный спектр услуг по модификации прошивок ЭБУ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "⚡",
                title: "STAGE 1",
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
                title: "STAGE 2",
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
                title: "ECO OFF",
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
                className={`card relative ${service.popular ? 'ring-2 ring-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : ''}`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-5 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                    ТОП ВЫБОР
                  </div>
                )}
                <div className="text-4xl mb-4 grayscale group-hover:grayscale-0">{service.icon}</div>
                <h3 className="text-2xl font-black mb-1 tracking-wider">{service.title}</h3>
                <p className="text-amber-500 font-semibold mb-4 text-sm tracking-widest uppercase">{service.subtitle}</p>
                <p className="text-gray-400 mb-6">{service.desc}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-amber-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-300 text-sm tracking-wide">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/5 pt-6 mt-auto">
                  <div className="text-3xl font-black text-white tracking-wider">{service.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6">
              <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-semibold">Процесс</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-wider">
              ВСЕГО <span className="gradient-text">3 КЛИКА</span>
            </h2>
            <p className="text-lg text-gray-500 tracking-wide">
              Максимально простой процесс через Telegram
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "ЗАГРУЗИТЕ ФАЙЛ",
                desc: "Отправьте стоковую прошивку боту в Telegram. Мы автоматически определим марку и тип ЭБУ.",
                icon: "📤"
              },
              {
                step: "02",
                title: "ВЫБЕРИТЕ ОПЦИИ",
                desc: "Укажите нужные модификации: Stage 1/2, отключение экологии, и другие опции.",
                icon: "⚙️"
              },
              {
                step: "03",
                title: "ПОЛУЧИТЕ РЕЗУЛЬТАТ",
                desc: "Скачайте готовую модифицированную прошивку после оплаты. Обычно 15-30 минут.",
                icon: "📥"
              },
            ].map((item, i) => (
              <div key={i} className="card text-center group">
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-black font-black text-lg mb-6 shadow-lg shadow-amber-500/20">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-3 tracking-wider">{item.title}</h3>
                <p className="text-gray-500 text-sm tracking-wide">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="btn-gradient inline-flex items-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="tracking-widest uppercase font-bold">Попробовать сейчас</span>
            </a>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-24 section-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-6">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              <span className="text-amber-500 text-xs tracking-[0.2em] uppercase font-semibold">Гарантии</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-wider">
              ПОЧЕМУ <span className="gradient-text">МЫ</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: "🛡️",
                title: "LIFETIME WARRANTY",
                desc: "На весь срок службы автомобиля независимо от пробега",
              },
              {
                icon: "🔄",
                title: "FREE UPDATES",
                desc: "Обновление программы на актуальную версию в любое время",
              },
              {
                icon: "💰",
                title: "MONEY BACK",
                desc: "Если результат не устроил — вернём деньги в течение месяца",
              },
              {
                icon: "📞",
                title: "24/7 SUPPORT",
                desc: "Всегда на связи в Telegram, ответим в течение 5 минут",
              },
            ].map((item, i) => (
              <div key={i} className="card text-center group">
                <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
                <h3 className="text-sm font-bold mb-3 tracking-widest text-amber-500">{item.title}</h3>
                <p className="text-gray-500 text-sm tracking-wide">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Spotlight effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-amber-500/20 via-amber-500/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-8">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-amber-500 text-xs tracking-[0.2em] uppercase font-semibold">Готовы начать?</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-wider">
            <span className="gradient-text">UNLOCK</span> YOUR
            <br />ENGINE POTENTIAL
          </h2>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto tracking-wide">
            Присоединяйтесь к <span className="text-white font-bold">2783</span> довольным клиентам
            <br />
            <span className="text-amber-500 font-semibold">Первый заказ со скидкой 10%</span>
          </p>
          
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="btn-gradient inline-flex items-center gap-4 text-lg px-10 py-5"
          >
            <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            <span className="tracking-[0.15em] uppercase font-bold">START ENGINE</span>
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
        </div>
      </section>
    </div>
  );
}
