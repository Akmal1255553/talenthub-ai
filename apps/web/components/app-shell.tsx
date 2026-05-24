import Link from 'next/link';
import { BriefcaseBusiness, LayoutDashboard, ShieldCheck, UserRound } from 'lucide-react';

const nav = [
  { href: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { href: '/candidate/dashboard', label: 'Candidate', icon: UserRound },
  { href: '/employer/dashboard', label: 'Employer', icon: LayoutDashboard },
  { href: '/admin', label: 'Admin', icon: ShieldCheck },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link className="text-lg font-semibold text-[var(--brand)]" href="/">
            TalentHub AI
          </Link>
          <nav className="flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                href={item.href}
              >
                <item.icon size={16} aria-hidden />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
