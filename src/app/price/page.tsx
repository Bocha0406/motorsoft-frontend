import Link from "next/link";

export const metadata = {
  title: "Прайс-лист | MotorSoft",
  description: "Цены на чип-тюнинг автомобилей, мотоциклов, гидроциклов, снегоходов и спецтехники",
};

const priceList = {
  auto: {
    title: "🚗 Автомобили",
    items: [
      { name: "Stage 1 (атмо)", price: "от 8 000 ₽" },
      { name: "Stage 1 (турбо)", price: "от 12 000 ₽" },
      { name: "Stage 2 (турбо)", price: "от 18 000 ₽" },
      { name: "Отключение EGR", price: "3 000 ₽" },
      { name: "Удаление DPF/FAP", price: "5 000 ₽" },
      { name: "Отключение AdBlue", price: "5 000 ₽" },
      { name: "Удаление катализатора", price: "3 000 ₽" },
      { name: "Коррекция пробега ЭБУ", price: "2 000 ₽" },
      { name: "Отключение иммобилайзера", price: "4 000 ₽" },
    ],
  },
  trucks: {
    title: "🚛 Грузовики",
    items: [
      { name: "Stage 1", price: "от 25 000 ₽" },
      { name: "Удаление AdBlue", price: "от 15 000 ₽" },
      { name: "Удаление DPF/SCR", price: "от 20 000 ₽" },
      { name: "Отключение EGR", price: "8 000 ₽" },
    ],
  },
  moto: {
    title: "🏍️ Мотоциклы",
    items: [
      { name: "Stage 1", price: "от 6 000 ₽" },
      { name: "Удаление O2 датчика", price: "2 000 ₽" },
      { name: "Отключение AIS", price: "2 000 ₽" },
      { name: "Снятие ограничителя", price: "3 000 ₽" },
    ],
  },
  watercraft: {
    title: "🚤 Водная техника",
    items: [
      { name: "Прошивка гидроцикла", price: "от 10 000 ₽" },
      { name: "Снятие ограничителя", price: "5 000 ₽" },
      { name: "Оптимизация топлива", price: "5 000 ₽" },
    ],
  },
  snowmobile: {
    title: "🛷 Снегоходы",
    items: [
      { name: "Stage 1", price: "от 8 000 ₽" },
      { name: "Снятие ограничителя", price: "4 000 ₽" },
      { name: "Оптимизация холостого хода", price: "3 000 ₽" },
    ],
  },
  agro: {
    title: "🚜 Сельхозтехника",
    items: [
      { name: "Stage 1", price: "от 30 000 ₽" },
      { name: "Удаление DPF/SCR", price: "от 25 000 ₽" },
      { name: "Отключение AdBlue", price: "от 20 000 ₽" },
    ],
  },
};

export default function PricePage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white">
            Главная
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white">Прайс-лист</span>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Прайс-лист</h1>
        <p className="text-gray-400 mb-12 max-w-2xl">
          Цены указаны за работу с файлом. Стоимость может варьироваться в
          зависимости от сложности и типа ЭБУ. Для точного расчёта отправьте
          файл нашему боту.
        </p>

        {/* Discount Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">🎁 Скидки постоянным клиентам</h2>
              <p className="text-blue-100 mt-2">
                От 5 до 20% в зависимости от количества заказов
              </p>
            </div>
            <a
              href="https://t.me/MotorSoftBot"
              target="_blank"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition whitespace-nowrap"
            >
              Узнать свою скидку
            </a>
          </div>
        </div>

        {/* Price Tables */}
        <div className="grid md:grid-cols-2 gap-8">
          {Object.entries(priceList).map(([key, category]) => (
            <div key={key} className="bg-gray-800 rounded-2xl overflow-hidden">
              <div className="bg-gray-700 px-6 py-4">
                <h2 className="text-xl font-bold">{category.title}</h2>
              </div>
              <div className="p-6">
                <table className="w-full">
                  <tbody>
                    {category.items.map((item, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-700 last:border-0"
                      >
                        <td className="py-3">{item.name}</td>
                        <td className="py-3 text-right font-semibold text-blue-400">
                          {item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 bg-gray-800 rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">📌 Важная информация</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Цены указаны за работу с одним файлом прошивки</li>
            <li>• При заказе нескольких услуг — скидка до 30%</li>
            <li>• Гарантия на все работы — 1 год</li>
            <li>• Возможна доработка файла в течение 7 дней бесплатно</li>
            <li>• Оплата после проверки результата</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы сделать заказ?</h2>
          <p className="text-gray-400 mb-6">
            Отправьте файл прошивки в Telegram и получите точную стоимость
          </p>
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold text-lg transition inline-flex items-center gap-2"
          >
            🤖 Заказать в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
