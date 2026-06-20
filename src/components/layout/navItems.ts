import { Globe, Bell, type LucideIcon } from 'lucide-react';

export interface NavItem {
  id: 'sites' | 'alerts';
  icon: LucideIcon;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'sites', icon: Globe, href: '/sites' },
  { id: 'alerts', icon: Bell, href: '/alerts' },
];

export function getActiveNav(pathname: string): NavItem['id'] | '' {
  if (pathname.startsWith('/alerts')) return 'alerts';
  if (pathname === '/' || pathname.startsWith('/sites')) return 'sites';
  return '';
}
