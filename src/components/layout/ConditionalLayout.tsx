'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Для админки — не показываем Header/Footer
  const isAdmin = pathname ? pathname.startsWith('/admin') : false;
  
  if (isAdmin) {
    return <div className="min-h-screen">{children}</div>;
  }
  
  // Для публичного сайта — показываем Header/Footer
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
