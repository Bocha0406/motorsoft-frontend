import { brands, getBrandBySlug } from '@/lib/brands';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import TelegramButton from '@/components/TelegramButton';
import BrandLogo from '@/components/BrandLogo';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const brand = getBrandBySlug(params.slug);
  
  if (!brand) {
    return {
      title: 'Марка не найдена',
    };
  }

  return {
    title: `Чип-тюнинг ${brand.name} | MotorSoft`,
    description: `Профессиональный чип-тюнинг ${brand.name}: Stage 1, Stage 2, Stage 3, ECO-тюнинг. Увеличение мощности до 50%, снижение расхода до 20%. Пожизненная гарантия.`,
  };
}

export default function BrandPage({ params }: PageProps) {
  const brand = getBrandBySlug(params.slug);

  if (!brand) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,69,0,0.15),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/catalog"
              className="text-gray-400 hover:text-orange-500 transition-colors"
            >
              ← Каталог
            </Link>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-block w-32 h-32">
              <BrandLogo brandName={brand.name} className="w-full h-full" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
                Чип-тюнинг {brand.name}
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Узнайте точную стоимость и возможности для вашей модели
            </p>

            {/* Главная форма запроса */}
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-500/50 shadow-2xl shadow-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white">Узнайте стоимость прямо сейчас</h3>
                    <p className="text-sm text-gray-300">Расчёт для вашей модели {brand.name}</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 text-left">
                  Заполните короткую форму, и мы рассчитаем точную стоимость чип-тюнинга
                  с учётом всех характеристик вашего автомобиля
                </p>
                
                <TelegramButton variant="primary" size="lg" className="w-full text-lg py-4">
                  💬 Заказать в Telegram
                </TelegramButton>
                
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    ✓ Бесплатная консультация
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ Ответ за 15 минут
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="tel:+79882435620"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 text-center"
              >
                📞 +7 (988) 243-56-20
              </a>
              <a
                href="https://t.me/motorsoft"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 text-center"
              >
                💬 Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Программы чип-тюнинга
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Stage 1',
                power: '+15-30%',
                torque: '+20-35%',
                fuel: '±0%',
                description: 'Оптимизация заводских параметров без изменения конструкции',
                features: ['Безопасно для двигателя', 'Без потери ресурса', 'Заводская надежность'],
              },
              {
                name: 'Stage 2',
                power: '+20-40%',
                torque: '+25-45%',
                fuel: '±0-5%',
                description: 'Продвинутая настройка с учетом доработок впуска/выпуска',
                features: ['Максимальная эффективность', 'Улучшенная динамика', 'Оптимальный баланс'],
                popular: true,
              },
              {
                name: 'Stage 3',
                power: '+30-50%',
                torque: '+35-55%',
                fuel: '+5-10%',
                description: 'Экстремальная настройка с серьезными доработками железа',
                features: ['Максимальная мощность', 'Гоночный потенциал', 'Индивидуальная настройка'],
              },
              {
                name: 'ECO',
                power: '±0%',
                torque: '+10-15%',
                fuel: '-10-20%',
                description: 'Экономичная программа для снижения расхода топлива',
                features: ['Минимальный расход', 'Плавная тяга', 'Комфортная езда'],
              },
            ].map((program) => (
              <div
                key={program.name}
                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                  program.popular ? 'border-orange-500' : 'border-gray-700/50'
                } transition-all duration-300 hover:scale-105`}
              >
                {program.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ПОПУЛЯРНО
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-4">{program.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Мощность:</span>
                    <span className="text-orange-500 font-semibold">{program.power}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Крутящий момент:</span>
                    <span className="text-orange-500 font-semibold">{program.torque}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Расход топлива:</span>
                    <span className="text-orange-500 font-semibold">{program.fuel}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4">{program.description}</p>
                
                <ul className="space-y-2">
                  {program.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-orange-500 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Преимущества чип-тюнинга {brand.name}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Увеличение мощности',
                description: 'До 50% прироста мощности на турбированных двигателях и до 20% на атмосферных',
              },
              {
                icon: '💰',
                title: 'Экономия топлива',
                description: 'ECO-программы позволяют снизить расход топлива до 20% без потери динамики',
              },
              {
                icon: '🛡️',
                title: 'Пожизненная гарантия',
                description: 'Полная гарантия на весь срок службы автомобиля, бесплатные обновления',
              },
              {
                icon: '🔧',
                title: 'Без следов вмешательства',
                description: 'Обход счетчиков программирования для сохранения заводской гарантии',
              },
              {
                icon: '📊',
                title: 'Полная диагностика',
                description: 'Комплексная диагностика двигателя до и после чип-тюнинга',
              },
              {
                icon: '↩️',
                title: '100% возврат средств',
                description: 'Возврат денег в течение месяца, если результат не устроил',
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
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы улучшить ваш {brand.name}?
            </h2>
            <p className="text-gray-300 mb-8">
              Запишитесь на консультацию или узнайте стоимость чип-тюнинга для вашей модели
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TelegramButton variant="primary" size="lg" />
              <a
                href="https://t.me/motorsoft"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                💬 Telegram
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
