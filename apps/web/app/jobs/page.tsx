import { Filter, MapPin, Search } from 'lucide-react';
import { AppShell } from '../../components/app-shell';

const jobs = [
  { title: 'Senior Backend Engineer', company: 'Novi Labs', location: 'Remote', salary: '$90k - $130k' },
  { title: 'Product Designer', company: 'BrightHire', location: 'Tashkent', salary: '$45k - $70k' },
  { title: 'AI Recruiter', company: 'ScaleWorks', location: 'Hybrid', salary: '$60k - $95k' },
];

export default function JobsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Job search</h1>
          <p className="mt-2 text-[var(--muted)]">SEO-ready public vacancies with filters and AI matching.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 py-2 text-sm">
          <Filter size={16} aria-hidden />
          Filters
        </button>
      </div>
      <div className="mt-5 flex rounded-md border border-[var(--line)] bg-white p-2">
        <Search className="ml-2 mt-2 text-[var(--muted)]" size={18} aria-hidden />
        <input className="w-full bg-transparent px-3 py-2 outline-none" placeholder="Role, company, skills" />
      </div>
      <div className="mt-5 grid gap-3">
        {jobs.map((job) => (
          <article key={job.title} className="rounded-md border border-[var(--line)] bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{job.company}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <MapPin size={16} aria-hidden />
                {job.location} · {job.salary}
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
