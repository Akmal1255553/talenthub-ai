import { notFound } from "next/navigation";
import type { JobVacancy } from "@talenthub/shared";
import { JobDetailPageClient } from "@/components/jobs/job-detail-page-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const response = await fetch(`${API_URL}/api/v1/jobs/${slug}`, { cache: "no-store" });

  if (!response.ok) {
    notFound();
  }

  const job = (await response.json()) as JobVacancy;
  return <JobDetailPageClient job={job} />;
}
