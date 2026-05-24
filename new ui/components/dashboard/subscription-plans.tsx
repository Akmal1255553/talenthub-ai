"use client"

import { useState } from "react"
import { Check, Sparkles, Zap, Crown, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    description: "Get started with basic job search features",
    price: { monthly: 0, yearly: 0 },
    features: [
      "10 job applications/month",
      "Basic AI job matching",
      "Profile visibility",
      "Job alerts",
      "Mobile app access",
    ],
    limitations: [
      "Limited AI assistant",
      "No resume analytics",
      "Standard support",
    ],
    cta: "Current Plan",
    popular: false,
    current: true,
  },
  {
    name: "Pro",
    icon: Zap,
    description: "For active job seekers who want an edge",
    price: { monthly: 29, yearly: 24 },
    features: [
      "Unlimited applications",
      "Advanced AI matching",
      "Priority in search results",
      "Full AI assistant access",
      "Resume analytics & optimization",
      "Interview preparation tools",
      "Salary insights",
      "Application tracking",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: true,
    current: false,
  },
  {
    name: "Premium",
    icon: Crown,
    description: "Maximum visibility and exclusive opportunities",
    price: { monthly: 59, yearly: 49 },
    features: [
      "Everything in Pro",
      "Direct recruiter access",
      "Featured profile badge",
      "Priority support 24/7",
      "Career coaching sessions",
      "Exclusive job listings",
      "Personal branding tools",
      "LinkedIn profile optimization",
    ],
    limitations: [],
    cta: "Go Premium",
    popular: false,
    current: false,
  },
  {
    name: "Enterprise",
    icon: Building2,
    description: "For teams and recruitment agencies",
    price: { monthly: 199, yearly: 166 },
    features: [
      "Everything in Premium",
      "Team collaboration",
      "Bulk candidate search",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced analytics",
      "API access",
      "SLA guarantee",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    current: false,
  },
]

export function SubscriptionPlans() {
  const [yearly, setYearly] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Subscription Plans</h2>
          <p className="text-sm text-muted-foreground">
            Choose the plan that fits your job search needs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("text-sm", !yearly && "font-medium text-foreground")}>Monthly</span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className={cn("text-sm", yearly && "font-medium text-foreground")}>
            Yearly
            <Badge variant="secondary" className="ml-2 bg-success/10 text-success">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const Icon = plan.icon
          const price = yearly ? plan.price.yearly : plan.price.monthly

          return (
            <Card
              key={plan.name}
              className={cn(
                "relative flex flex-col border-border bg-white shadow-sm",
                plan.popular && "border-primary shadow-lg shadow-primary/10",
                plan.current && "border-muted-foreground/30"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    plan.popular ? "bg-primary" : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      plan.popular ? "text-primary-foreground" : "text-foreground"
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.current && (
                      <Badge variant="outline" className="mt-1">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${price}
                  </span>
                  {price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                  {yearly && price > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Billed annually (${price * 12}/year)
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li
                      key={limitation}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 h-4 w-4 shrink-0 text-center">-</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : plan.current ? "outline" : "secondary"}
                  disabled={plan.current}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* FAQ or Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
        <span>✓ Cancel anytime</span>
        <span>✓ 14-day money-back guarantee</span>
        <span>✓ Secure payment</span>
        <span>✓ No hidden fees</span>
      </div>
    </div>
  )
}
