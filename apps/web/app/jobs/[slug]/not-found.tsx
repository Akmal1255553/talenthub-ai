import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JobNotFound() {
  return (
    <div className="bg-mesh flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">Вакансия не найдена</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Возможно, вакансия закрыта или ссылка устарела.
      </p>
      <Button variant="brand" size="lg" className="mt-8" asChild>
        <Link href="/jobs">К каталогу вакансий</Link>
      </Button>
    </div>
  );
}
