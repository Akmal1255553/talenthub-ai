"use client"

import { useState } from "react"
import {
  MapPin,
  Building2,
  MessageCircle,
  Heart,
  HeartOff,
  CheckCircle,
  Briefcase,
  Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Job {
  id: string
  title: string
  company: string
  companyVerified: boolean
  location: string
  address?: string
  salary: string
  experience: string
  paymentInfo?: string
  posted: string
  description: string
  isOnline?: boolean
}

const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Industries",
    companyVerified: true,
    location: "San Francisco, CA",
    salary: "$150,000 - $180,000 per year",
    experience: "3-5 years experience",
    posted: "2 hours ago",
    description: "We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building and maintaining high-quality web applications using modern technologies including React, TypeScript, and Next.js. The ideal candidate has strong problem-solving skills, attention to detail, and experience with responsive design and accessibility standards. You will collaborate closely with designers and backend engineers to deliver exceptional user experiences.",
    isOnline: true,
  },
  {
    id: "2",
    title: "Backend Python Developer | Python Developer (Backend)",
    company: "InnovateTech Systems",
    companyVerified: true,
    location: "New York, NY",
    address: "Manhattan, 5th Avenue, Building 128",
    salary: "$120,000 - $160,000 per year",
    experience: "3-6 years experience",
    paymentInfo: "Monthly payments",
    posted: "5 hours ago",
    description: "Join our backend team to design and implement scalable microservices architecture using Python, Django, and FastAPI. You will work on high-load systems processing millions of requests daily. Experience with PostgreSQL, Redis, and message queues is essential. We offer competitive compensation, flexible working hours, and the opportunity to work on cutting-edge technology that impacts millions of users worldwide.",
    isOnline: false,
  },
  {
    id: "3",
    title: "Strong Junior Golang Developer",
    company: "CloudScale Banking",
    companyVerified: true,
    location: "Remote",
    salary: "$80,000 - $100,000 per year",
    experience: "1-3 years experience",
    posted: "1 day ago",
    description: "We are seeking a talented Junior Golang Developer to join our fintech team. You will work on building secure, high-performance financial applications. Knowledge of microservices architecture, Docker, and Kubernetes is a plus. This is an excellent opportunity for growth in a fast-paced environment where you will learn from experienced engineers and contribute to projects that handle millions in transactions daily.",
    isOnline: false,
  },
  {
    id: "4",
    title: "Full Stack Engineer (React + Node.js)",
    company: "StartupXYZ",
    companyVerified: false,
    location: "Austin, TX",
    salary: "$130,000 - $160,000 per year",
    experience: "2-4 years experience",
    posted: "3 days ago",
    description: "Looking for a versatile Full Stack Engineer to build our next-generation SaaS platform. You will work across the entire stack, from crafting beautiful user interfaces with React to designing robust APIs with Node.js. Experience with AWS, CI/CD pipelines, and agile methodologies is preferred. Join a small but mighty team where your contributions will have a direct impact on the product and company success.",
    isOnline: true,
  },
  {
    id: "5",
    title: "DevOps Engineer / Site Reliability Engineer",
    company: "Enterprise Solutions Inc.",
    companyVerified: true,
    location: "Seattle, WA",
    address: "Downtown Seattle, Pike Street",
    salary: "$140,000 - $180,000 per year",
    experience: "4-7 years experience",
    paymentInfo: "Bi-weekly payments",
    posted: "1 week ago",
    description: "We are hiring a DevOps/SRE professional to manage and optimize our cloud infrastructure. You will design CI/CD pipelines, implement monitoring solutions, and ensure 99.99% uptime for our critical services. Strong experience with Kubernetes, Terraform, and major cloud providers (AWS/GCP/Azure) is required. You will be part of a team that values automation, documentation, and continuous improvement.",
    isOnline: false,
  },
]

const filterTabs = [
  { id: "for-you", label: "For You", active: true },
  { id: "remote", label: "Remote" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "entry-level", label: "Entry Level" },
  { id: "senior", label: "Senior" },
  { id: "internship", label: "Internship" },
]

export function JobCards() {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [activeFilter, setActiveFilter] = useState("for-you")

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeFilter === tab.id
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Job List - Vertical Layout */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="border-border bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary cursor-pointer leading-tight">
                    {job.title}
                  </h3>

                  {/* Salary & Experience */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold text-gray-900">{job.salary}</span>
                    <Badge variant="secondary" className="font-normal bg-gray-100 text-gray-700">
                      {job.experience}
                    </Badge>
                    {job.paymentInfo && (
                      <Badge variant="outline" className="font-normal text-gray-600 border-gray-300">
                        {job.paymentInfo}
                      </Badge>
                    )}
                  </div>

                  {/* Company */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{job.company}</span>
                    {job.companyVerified && (
                      <CheckCircle className="h-4 w-4 text-primary fill-primary/20" />
                    )}
                    {job.isOnline && (
                      <Badge className="bg-emerald-50 text-emerald-600 text-xs font-normal">
                        Online
                      </Badge>
                    )}
                  </div>

                  {/* Location */}
                  <div className="text-sm text-gray-600">
                    <span>{job.location}</span>
                    {job.address && <span>, {job.address}</span>}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-medium px-6">
                      Apply Now
                    </Button>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-medium">
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-muted-foreground hover:text-foreground"
                    onClick={() => toggleSave(job.id)}
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10",
                      savedJobs.has(job.id) 
                        ? "text-destructive" 
                        : "text-muted-foreground hover:text-destructive"
                    )}
                    onClick={() => toggleSave(job.id)}
                  >
                    <Heart className={cn("h-5 w-5", savedJobs.has(job.id) && "fill-current")} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
