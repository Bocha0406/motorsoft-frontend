// Категории техники для MotorSoft

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image: string;
  isOnRequest?: boolean; // По запросу (не через базу)
}

// Основные категории — через базу (автоматически)
export const mainCategories: Category[] = [
  {
    id: "cars",
    name: "Легковые авто",
    slug: "cars",
    icon: "🚗",
    description: "Седаны, хэтчбеки, купе — более 7000 прошивок в базе",
    image: "/images/categories/cars.jpg",
  },
  {
    id: "suv",
    name: "Джипы и кроссоверы",
    slug: "suv",
    icon: "🚙",
    description: "Внедорожники, кроссоверы, пикапы",
    image: "/images/categories/suv.jpg",
  },
  {
    id: "light-trucks",
    name: "Лёгкие грузовики",
    slug: "light-trucks",
    icon: "🚐",
    description: "Микроавтобусы, фургоны, малотоннажники",
    image: "/images/categories/light-trucks.jpg",
  },
];

// Категории по запросу
export const requestCategories: Category[] = [
  {
    id: "trucks",
    name: "Грузовики",
    slug: "trucks",
    icon: "🚛",
    description: "Тягачи, фуры, спецтранспорт",
    image: "/images/categories/trucks.jpg",
    isOnRequest: true,
  },
  {
    id: "watercraft",
    name: "Гидроциклы",
    slug: "watercraft",
    icon: "🚤",
    description: "Гидроциклы, катера, лодочные моторы",
    image: "/images/categories/watercraft.jpg",
    isOnRequest: true,
  },
  {
    id: "snowmobile",
    name: "Снегоходы",
    slug: "snowmobile",
    icon: "🛷",
    description: "Снегоходы всех производителей",
    image: "/images/categories/snowmobile.jpg",
    isOnRequest: true,
  },
  {
    id: "special",
    name: "Спецтехника",
    slug: "special",
    icon: "🚜",
    description: "Тракторы, экскаваторы, погрузчики",
    image: "/images/categories/special.jpg",
    isOnRequest: true,
  },
];

// Все категории вместе
export const categories: Category[] = [...mainCategories, ...requestCategories];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
