"use client"

import { useState, useRef, useEffect } from "react"
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Paperclip,
  Mic,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I am your AI Career Assistant. I can help you with:\n\n• Finding jobs that match your skills\n• Optimizing your resume\n• Preparing for interviews\n• Salary negotiations\n• Career advice\n\nHow can I assist you today?",
    timestamp: new Date(),
    suggestions: [
      "Find React jobs",
      "Review my resume",
      "Interview tips",
      "Salary advice",
    ],
  },
]

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "find react jobs": "I found 23 React developer positions that match your profile:\n\n1. **Senior Frontend Developer** at TechCorp - $180k, 95% match\n2. **React Lead** at StartupXYZ - $165k, 88% match\n3. **Full Stack Engineer** at DataFlow - $155k, 85% match\n\nWould you like me to show more details?",
        "review my resume": "I'd be happy to review your resume! Please upload it using the attachment button. I'll analyze it for:\n\n• ATS optimization\n• Skills highlighting\n• Impact statements\n• Industry keywords",
        "interview tips": "Here are key interview tips:\n\n1. **Technical Prep**: Practice coding problems\n2. **Behavioral**: Use STAR method\n3. **Research**: Know the company\n4. **Questions**: Prepare thoughtful questions\n\nWant a personalized study plan?",
        "salary advice": "Key negotiation strategies:\n\n1. **Research**: Know market rates\n2. **Timing**: Negotiate after the offer\n3. **Total Comp**: Consider all benefits\n4. **Practice**: Rehearse confidently\n\nNeed specific talking points?",
      }

      const lowerInput = input.toLowerCase()
      let response = "I understand you're asking about " + input + ". Let me help you with that. Based on your profile, I can provide personalized guidance."

      Object.keys(responses).forEach((key) => {
        if (lowerInput.includes(key) || key.includes(lowerInput)) {
          response = responses[key]
        }
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        suggestions: ["Tell me more", "Show jobs", "Save info"],
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg transition-all hover:scale-105",
          isOpen 
            ? "bg-gray-600 text-white px-4 py-3" 
            : "bg-primary text-white px-5 py-3"
        )}
      >
        {isOpen ? (
          <>
            <X className="h-5 w-5" />
            <span className="font-medium">Close</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">AI Assistant</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 rounded-xl border border-border bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-primary p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Career Assistant</h3>
                <p className="text-xs text-white/80">Powered by GPT-4</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white text-xs">Online</Badge>
          </div>

          {/* Messages */}
          <ScrollArea className="h-80 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" && "flex-row-reverse"
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn(
                      message.role === "assistant" 
                        ? "bg-primary text-white" 
                        : "bg-gray-100 text-gray-700"
                    )}>
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn(
                    "max-w-[80%] space-y-2",
                    message.role === "user" && "items-end"
                  )}>
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    </div>

                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {message.suggestions.map((suggestion) => (
                          <Badge
                            key={suggestion}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-white transition-colors text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-secondary px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-4 bg-white">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border-border"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
                <Mic className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90" 
                onClick={handleSend} 
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
