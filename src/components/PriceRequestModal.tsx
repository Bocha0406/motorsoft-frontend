"use client";

import { useState, useEffect } from "react";

interface PriceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const carBrands = [
  "Audi", "BMW", "Mercedes-Benz", "Volkswagen", "Porsche", "Toyota", "Lexus",
  "Mazda", "Honda", "Nissan", "Mitsubishi", "Subaru", "Hyundai", "Kia",
  "Ford", "Chevrolet", "Opel", "Peugeot", "Renault", "Citroen", "Volvo",
  "Land Rover", "Jaguar", "Infiniti", "Cadillac", "Jeep", "Dodge", "Chrysler",
  "Fiat", "Alfa Romeo", "Skoda", "SEAT", "Mini", "Smart", "Lada", "UAZ",
  "Haval", "Chery", "Geely", "Great Wall", "Другая"
];

const cities = [
  "Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань",
  "Нижний Новгород", "Челябинск", "Самара", "Омск", "Ростов-на-Дону",
  "Уфа", "Красноярск", "Воронеж", "Пермь", "Волгоград", "Краснодар",
  "Саратов", "Тюмень", "Тольятти", "Ижевск", "Барнаул", "Иркутск",
  "Хабаровск", "Ярославль", "Владивосток", "Другой город"
];

const contactMethods = [
  { id: "email", label: "По электронной почте" },
  { id: "sms", label: "СМС" },
  { id: "call", label: "Звонок специалиста" },
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
];

export default function PriceRequestModal({ isOpen, onClose }: PriceRequestModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    brand: "",
    model: "",
    year: "",
    engine: "",
    power: "",
    contactMethods: [] as string[],
    comment: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactMethodChange = (methodId: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.includes(methodId)
        ? prev.contactMethods.filter(m => m !== methodId)
        : [...prev.contactMethods, methodId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Формируем сообщение для отправки в Telegram
    const message = `
🚗 *ЗАПРОС СТОИМОСТИ ЧИП-ТЮНИНГА*

👤 *Контактные данные:*
• Имя: ${formData.name}
• Email: ${formData.email}
• Телефон: ${formData.phone}
• Город: ${formData.city}

🚘 *Данные автомобиля:*
• Марка: ${formData.brand}
• Модель: ${formData.model}
• Год выпуска: ${formData.year || "Не указан"}
• Объём двигателя: ${formData.engine}
• Мощность: ${formData.power} л.с.

📞 *Предпочтительный способ связи:*
${formData.contactMethods.map(m => contactMethods.find(cm => cm.id === m)?.label).join(", ") || "Не указан"}

💬 *Комментарий:*
${formData.comment || "Нет"}
    `.trim();

    // Здесь можно добавить отправку в Telegram Bot API или на сервер
    console.log("Form submitted:", message);
    
    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Закрыть модалку через 3 секунды после успешной отправки
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        brand: "",
        model: "",
        year: "",
        engine: "",
        power: "",
        contactMethods: [],
        comment: "",
      });
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-lg"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-amber-500/10">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold tracking-wide">Запросить стоимость чип-тюнинга</h2>
            <p className="text-sm text-gray-400 mt-1">Заполните форму и мы рассчитаем цену</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg border border-white/10 hover:border-amber-500/50 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
            <p className="text-gray-400">Мы свяжемся с вами в ближайшее время</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-500 tracking-widest uppercase border-b border-white/5 pb-2">
                Контактные данные
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Ваше имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="Иван Петров"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Город <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition appearance-none cursor-pointer"
                  >
                    <option value="">Выберите город</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-500 tracking-widest uppercase border-b border-white/5 pb-2">
                Данные автомобиля
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Марка автомобиля <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition appearance-none cursor-pointer"
                  >
                    <option value="">Выберите марку</option>
                    {carBrands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Модель <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="520d, A4 2.0 TDI, и т.д."
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Год выпуска
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="2020"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Объём двигателя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="engine"
                    value={formData.engine}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="2.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Мощность (л.с.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="power"
                    value={formData.power}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="190"
                  />
                </div>
              </div>
            </div>

            {/* Contact Method */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-500 tracking-widest uppercase border-b border-white/5 pb-2">
                Как с вами связаться? <span className="text-red-500">*</span>
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {contactMethods.map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${
                      formData.contactMethods.includes(method.id)
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.contactMethods.includes(method.id)}
                      onChange={() => handleContactMethodChange(method.id)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      formData.contactMethods.includes(method.id)
                        ? "border-amber-500 bg-amber-500"
                        : "border-white/30"
                    }`}>
                      {formData.contactMethods.includes(method.id) && (
                        <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Дополнительный комментарий
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500/50 transition resize-none"
                placeholder="Что именно хотите сделать? Stage 1, отключение EGR, и т.д."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || formData.contactMethods.length === 0}
              className="w-full btn-gradient py-4 text-lg font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Отправка...</span>
                </>
              ) : (
                <>
                  <span>Отправить заявку</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </>
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
