import Link from "next/link";
import TelegramButton from "@/components/TelegramButton";

export const metadata = {
  title: "Услуги чип-тюнинга | MotorSoft",
  description: "Профессиональный чип-тюнинг автомобилей, грузовиков, мотоциклов и спецтехники. Узнайте стоимость для вашей модели.",
};

const services = {
  auto: {
    title: "🚗 Легковые автомобили",
    description: "Повышение мощности и крутящего момента, улучшение динамики",
    items: [
      { name: "Stage 1 (атмосферный двигатель)", description: "Оптимизация заводских параметров +15-20% мощности" },
      { name: "Stage 1 (турбированный двигатель)", description: "Прирост +20-30% мощности без изменения железа" },
      { name: "Stage 2 (турбо)", description: "Продвинутая настройка +30-40% мощности" },
      { name: "ECO-тюнинг", description: "Снижение расхода топлива до 20%" },
      { name: "Отключение EGR", description: "Улучшение работы двигателя" },
      { name: "Удаление DPF/FAP (сажевый фильтр)", description: "Программное удаление забитых фильтров" },
      { name: "Отключение AdBlue", description: "Экономия на реагенте" },
      { name: "Удаление катализатора", description: "Программное отключение лямбда-зондов" },
      { name: "Отключение иммобилайзера", description: "Решение проблем с запуском" },
    ],
  },
  trucks: {
    title: "🚛 Грузовики и коммерческий транспорт",
    description: "Экономия топлива и увеличение ресурса двигателя",
    items: [
      { name: "Stage 1", description: "Прирост мощности +20-25%, снижение расхода" },
      { name: "ECO-тюнинг", description: "Максимальная экономия топлива до 15%" },
      { name: "Удаление AdBlue", description: "Полное отключение системы" },
      { name: "Удаление DPF/SCR", description: "Программное удаление экологических систем" },
      { name: "Отключение EGR", description: "Улучшение надежности" },
    ],
  },
  moto: {
    title: "🏍️ Мотоциклы",
    description: "Раскрытие потенциала двигателя",
    items: [
      { name: "Stage 1", description: "Оптимизация мощности и отклика дросселя" },
      { name: "Удаление O2 датчика", description: "Программное отключение" },
      { name: "Отключение AIS", description: "Улучшение работы двигателя" },
      { name: "Снятие ограничителя скорости", description: "Раскрытие максимальной скорости" },
    ],
  },
  watercraft: {
    title: "🚤 Гидроциклы и водная техника",
    description: "Максимальная мощность и динамика на воде",
    items: [
      { name: "Прошивка гидроцикла", description: "Stage 1-3 программы для BRP, Yamaha, Kawasaki" },
      { name: "Снятие ограничителя", description: "Увеличение максимальной скорости" },
      { name: "Оптимизация топливной карты", description: "Экономия топлива и плавность хода" },
    ],
  },
  snowmobile: {
    title: "🛷 Снегоходы",
    description: "Повышение производительности для экстремальных условий",
    items: [
      { name: "Stage 1", description: "Прирост мощности для снегоходов" },
      { name: "Снятие ограничителя", description: "Максимальная скорость" },
      { name: "Оптимизация холостого хода", description: "Стабильная работа на морозе" },
    ],
  },
  agro: {
    title: "🚜 Сельхозтехника и спецтехника",
    description: "Надежность и экономия для интенсивной работы",
    items: [
      { name: "Stage 1", description: "Увеличение мощности тракторов, комбайнов" },
      { name: "ECO-тюнинг", description: "Экономия топлива до 20%" },
      { name: "Удаление DPF/SCR", description: "Программное решение экологических систем" },
      { name: "Отключение AdBlue", description: "Экономия на обслуживании" },
    ],
  },
};

export default function PricePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,69,0,0.15),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <nav className="text-sm mb-8 text-gray-400">
            <Link href="/" className="hover:text-orange-500 transition">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Услуги</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Наши услуги
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Профессиональный чип-тюнинг для любой техники. Стоимость рассчитывается индивидуально
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/50">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Индивидуальный расчёт стоимости</h3>
                <p className="text-gray-300 leading-relaxed">
                  Цена зависит от марки, модели, года выпуска, типа двигателя и сложности работ. 
                  Для получения точной стоимости заполните форму запроса — мы ответим в течение 15 минут!
                </p>
              </div>
            </div>
            
            <TelegramButton variant="primary" size="lg" className="w-full text-lg">
              💬 Заказать в Telegram
            </TelegramButton>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {Object.entries(services).map(([key, category]) => (
            <div key={key} className="space-y-6">
              {/* Category Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  {category.title}
                </h2>
                <p className="text-gray-400">{category.description}</p>
                <div className="h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
              </div>

              {/* Services Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 group"
                  >
                    <h3 className="font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-400">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Почему выбирают нас
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Честные цены',
                description: 'Индивидуальный расчёт без переплат и скрытых доплат',
              },
              {
                icon: '⚡',
                title: 'Быстрый ответ',
                description: 'Рассчитаем стоимость в течение 15 минут после запроса',
              },
              {
                icon: '🛡️',
                title: 'Пожизненная гарантия',
                description: 'Гарантия на весь срок службы автомобиля',
              },
              {
                icon: '💰',
                title: 'Скидки постоянным клиентам',
                description: 'От 5% до 20% на повторные заказы',
              },
              {
                icon: '🔧',
                title: 'Без следов',
                description: 'Обходим счётчики для сохранения гарантии',
              },
              {
                icon: '↩️',
                title: '100% возврат',
                description: 'Возврат денег, если результат не устроил',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-orange-500/30 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Узнайте точную стоимость для вашего автомобиля
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Заполните форму запроса — укажите марку, модель и год выпуска. 
              Мы рассчитаем стоимость с учётом всех параметров
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <TelegramButton variant="primary" size="lg" className="text-lg">
                💬 Заказать в Telegram
              </TelegramButton>
              <a
                href="tel:+79882435620"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                📞 Позвонить
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                ✓ Бесплатная консультация
              </span>
              <span className="flex items-center gap-2">
                ✓ Ответ за 15 минут
              </span>
              <span className="flex items-center gap-2">
                ✓ Работаем по всей России
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
