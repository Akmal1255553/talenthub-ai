import { Bot, CreditCard, ShieldCheck, UsersRound } from 'lucide-react';
import { AppShell } from '../../components/app-shell';
import { StatCard } from '../../components/stat-card';

export default function AdminPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Admin panel</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value="0" note="Awaiting production data" />
        <StatCard label="Vacancies" value="0" note="Pending moderation" />
        <StatCard label="Payments" value="$0" note="Today" />
        <StatCard label="AI usage" value="0" note="Requests today" />
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {[
          { icon: UsersRound, label: 'Users' },
          { icon: ShieldCheck, label: 'Moderation' },
          { icon: CreditCard, label: 'Payments' },
          { icon: Bot, label: 'AI usage' },
        ].map((item) => (
          <button key={item.label} className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 py-3 text-sm">
            <item.icon size={16} aria-hidden />
            {item.label}
          </button>
        ))}
      </div>
    </AppShell>
  );
}
