'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Newspaper, 
  MapPin, 
  Home, 
  Menu, 
  Users, 
  Calendar, 
  AlertTriangle, 
  Briefcase, 
  FileText, 
  Building, 
  Settings, 
  Bell, 
  Phone, 
  MessageSquare, 
  Grid3X3 
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Appointments',
    href: '/admin/appointments',
    icon: Calendar,
  },
  {
    name: 'Issue Reports',
    href: '/admin/issues',
    icon: AlertTriangle,
  },
  {
    name: 'Business Permits',
    href: '/admin/business-permits',
    icon: Briefcase,
  },
  {
    name: 'Civil Registry',
    href: '/admin/civil-registry',
    icon: FileText,
  },
  {
    name: 'Public Projects',
    href: '/admin/projects',
    icon: Building,
  },
  {
    name: 'City Services',
    href: '/admin/services',
    icon: Settings,
  },
  {
    name: 'Service Categories',
    href: '/admin/categories',
    icon: Grid3X3,
  },
  {
    name: 'Notifications',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    name: 'Emergency Hotlines',
    href: '/admin/hotlines',
    icon: Phone,
  },
  {
    name: 'Feedback',
    href: '/admin/feedback',
    icon: MessageSquare,
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
  const [collapsed, setCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = !collapsed || isHovered;
  return (
    <div className={cn(
      "relative border-r bg-background transition-all duration-300",
      isExpanded ? "w-64" : "w-16"
    )}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="mr-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
        {isExpanded && (
          <h2 className="text-lg font-semibold">Kailyan Dashboard</h2>
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
                    isExpanded ? 'px-4' : 'px-2'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', isExpanded && 'mr-2')} />
                  {isExpanded && item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}