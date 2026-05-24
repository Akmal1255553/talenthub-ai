"use client"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { JobCards } from "@/components/dashboard/job-cards"
import { AIAssistant } from "@/components/dashboard/ai-assistant"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { SubscriptionPlans } from "@/components/dashboard/subscription-plans"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "dashboard" && (
              <JobCards />
            )}

            {activeTab === "jobs" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900">All Job Listings</h1>
                <JobCards />
              </div>
            )}

            {activeTab === "applications" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
                <ApplicationsView />
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900">Saved Jobs</h1>
                <JobCards />
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                <AnalyticsCharts />
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-4">
                <SubscriptionPlans />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating AI Assistant */}
      <AIAssistant />
    </div>
  )
}

// Applications View Component
function ApplicationsView() {
  const applications = [
    {
      id: "1",
      position: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      appliedDate: "May 20, 2024",
      status: "In Review",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      id: "2",
      position: "Full Stack Engineer",
      company: "StartupXYZ",
      appliedDate: "May 18, 2024",
      status: "Interview Scheduled",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      id: "3",
      position: "React Developer",
      company: "DataFlow AI",
      appliedDate: "May 15, 2024",
      status: "Applied",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "4",
      position: "Lead Frontend Engineer",
      company: "CloudScale",
      appliedDate: "May 12, 2024",
      status: "Offer Received",
      statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: "5",
      position: "UI Engineer",
      company: "DesignHub",
      appliedDate: "May 10, 2024",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    },
  ]

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Position</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Applied Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 font-medium text-gray-900">{app.position}</td>
                <td className="px-4 py-4 text-gray-600">{app.company}</td>
                <td className="px-4 py-4 text-gray-600">{app.appliedDate}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${app.statusColor}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button className="text-sm text-primary hover:underline font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
