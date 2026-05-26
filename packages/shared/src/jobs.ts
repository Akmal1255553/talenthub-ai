export interface JobVacancy {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyDescription?: string;
  verified?: boolean;
  online?: boolean;
  location: string;
  salary?: string;
  experience?: string;
  paymentInfo?: string;
  employmentType?: string;
  schedule?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  publishedAt: string;
  match?: number;
}

export const JOB_VACANCIES: JobVacancy[] = [
  {
    id: "1",
    slug: "frontend-developer-talenthub",
    title: "Senior Frontend Developer",
    company: "TalentHub Labs",
    companyDescription: "Продуктовая IT-компания. Разрабатываем платформу поиска работы с AI.",
    verified: true,
    online: true,
    location: "Ташкент · можно удалённо",
    salary: "2 500 – 3 500 $ на руки",
    experience: "Опыт 3–6 лет",
    paymentInfo: "Выплаты 2 раза в месяц",
    employmentType: "Полная занятость",
    schedule: "Пн–Пт, гибкое начало",
    match: 94,
    publishedAt: "2026-05-20",
    description:
      "Ищем сильного frontend-разработчика для развития TalentHub AI — платформы вакансий с AI-агентом для соискателей и работодателей.",
    responsibilities: [
      "Разработка интерфейсов на React и Next.js",
      "Проектирование компонентов и дизайн-системы",
      "Интеграция с REST API и real-time чатом",
      "Code review и менторинг junior-разработчиков",
    ],
    requirements: [
      "Опыт с React 18+, TypeScript, Next.js App Router",
      "Tailwind CSS, понимание accessibility",
      "Опыт работы с REST API и состоянием (React Query / Zustand)",
    ],
    benefits: ["ДМС", "Обучение", "Удалёнка", "Опционы"],
    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
  },
  {
    id: "2",
    slug: "backend-python-invest-tech",
    title: "Backend Python Developer",
    company: "OOO INVEST TECH SYSTEM",
    companyDescription: "Финтех и инвестиционные технологии в Узбекистане.",
    verified: true,
    location: "Ташкент, Мирзо-Улугбекский район",
    salary: "1 000 – 2 000 $ на руки",
    experience: "Опыт 3–6 лет",
    paymentInfo: "Выплаты раз в месяц",
    employmentType: "Полная занятость",
    schedule: "Офис 5/2",
    match: 88,
    publishedAt: "2026-05-18",
    description: "Разработка и поддержка микросервисов на Python для инвестиционной платформы.",
    responsibilities: [
      "Проектирование и разработка API на FastAPI/Django",
      "Оптимизация запросов к PostgreSQL и Redis",
      "Интеграция с платёжными и биржевыми API",
    ],
    requirements: [
      "Python 3.10+, asyncio",
      "PostgreSQL, Redis, Docker",
      "Понимание безопасности финансовых приложений",
    ],
    benefits: ["Премии по KPI", "Парковка", "Обеды"],
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker"],
  },
  {
    id: "3",
    slug: "golang-junior-davr-bank",
    title: "Strong Junior Golang Developer",
    company: "ЧАКБ ДАВР БАНК",
    companyDescription: "Крупный банк с цифровыми продуктами для физических и юридических лиц.",
    verified: true,
    location: "Ташкент",
    experience: "Опыт 1–3 года",
    employmentType: "Полная занятость",
    schedule: "Офис",
    match: 76,
    publishedAt: "2026-05-15",
    description: "Команда core-банкинга расширяется. Ищем golang-разработчика для сервисов переводов и карт.",
    responsibilities: [
      "Разработка микросервисов на Go",
      "Написание unit и integration тестов",
      "Участие в code review",
    ],
    requirements: [
      "Go 1.21+, понимание concurrency",
      "gRPC, Kafka — будет плюсом",
      "Базовый SQL",
    ],
    benefits: ["Стабильность", "Корпоративное обучение", "ДМС"],
    skills: ["Golang", "PostgreSQL", "gRPC"],
  },
  {
    id: "4",
    slug: "project-manager-broject",
    title: "IT Project Manager",
    company: "OOO BROJECT DYNAMICS",
    companyDescription: "Аутсорс и продуктовая разработка для стартапов.",
    verified: true,
    online: true,
    location: "Ташкент",
    salary: "15 000 000 so'm на руки",
    experience: "Без опыта / Junior",
    employmentType: "Полная занятость",
    match: 91,
    publishedAt: "2026-05-23",
    description: "Ведение IT-проектов от брифа до релиза. Работа с командой разработки и заказчиком.",
    responsibilities: [
      "Планирование спринтов и релизов",
      "Коммуникация с заказчиком",
      "Контроль сроков и рисков",
    ],
    requirements: [
      "Понимание Agile/Scrum",
      "Опыт с Jira, Confluence",
      "Английский — intermediate",
    ],
    benefits: ["Гибкий график", "Бонусы за проекты"],
    skills: ["Agile", "Jira", "Коммуникации"],
  },
];

export function getJobById(id: string): JobVacancy | undefined {
  return JOB_VACANCIES.find((j) => j.id === id);
}

export function getJobBySlug(slug: string): JobVacancy | undefined {
  return JOB_VACANCIES.find((j) => j.slug === slug);
}
