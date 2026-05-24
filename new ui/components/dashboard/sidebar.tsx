"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Mail,
  Eye,
  Heart,
  RefreshCw,
  Briefcase,
  GraduationCap,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [profileCompletion] = useState(28)

  return (
    <aside className="sticky top-[136px] h-fit w-80 space-y-4 py-4">
      {/* Profile Activity Card */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800">Your Activity</span>
            <div className="flex items-center gap-1 text-primary">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">{profileCompletion}%</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={profileCompletion} className="h-2 bg-gray-100" />
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            <button 
              onClick={() => setActiveTab("applications")}
              className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">Responses & Invitations</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">999+</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("analytics")}
              className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">Resume Views</span>
              </div>
              <span className="text-sm font-semibold text-emerald-600">+663</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("saved")}
              className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">Saved Jobs</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">2</span>
            </button>
            
            <button 
              onClick={() => setActiveTab("jobs")}
              className="flex w-full items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">Auto Search</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs for Young Professionals */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Jobs for Young Professionals</h4>
              <button className="text-sm text-primary hover:underline mt-1">
                Browse Jobs
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply More */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Apply to 4 more jobs</h4>
              <button className="text-sm text-primary hover:underline mt-1">
                View Jobs
              </button>
            </div>
            <Badge className="h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold">
              4
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* IT Skills Check */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">IT Skills Assessment</h4>
              <button className="text-sm text-primary hover:underline mt-1">
                Start Now
              </button>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
