"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  Eye, 
  Send, 
  MessageSquare,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Job Matches",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: Briefcase,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Profile Views",
    value: "2,847",
    change: "+23%",
    trend: "up",
    icon: Eye,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    title: "Applications Sent",
    value: "34",
    change: "+8%",
    trend: "up",
    icon: Send,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    title: "Interview Invites",
    value: "8",
    change: "-2%",
    trend: "down",
    icon: MessageSquare,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("rounded-lg p-2", stat.bgColor)}>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{stat.value}</span>
                <span
                  className={cn(
                    "flex items-center text-sm font-medium",
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  )}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                vs last month
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
