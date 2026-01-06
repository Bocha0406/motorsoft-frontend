import Link from "next/link";
import { categories } from "@/lib/categories";

export const metadata = {
  title: "Каталог прошивок | MotorSoft",
  description: "Чип-тюнинг для автомобилей, мотоциклов, гидроциклов, снегоходов и спецтехники",
};

export default function CatalogPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-8">
          <Link href="/" className="text-gray-400 hover:text-white">
            Главная
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white">Каталог</span>
        </nav>

        <h1 className="text-4xl font-bold mb-4">Каталог прошивок</h1>
        <p className="text-gray-400 mb-12 max-w-2xl">
          Выберите категорию техники для просмотра доступных марок и моделей.
          В нашей базе более 7000 калибровок для различных ЭБУ.
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog/${cat.slug}`}
              className="group bg-gray-800 hover:bg-gray-750 rounded-2xl p-8 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="text-6xl mb-4">{cat.icon}</div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition">
                {cat.name}
              </h2>
              <p className="text-gray-400">{cat.description}</p>
              <div className="mt-4 text-blue-400 flex items-center gap-2 group-hover:gap-4 transition-all">
                Смотреть марки <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
