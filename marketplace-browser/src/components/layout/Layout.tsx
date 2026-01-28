import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          className={cn(
            'fixed inset-y-0 left-0 z-50 top-14 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:z-0 md:top-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          onNavigate={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
