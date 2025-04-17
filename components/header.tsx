'use client';

import { Film } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b glass-effect">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 animate-slide-in">
            <Film className="h-6 w-6" />
            <span className="font-bold text-xl">MovieMate</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {[
              { path: '/', label: 'Discover' },
              { path: '/in-cinemas', label: 'In Cinemas' },
              { path: '/trending', label: 'Trending' },
              { path: '/popular', label: 'Popular' },
              { path: '/top-rated', label: 'Top Rated' },
              { path: '/watchlist', label: 'Watchlist' },
            ].map((item, index) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={pathname === item.path ? 'default' : 'ghost'}
                  className={`animate-fade-in smooth-transition`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4 animate-fade-in">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}