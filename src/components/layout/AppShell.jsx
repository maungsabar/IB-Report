import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ToastBanner from './ToastBanner';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-open sidebar on desktop, keep closed on mobile
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setSidebarOpen(e.matches);
    setSidebarOpen(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <ToastBanner />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`min-w-0 flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-[260px]' : ''}`}>
        <Header onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
