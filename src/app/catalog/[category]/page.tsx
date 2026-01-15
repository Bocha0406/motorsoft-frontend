import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/lib/categories";

// Пример марок для демо (потом будет из API)
const brandsByCategory: Record<string, { name: string; count: number }[]> = {
  auto: [
    { name: "BMW", count: 656 },
    { name: "Ford", count: 645 },
    { name: "Volkswagen", count: 633 },
    { name: "Mercedes-Benz", count: 448 },
    { name: "Audi", count: 412 },
    { name: "Toyota", count: 387 },
    { name: "Opel", count: 356 },
    { name: "Peugeot", count: 298 },
    { name: "Renault", count: 276 },
    { name: "Hyundai", count: 234 },
    { name: "Kia", count: 221 },
    { name: "Mazda", count: 198 },
  ],
  trucks: [
    { name: "MAN", count: 124 },
    { name: "Scania", count: 118 },
    { name: "Volvo", count: 96 },
    { name: "DAF", count: 87 },
    { name: "Mercedes-Benz", count: 76 },
    { name: "Iveco", count: 54 },
  ],
  moto: [
    { name: "Honda", count: 87 },
    { name: "Yamaha", count: 76 },
    { name: "Kawasaki", count: 65 },
    { name: "Suzuki", count: 54 },
    { name: "BMW", count: 43 },
    { name: "Ducati", count: 32 },
  ],
  watercraft: [
    { name: "Sea-Doo", count: 45 },
    { name: "Yamaha", count: 38 },
    { name: "Kawasaki", count: 24 },
    { name: "Honda", count: 18 },
  ],
  snowmobile: [
    { name: "Ski-Doo", count: 56 },
    { name: "Arctic Cat", count: 43 },
    { name: "Polaris", count: 38 },
    { name: "Yamaha", count: 32 },
  ],
  agro: [
    { name: "John Deere", count: 89 },
    { name: "Case IH", count: 67 },
    { name: "New Holland", count: 54 },
    { name: "Claas", count: 43 },
    { name: "Fendt", count: 38 },
  ],
  special: [
    { name: "Caterpillar", count: 76 },
    { name: "Komatsu", count: 65 },
    { name: "JCB", count: 54 },
    { name: "Hitachi", count: 43 },
    { name: "Volvo", count: 38 },
  ],
};

export function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return params.then(({ category }) => {
    const cat = getCategoryBySlug(category);
    return {
      title: cat
        ? `${cat.name} — Чип-тюнинг | MotorSoft`
        : "Каталог | MotorSoft",
      description: cat?.description,
    };
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) {
    notFound();
  }

  const brands = brandsByCategory[category] || [];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white">
            Главная
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link href="/catalog" className="text-gray-400 hover:text-white">
            Каталог
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white">{cat.name}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-6xl">{cat.icon}</span>
          <div>
            <h1 className="text-4xl font-bold">{cat.name}</h1>
            <p className="text-gray-400 mt-2">{cat.description}</p>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/catalog/${category}/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition group"
            >
              <h3 className="text-lg font-semibold group-hover:text-blue-400 transition">
                {brand.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {brand.count} прошивок
              </p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gray-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Не нашли свою марку?</h2>
          <p className="text-gray-400 mb-6">
            Отправьте нам файл прошивки в Telegram — мы определим её
            автоматически!
          </p>
          <a
            href="https://t.me/MotorSoftBot"
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition inline-block"
          >
            🤖 Открыть Telegram Bot
          </a>
        </div>
      </div>
    </div>
  );
}
