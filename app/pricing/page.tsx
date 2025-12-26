"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap, Crown, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPlans } from "@/app/actions/plans"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { type Plan } from "@prisma/client"

// Icon mapping
const iconMap: Record<string, any> = {
  Free: Zap,
  Pro: Sparkles,
  Elite: Crown,
  free: Zap,
  pro: Sparkles,
  elite: Crown
}

const faqItems = [
  {
    question: "Can I switch plans anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Yes! Pro plan comes with a 7-day free trial. You can cancel anytime during the trial period without being charged.",
  },
  {
    question: "What's the difference between certificate levels?",
    answer:
      "Basic certificates are completion certificates. Career certificates include verified assessments. Premium certificates are our top tier with industry recognition and verification.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund.",
  },
]

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [user, authLoading] = useAuthState(auth)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans()
        setPlans(data)
      } catch (error) {
        console.error("Failed to load plans", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  const handleCheckout = async (planId: string) => {
    if (!user) {
      toast.error("Please login to upgrade your plan")
      // Optionally redirect to login page
      return
    }

    setCheckoutLoading(planId)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          userId: user.uid,
          userEmail: user.email,
          returnUrl: window.location.origin
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL returned")
      }

    } catch (error: any) {
      console.error("Checkout failed:", error)
      toast.error("Failed to start checkout. Please try again.")
    } finally {
      setCheckoutLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary text-primary">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Invest in Your <span className="text-primary">Future</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your learning goals. All plans include access to our learning platform and
            community.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {loading || authLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const Icon = iconMap[plan.name] || iconMap[plan.id] || Zap
                const hasDiscount = plan.originalPriceNum > plan.sellingPrice && plan.sellingPrice > 0
                const isFree = plan.sellingPrice <= 0

                return (
                  <Card
                    key={plan.id}
                    className={`relative ${plan.popular ? "border-primary gold-glow-sm" : ""} flex flex-col`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <div
                        className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${plan.popular ? "bg-primary/20" : "bg-secondary"}`}
                      >
                        <Icon className={`h-6 w-6 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="text-center mb-6 flex flex-col items-center justify-center min-h-[5rem]">
                        {hasDiscount && (
                          <span className="text-muted-foreground/80 line-through text-lg mb-1 decoration-muted-foreground/60">
                            ₹{plan.originalPriceNum}
                          </span>
                        )}
                        <div className="flex items-baseline justify-center gap-1">
                          <span className={`text-4xl font-bold ${plan.popular || hasDiscount ? "text-primary" : "text-foreground"}`}>
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground text-sm font-medium">/{plan.period.replace("per ", "")}</span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6 flex-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${plan.popular ? "" : "bg-secondary text-foreground hover:bg-secondary/80"}`}
                        disabled={checkoutLoading === plan.id}
                        onClick={() => !isFree && handleCheckout(plan.id)}
                      >
                        {checkoutLoading === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {isFree ? "Get Started" : plan.id === 'pro' ? "Start Pro Trial" : "Upgrade to Elite"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/30">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="outline" className="mb-4">
                    Enterprise
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
                  <p className="text-muted-foreground mb-6">
                    Get a tailored plan for your organization with custom pricing, dedicated support, and enterprise
                    features.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Custom course libraries</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Team analytics dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>SSO & API access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Dedicated success manager</span>
                    </li>
                  </ul>
                  <Button>Contact Sales</Button>
                </div>
                <div className="hidden md:block">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Crown className="h-24 w-24 text-primary/50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
