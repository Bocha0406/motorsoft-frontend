import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "MotorSoft — Профессиональный чип-тюнинг",
  description:
    "Чип-тюнинг автомобилей, мотоциклов, гидроциклов, снегоходов и спецтехники. Более 7000 прошивок в базе. Работаем с 2014 года.",
  keywords: [
    "чип-тюнинг",
    "прошивка ЭБУ",
    "увеличение мощности",
    "удаление катализатора",
    "удаление сажевого фильтра",
    "отключение EGR",
    "stage 1",
    "stage 2",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
