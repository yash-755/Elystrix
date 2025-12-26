"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, Crown, Sparkles, Zap, ArrowRight, Gift, Clock, Award, BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { differenceInDays } from "date-fns"

const benefits = [
  { icon: BookOpen, title: "Premium Courses", description: "Access all 200+ premium courses", proIncluded: true, eliteIncluded: true },
  { icon: Award, title: "Career Certificates", description: "Earn verified career certificates", proIncluded: true, eliteIncluded: true },
  { icon: Zap, title: "Unlimited Quizzes", description: "Take quizzes without limits", proIncluded: true, eliteIncluded: true },
  { icon: Clock, title: "Priority Support", description: "Get help within 24 hours", proIncluded: true, eliteIncluded: true },
  { icon: Crown, title: "Premium Certificates", description: "Earn industry-recognized premium certificates", proIncluded: false, eliteIncluded: true },
  { icon: Gift, title: "1-on-1 Mentorship", description: "Personal coaching sessions", proIncluded: false, eliteIncluded: true },
]

export default function SubscriptionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    async function fetchSubscriptionData() {
      try {
        const res = await fetch(`/api/subscription?userId=${user.uid}`)
        const data = await res.json()
        setSubscriptionData(data)
      } catch (error) {
        console.error("Failed to fetch subscription data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptionData()
  }, [user])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!subscriptionData) {
    return (
      <div className="flex items-center justify-center p-12">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p>Failed to load subscription data.</p>
      </div>
    )
  }

  const { subscription, coursesAccessed, certificatesEarned, quizAttempts } = subscriptionData



  const isFree = !subscription || subscription.plan === "FREE"
  const isPro = subscription?.plan === "PRO" && subscription.status === "ACTIVE"
  const isElite = subscription?.plan === "ELITE" && subscription.status === "ACTIVE"

  const planName = isFree ? "Free" : subscription?.plan || "Free"
  const planPrice = isFree ? "₹0" : isPro ? "₹1,999" : "₹4,999"
  const planPeriod = "month"

  let daysRemaining = 0
  let renewalDate = ""

  if (subscription && subscription.endDate) {
    daysRemaining = Math.max(0, differenceInDays(subscription.endDate, new Date()))
    renewalDate = subscription.endDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card className={isFree ? "border-border" : "border-primary gold-glow-sm"}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isFree ? "bg-secondary" : "bg-primary/20"}`}>
                <Sparkles className={`h-7 w-7 ${isFree ? "text-muted-foreground" : "text-primary"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{planName} Plan</h2>
                  {!isFree && <Badge className="bg-primary text-primary-foreground">Active</Badge>}
                </div>
                <p className="text-muted-foreground">
                  {isFree ? "Upgrade to access premium features" : `${planPrice}/${planPeriod} • ${renewalDate ? `Renews ${renewalDate}` : "No end date"}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {isFree ? (
                <Link href="/pricing">
                  <Button>
                    <Crown className="h-4 w-4 mr-1" />
                    Upgrade Now
                  </Button>
                </Link>
              ) : (
                <>
                  <Button variant="outline">Cancel Plan</Button>
                  {!isElite && (
                    <Link href="/pricing">
                      <Button>
                        <Crown className="h-4 w-4 mr-1" />
                        Upgrade to Elite
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {!isFree && daysRemaining > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Billing cycle progress</span>
                <span>{daysRemaining} days remaining</span>
              </div>
              <Progress value={((30 - daysRemaining) / 30) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{coursesAccessed}</p>
                <p className="text-xs text-muted-foreground">Courses Accessed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{certificatesEarned}</p>
                <p className="text-xs text-muted-foreground">Certificates Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{quizAttempts}</p>
                <p className="text-xs text-muted-foreground">Quiz Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Your Plan Benefits</CardTitle>
          <CardDescription>What&apos;s included in your {planName} subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, idx) => {
              const included = isFree ? false : isPro ? benefit.proIncluded : benefit.eliteIncluded
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-4 rounded-lg ${included ? "bg-primary/5 border border-primary/20" : "bg-secondary/50 border border-border"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${included ? "bg-primary/20" : "bg-secondary"}`}
                  >
                    <benefit.icon className={`h-5 w-5 ${included ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{benefit.title}</p>
                      {included ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {!benefit.proIncluded ? "Elite" : "Pro+"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA (only show if not Elite) */}
      {!isElite && (
        <Card className="bg-gradient-to-br from-secondary to-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-1">Unlock Your Full Potential</h3>
                <p className="text-muted-foreground">
                  {isFree
                    ? "Upgrade to Pro or Elite for premium courses, verified certificates, and career support."
                    : "Upgrade to Elite for Premium certificates, 1-on-1 mentorship, career coaching, and exclusive masterclasses."}
                </p>
              </div>
              <Link href="/pricing">
                <Button size="lg">
                  {isFree ? "Upgrade Now" : "Upgrade to Elite"}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/dashboard/settings?tab=billing">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Zap className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Billing History</p>
                <p className="text-sm text-muted-foreground">View past invoices</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/settings?tab=billing">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Gift className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Payment Method</p>
                <p className="text-sm text-muted-foreground">Update card details</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/faq">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-muted-foreground">Common questions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
