import Link from "next/link";

export const metadata = {
  title: "FAQ — Частые вопросы | MotorSoft",
  description: "Ответы на часто задаваемые вопросы о чип-тюнинге",
};

const faqItems = [
  {
    question: "Что такое чип-тюнинг?",
    answer:
      "Чип-тюнинг — это модификация программного обеспечения (прошивки) электронного блока управления (ЭБУ) двигателя. Это позволяет изменить параметры работы двигателя: увеличить мощность, крутящий момент, оптимизировать расход топлива.",
  },
  {
    question: "Безопасен ли чип-тюнинг для двигателя?",
    answer:
      "При профессиональном подходе чип-тюнинг абсолютно безопасен. Мы работаем в рамках заводских запасов прочности двигателя и не выходим за критические значения. Все наши прошивки протестированы и имеют гарантию.",
  },
  {
    question: "Сколько времени занимает работа?",
    answer:
      "Модификация файла прошивки занимает от 15 до 30 минут после получения оплаты. В сложных случаях — до нескольких часов. Сама процедура записи прошивки в ЭБУ занимает 5-30 минут в зависимости от типа блока.",
  },
  {
    question: "Какие типы ЭБУ вы поддерживаете?",
    answer:
      "Мы работаем со всеми основными производителями ЭБУ: Bosch, Continental/Siemens, Denso, Delphi, Marelli, Visteon, Hitachi и другими. В нашей базе более 40 типов ЭБУ.",
  },
  {
    question: "Что такое Stage 1 и Stage 2?",
    answer:
      "Stage 1 — это базовый чип-тюнинг без аппаратных изменений (прирост 15-30%). Stage 2 — тюнинг с аппаратными модификациями: выхлопная система, впуск, интеркулер (прирост 30-50% и более).",
  },
  {
    question: "Можно ли вернуть стоковую прошивку?",
    answer:
      "Да, мы всегда сохраняем оригинальный файл прошивки. Вы можете вернуться к заводским настройкам в любой момент.",
  },
  {
    question: "Какая гарантия на вашу работу?",
    answer:
      "Мы даём гарантию 1 год на все наши прошивки. В течение 7 дней после заказа — бесплатные корректировки, если что-то не устраивает.",
  },
  {
    question: "Как отправить вам файл прошивки?",
    answer:
      "Просто отправьте файл (.bin, .ori, .fls и др.) нашему Telegram боту @MotorSoftBot. Бот автоматически определит марку, модель и тип ЭБУ.",
  },
  {
    question: "Как происходит оплата?",
    answer:
      "Мы принимаем оплату банковскими картами, через СБП, криптовалютой или на баланс аккаунта. Постоянным клиентам доступны скидки до 20%.",
  },
  {
    question: "Вы отключаете экологические системы?",
    answer:
      "Да, мы можем отключить: EGR, DPF/FAP (сажевый фильтр), катализатор, AdBlue/SCR, лямбда-зонды. Обратите внимание, что это может быть незаконно в некоторых странах для использования на дорогах общего пользования.",
  },
];

export default function FAQPage() {
  return (
    <div className="pt-32 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white">
            Главная
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white">FAQ</span>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Частые вопросы</h1>
        <p className="text-gray-400 mb-12 max-w-2xl">
          Ответы на популярные вопросы о чип-тюнинге. Если не нашли ответ —
          напишите нам в Telegram.
        </p>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="group card overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="font-semibold pr-4">{item.question}</h3>
                <span className="text-2xl text-gray-400 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">{item.answer}</div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 card text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
          <p className="text-gray-400 mb-6">
            Напишите нам в Telegram — ответим в течение 5 минут
          </p>
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="btn-gradient inline-flex items-center gap-2 text-lg"
          >
            🤖 Задать вопрос в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
