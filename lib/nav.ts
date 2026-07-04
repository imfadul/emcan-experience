import type { CompanyId } from './config';

/** Primary navigation. Labels resolve from the `nav` message namespace by `key`. */
export interface NavItem {
  key: 'group' | 'companies' | 'capabilities' | 'projects' | 'about' | 'contact';
  href: string;
  /** Renders the Companies mega-menu trigger instead of a plain link. */
  mega?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'group', href: '/#group' },
  { key: 'companies', href: '/#companies', mega: true },
  { key: 'capabilities', href: '/#capabilities' },
  { key: 'projects', href: '/#projects' },
  { key: 'about', href: '/#about' },
  { key: 'contact', href: '/#contact' },
];

/** Company links resolve to the ecosystem lifecycle (no per-company routes yet). */
export const companyHref = (_id: CompanyId): string => '/#companies';
