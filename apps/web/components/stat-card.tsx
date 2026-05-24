export function StatCard({
  label,
  value,
  note,
}: Readonly<{ label: string; value: string; note: string }>) {
  return (
    <section className="rounded-md border border-[var(--line)] bg-white p-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <strong className="mt-2 block text-2xl">{value}</strong>
      <p className="mt-1 text-sm text-[var(--muted)]">{note}</p>
    </section>
  );
}
