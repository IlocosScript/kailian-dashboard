'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Newspaper, MapPin, Home, Menu } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'News',
    href: '/admin/news',
    icon: Newspaper,
  },
  {
    name: 'Tourist Spots',
    href: '/admin/tourist-spots',
    icon: MapPin,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "relative border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="mr-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
        {!collapsed && (
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-colors',
                    collapsed ? 'px-2' : 'px-4'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', !collapsed && 'mr-2')} />
                  {!collapsed && item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}