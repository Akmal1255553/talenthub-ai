"use client"

import { 
  Eye, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  Building2,
  Star,
  TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "view" | "application" | "interview" | "offer" | "message" | "saved"
  title: string
  company?: string
  companyLogo?: string
  time: string
  description?: string
}

const activities: Activity[] = [
  {
    id: "1",
    type: "view",
    title: "Profile viewed by recruiter",
    company: "Google",
    time: "2 minutes ago",
    description: "Senior Technical Recruiter viewed your profile",
  },
  {
    id: "2",
    type: "application",
    title: "Application submitted",
    company: "TechCorp Inc.",
    time: "1 hour ago",
    description: "Senior Frontend Developer position",
  },
  {
    id: "3",
    type: "interview",
    title: "Interview scheduled",
    company: "StartupXYZ",
    time: "3 hours ago",
    description: "Technical interview on May 28, 2026 at 2:00 PM",
  },
  {
    id: "4",
    type: "message",
    title: "New message received",
    company: "DataFlow AI",
    time: "5 hours ago",
    description: "Recruiter wants to discuss an opportunity",
  },
  {
    id: "5",
    type: "offer",
    title: "Offer received!",
    company: "CloudScale",
    time: "1 day ago",
    description: "$165k base + equity package",
  },
  {
    id: "6",
    type: "saved",
    title: "Job saved to favorites",
    company: "FinTech Pro",
    time: "2 days ago",
    description: "Backend Developer - Remote",
  },
]

const activityIcons = {
  view: Eye,
  application: Send,
  interview: Clock,
  offer: CheckCircle2,
  message: MessageSquare,
  saved: Star,
}

const activityColors = {
  view: "text-chart-2 bg-chart-2/10",
  application: "text-primary bg-primary/10",
  interview: "text-chart-4 bg-chart-4/10",
  offer: "text-success bg-success/10",
  message: "text-chart-3 bg-chart-3/10",
  saved: "text-chart-5 bg-chart-5/10",
}

export function ActivityFeed() {
  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Recent activity</CardTitle>
        <Badge variant="secondary" className="text-xs">
          <TrendingUp className="mr-1 h-3 w-3" />
          Active
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4 pb-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activityIcons[activity.type]
              const colorClasses = activityColors[activity.type]

              return (
                <div
                  key={activity.id}
                  className="group flex gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50"
                >
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", colorClasses)}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium leading-tight">
                        {activity.title}
                      </p>
                    </div>

                    {activity.company && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        {activity.company}
                      </div>
                    )}

                    {activity.description && (
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground/70">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
