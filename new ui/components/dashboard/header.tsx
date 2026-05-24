"use client"

import { useState } from "react"
import { 
  Search, 
  Bell, 
  Heart,
  MessageCircle,
  ChevronDown,
  MapPin,
  SlidersHorizontal,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-white">TF</span>
            </div>
            <span className="hidden text-lg font-semibold text-gray-900 md:inline-block">
              TalentFlow
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Resume & Profile
                  <Badge className="ml-1.5 h-5 min-w-5 bg-red-500 text-white text-xs">99+</Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>My Resume</DropdownMenuItem>
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem>Skills</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Responses
            </Button>
            <Button variant="ghost" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Help
            </Button>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search Icon */}
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Location */}
          <Button variant="ghost" className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <MapPin className="h-4 w-4" />
            <span>New York</span>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
            <MessageCircle className="h-5 w-5" />
          </Button>

          {/* Favorites */}
          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Create Resume Button */}
          <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-white font-medium">
            Create Resume
          </Button>

          {/* Menu */}
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Search Bar Row */}
      <div className="border-t border-gray-200 bg-white py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Job title, position, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 border-gray-300 bg-white text-base text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 border-gray-300 text-gray-600 hover:text-gray-900">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
          <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold text-base">
            Find Jobs
          </Button>
        </div>
      </div>
    </header>
  )
}
