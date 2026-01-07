import Link from "next/link";
import Image from "next/image";
import { mainCategories, requestCategories } from "@/lib/categories";
import PriceRequestButton from "@/components/PriceRequestButton";

export default function HomePage() {
  return (
    <div className="bg-[#050505]">
      {/* Hero Section with Car Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Car Image */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80"
            alt="Sports Car"
            fill
            className="object-cover object-center opacity-40"
            priority
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
        </div>
        
        {/* Animated particles/sparks */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-500 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-orange-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-500 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Main spotlight effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-gradient-radial from-amber-500/30 via-amber-500/10 to-transparent blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo with glow effect - transparent background */}
            <div className="relative mb-12 group cursor-pointer">
              {/* Red glow behind logo - intensifies on hover */}
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-500">
                <div className="w-[800px] h-[400px] bg-gradient-radial from-red-500/20 via-red-500/10 to-transparent blur-3xl group-hover:from-red-500/40 group-hover:via-red-500/20 transition-all duration-500"></div>
              </div>
              {/* Logo image with transparency - red glow on hover */}
              <div className="relative">
                <Image
                  src="/logo-hero-transparent.png"
                  alt="Motorsoft - профессиональный чип-тюнинг"
                  width={900}
                  height={277}
                  className="mx-auto w-full max-w-4xl h-auto drop-shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:drop-shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all duration-500"
                  priority
                />
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed tracking-wide">
              Премиальная настройка двигателя и КПП
              <span className="mx-4 text-amber-500/50">|</span>
              Ресурсный тюнинг | отключение любой экологии
              <span className="mx-4 text-amber-500/50">|</span>
              Удобный автоматический файл-сервис с поиском по файлу
            </p>
            
            {/* START ENGINE Button - Sports Car Style */}
            <div className="flex flex-col items-center gap-8">
              <a
                href="https://t.me/MotorSoftBot"
                target="_blank"
                className="btn-engine group"
              >
                <span className="btn-engine-text">PRESS TO</span>
                <span className="btn-engine-title group-hover:animate-pulse">START</span>
                <span className="btn-engine-text">ENGINE</span>
                {/* Telegram icon overlay */}
                <div className="absolute bottom-6 opacity-30 group-hover:opacity-60 transition-opacity">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.144.12.1.153.235.168.332.015.097.033.318.019.49z"/></svg>
                </div>
              </a>
              
              <div className="flex items-center gap-6">
                <Link
                  href="/price"
                  className="btn-secondary text-sm"
                >
                  Смотреть прайс
                </Link>
                <span className="text-gray-600 text-sm">или</span>
                <PriceRequestButton variant="outline" size="sm">
                  💰 Запросить цену
                </PriceRequestButton>
              </div>
              <div className="mt-4">
                <Link
                  href="/catalog"
                  className="text-amber-500 hover:text-amber-400 text-sm font-semibold tracking-widest uppercase transition"
                >
                  Каталог →
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto">
            {[
              { value: "20000+", label: "Прошивок", icon: "⚡" },
              { value: "2783", label: "Клиентов", icon: "👥" },
              { value: "18+", label: "Лет опыта", icon: "🏆" },
              { value: "24/7", label: "Поддержка", icon: "🛡️" },
            ].map((stat, i) => (
              <div key={i} className="stat-card group backdrop-blur-xl bg-black/40">
                <div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-black text-amber-500 mb-1 tracking-wider group-hover:text-glow transition-all">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* Featured Cars Showcase */}
      <section className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-8 opacity-60">
            <span className="text-xs tracking-[0.3em] uppercase text-gray-500">Работаем с брендами</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 mt-8 items-center justify-items-center opacity-40 hover:opacity-60 transition-opacity">
            {['BMW', 'AUDI', 'MERCEDES', 'PORSCHE', 'VW', 'TOYOTA'].map((brand) => (
              <div key={brand} className="text-xl md:text-2xl font-black tracking-widest text-gray-500 hover:text-amber-500 transition-colors cursor-default">
                {brand}
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
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent"></div>
        
        {/* Background car silhouette */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"
            alt=""
            fill
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] to-transparent"></div>
        </div>
        
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

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-8">
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
                power: "+30%",
                stageClass: "stage-1",
                badgeClass: "stage-badge-1",
                accentColor: "blue",
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
                power: "+50%",
                popular: true,
                stageClass: "stage-2",
                badgeClass: "stage-badge-2",
                accentColor: "orange",
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
                power: "ECO",
                stageClass: "stage-eco",
                badgeClass: "stage-badge-eco",
                accentColor: "green",
              },
            ].map((service, i) => (
              <div
                key={i}
                className={`stage-card ${service.stageClass} relative group overflow-visible`}
              >
                {service.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-5 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-orange-500/30 z-20 whitespace-nowrap">
                    🔥 ТОП ВЫБОР
                  </div>
                )}
                {/* Power badge */}
                <div className={`stage-badge ${service.badgeClass} absolute top-4 right-4`}>
                  {service.power}
                </div>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-black mb-1 tracking-wider">{service.title}</h3>
                <p className={`font-semibold mb-4 text-sm tracking-widest uppercase ${
                  service.accentColor === 'blue' ? 'text-blue-400' : 
                  service.accentColor === 'orange' ? 'text-orange-400' : 'text-green-400'
                }`}>{service.subtitle}</p>
                <p className="text-gray-400 mb-6">{service.desc}</p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        service.accentColor === 'blue' ? 'bg-blue-500/20' : 
                        service.accentColor === 'orange' ? 'bg-orange-500/20' : 'bg-green-500/20'
                      }`}>
                        <svg className={`w-3 h-3 ${
                          service.accentColor === 'blue' ? 'text-blue-400' : 
                          service.accentColor === 'orange' ? 'text-orange-400' : 'text-green-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-gray-300 text-sm tracking-wide">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-white/5 pt-6 mt-auto">
                  <div className="text-3xl font-black text-white tracking-wider mb-4">{service.price}</div>
                  <a
                    href="https://t.me/MotorSoftBot"
                    target="_blank"
                    className={`block w-full text-center py-3 rounded-lg font-bold tracking-widest uppercase text-sm transition-all ${
                      service.accentColor === 'blue' 
                        ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50' 
                        : service.accentColor === 'orange' 
                        ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30 hover:border-orange-500/50' 
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 hover:border-green-500/50'
                    }`}
                  >
                    Заказать
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - Iron Man / Jarvis Style */}
      <section className="py-24 relative overflow-hidden">
        {/* Tech background lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-5 py-2 mb-6">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 text-xs tracking-[0.2em] uppercase font-semibold">Процесс заказа</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-wider">
              ВСЕГО <span className="text-cyan-400" style={{textShadow: '0 0 20px rgba(0,195,255,0.5)'}}>3 КЛИКА</span>
            </h2>
            <p className="text-lg text-gray-500 tracking-wide">
              Максимально простой процесс через Telegram
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 -translate-y-1/2">
              <div className="h-full bg-gradient-to-r from-cyan-500/50 to-cyan-500/20 animate-pulse"></div>
            </div>
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 -translate-y-1/2">
              <div className="h-full bg-gradient-to-r from-cyan-500/20 to-cyan-500/50 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            {[
              {
                step: "01",
                title: "ЗАГРУЗКА ФАЙЛА",
                desc: "Отправьте стоковую прошивку боту в Telegram. Мы автоматически определим марку и тип ЭБУ.",
                iconPath: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              },
              {
                step: "02",
                title: "ВЫБОР ОПЦИЙ",
                desc: "Укажите нужные модификации: Stage 1/2, отключение экологии, и другие опции.",
                iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              },
              {
                step: "03",
                title: "СКАЧИВАНИЕ",
                desc: "Скачайте готовую модифицированную прошивку после оплаты. Обычно 15-30 минут.",
                iconPath: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              },
            ].map((item, i) => (
              <div key={i} className="tech-step text-center group relative">
                {/* Tech icon */}
                <div className="tech-icon">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.iconPath} />
                  </svg>
                </div>
                
                {/* Step number */}
                <div className="text-cyan-400 text-3xl font-black mb-4 tracking-widest" style={{textShadow: '0 0 10px rgba(0,195,255,0.5)'}}>
                  {item.step}
                </div>
                
                <h3 className="text-lg font-bold mb-3 tracking-widest text-white">{item.title}</h3>
                <p className="text-gray-500 text-sm tracking-wide">{item.desc}</p>
                
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-cyan-500/30"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-cyan-500/30"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-cyan-500/30"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-cyan-500/30"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 relative z-10">
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:text-cyan-300 px-8 py-4 rounded-lg font-bold tracking-widest uppercase transition-all hover:shadow-[0_0_30px_rgba(0,195,255,0.2)] cursor-pointer z-20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.144.12.1.153.235.168.332.015.097.033.318.019.49z"/>
              </svg>
              <span>Сделать заказ</span>
            </a>
          </div>
        </div>
      </section>

      {/* Car Gallery Showcase - NFS Garage Style */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-6">
              <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-semibold">Наши работы</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-wider">
              <span className="gradient-text">ПОРТФОЛИО</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto tracking-wide">
              Примеры автомобилей, которые прошли через наши руки
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80", name: "BMW M3", power: "+85 HP" },
              { img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80", name: "Audi RS6", power: "+120 HP" },
              { img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80", name: "Mercedes AMG", power: "+95 HP" },
              { img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80", name: "BMW M4", power: "+78 HP" },
              { img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80", name: "Porsche 911", power: "+65 HP" },
              { img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80", name: "Ferrari 488", power: "+72 HP" },
              { img: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=80", name: "McLaren 720S", power: "+90 HP" },
              { img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80", name: "Chevrolet", power: "+110 HP" },
            ].map((car, i) => (
              <div key={i} className="portfolio-card group">
                <Image 
                  src={car.img}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
                {/* Dark overlay - lifts on hover */}
                <div className="absolute inset-0 bg-black/70 group-hover:bg-black/30 transition-all duration-500 z-[1]"></div>
                
                {/* Spotlight beam on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-[2]" 
                     style={{background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.4) 0%, transparent 60%)'}}>
                </div>
                
                {/* Car info - always visible at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-[3]">
                  {/* Neon HP text */}
                  <div className="neon-text text-lg font-black tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    {car.power}
                  </div>
                  <div className="text-white font-bold tracking-wider text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                    {car.name}
                  </div>
                </div>
                
                {/* Scanlines effect */}
                <div className="absolute inset-0 z-[4] pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity"
                     style={{background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'}}>
                </div>
              </div>
            ))}
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
                title: "ПОЖИЗНЕННАЯ ГАРАНТИЯ",
                desc: "На весь срок службы автомобиля независимо от пробега",
              },
              {
                icon: "🔄",
                title: "БЕСПЛАТНЫЕ ОБНОВЛЕНИЯ",
                desc: "Обновление программы на актуальную версию в любое время",
              },
              {
                icon: "💰",
                title: "ВОЗВРАТ ДЕНЕГ",
                desc: "Если результат не устроил — вернём деньги в течение месяца",
              },
              {
                icon: "📞",
                title: "ПОДДЕРЖКА 24/7",
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

      {/* CTA Section with Car Background */}
      <section className="py-32 relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
            alt="Sports Car"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-[#050505]/70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50"></div>
        </div>
        
        {/* Spotlight effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-amber-500/30 via-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-50"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-ping opacity-50" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping opacity-50" style={{animationDelay: '0.6s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-500 rounded-full animate-ping opacity-50" style={{animationDelay: '0.9s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-amber-500/30 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-500/50"></div>
            <span className="text-amber-500 text-xs tracking-[0.2em] uppercase font-bold">Готовы к мощности?</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-wider drop-shadow-2xl">
            <span className="gradient-text text-glow">РАСКРОЙТЕ</span>
            <span className="text-white"> ПОТЕНЦИАЛ</span>
            <br />
            <span className="text-white">ВАШЕГО </span>
            <span className="gradient-text text-glow">ДВИГАТЕЛЯ</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto tracking-wide">
            Присоединяйтесь к <span className="text-amber-500 font-black text-2xl">2783</span> довольным клиентам
            <br />
            <span className="inline-flex items-center gap-2 mt-4 bg-amber-500/20 px-4 py-2 rounded-full text-amber-500 font-bold text-sm tracking-widest">
              🎁 ПЕРВЫЙ ЗАКАЗ -10%
            </span>
          </p>
          
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="btn-gradient inline-flex items-center gap-4 text-xl px-12 py-6 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all hover:scale-105"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-amber-500/30">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.144.12.1.153.235.168.332.015.097.033.318.019.49z"/></svg>
            </div>
            <span className="tracking-[0.2em] uppercase font-black">START ENGINE</span>
            <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </a>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 opacity-60">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <span>Безопасная оплата</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Ответ за 5 минут</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Гарантия возврата</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
