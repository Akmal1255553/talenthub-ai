"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const applicationData = [
  { month: "Jan", applications: 12, interviews: 3, offers: 1 },
  { month: "Feb", applications: 18, interviews: 5, offers: 2 },
  { month: "Mar", applications: 24, interviews: 7, offers: 2 },
  { month: "Apr", applications: 15, interviews: 4, offers: 1 },
  { month: "May", applications: 28, interviews: 9, offers: 3 },
  { month: "Jun", applications: 34, interviews: 11, offers: 4 },
]

const skillMatchData = [
  { skill: "React", match: 95 },
  { skill: "TypeScript", match: 88 },
  { skill: "Node.js", match: 82 },
  { skill: "Python", match: 65 },
  { skill: "AWS", match: 58 },
  { skill: "Docker", match: 45 },
]

const sourceData = [
  { name: "Direct", value: 35, color: "var(--chart-1)" },
  { name: "LinkedIn", value: 28, color: "var(--chart-2)" },
  { name: "Referral", value: 20, color: "var(--chart-3)" },
  { name: "Indeed", value: 12, color: "var(--chart-4)" },
  { name: "Other", value: 5, color: "var(--chart-5)" },
]

const profileViewsData = [
  { day: "Mon", views: 45 },
  { day: "Tue", views: 52 },
  { day: "Wed", views: 78 },
  { day: "Thu", views: 65 },
  { day: "Fri", views: 89 },
  { day: "Sat", views: 34 },
  { day: "Sun", views: 28 },
]

export function AnalyticsCharts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-600">
            Track your job search performance
          </p>
        </div>
        <Tabs defaultValue="6m">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="6m">6M</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Application Funnel */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-gray-900">Application Funnel</CardTitle>
            <CardDescription className="text-gray-600">
              Track applications, interviews, and offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={applicationData}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--chart-1)"
                  fillOpacity={1}
                  fill="url(#colorApplications)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="interviews"
                  stroke="var(--chart-2)"
                  fillOpacity={1}
                  fill="url(#colorInterviews)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="offers"
                  stroke="var(--chart-3)"
                  fillOpacity={1}
                  fill="url(#colorOffers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--chart-1)" }} />
                <span className="text-xs text-gray-600">Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--chart-2)" }} />
                <span className="text-xs text-gray-600">Interviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--chart-3)" }} />
                <span className="text-xs text-gray-600">Offers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Match Analysis */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-gray-900">Skill Match Analysis</CardTitle>
            <CardDescription className="text-gray-600">
              How your skills match market demand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillMatchData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  type="category"
                  dataKey="skill"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, "Match"]}
                />
                <Bar
                  dataKey="match"
                  fill="var(--chart-1)"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Recommended to improve:</span>
              <div className="flex gap-1">
                <Badge variant="outline" className="border-gray-300 text-gray-700">Docker</Badge>
                <Badge variant="outline" className="border-gray-300 text-gray-700">AWS</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Views */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-gray-900">Profile Views</CardTitle>
            <CardDescription className="text-gray-600">
              Recruiter interest this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={profileViewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="var(--chart-2)"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Sources */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-gray-900">Application Sources</CardTitle>
            <CardDescription className="text-gray-600">
              Where your applications come from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-xs text-gray-600">
                    {source.name} ({source.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
