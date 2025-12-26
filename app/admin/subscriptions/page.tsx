"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Users, TrendingUp, DollarSign, Edit, Crown, Sparkles, Zap, Gift, Loader2 } from "lucide-react"
import { getPlans, updatePlan } from "@/app/actions/plans"
import type { Plan } from "@prisma/client"
import { toast } from "sonner"

// Mapping for icons based on plan name or ID
const iconMap: Record<string, any> = {
  Free: Gift,
  Pro: Sparkles,
  Elite: Crown,
  free: Gift,
  pro: Sparkles,
  elite: Crown
}

const recentTransactions: any[] = [] // Empty to avoid fake data

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [subscriptionStats, setSubscriptionStats] = useState<any>(null)

  // Edit logic state
  const [editForm, setEditForm] = useState({
    originalPrice: "",
    sellingPrice: ""
  })

  const loadPlans = async () => {
    setLoading(true)
    const data = await getPlans()
    setPlans(data)
    setLoading(false)
  }

  const loadSubscriptionStats = async () => {
    try {
      const response = await fetch("/api/admin/subscription-stats")
      if (response.ok) {
        const stats = await response.json()
        setSubscriptionStats(stats)
      }
    } catch (error) {
      console.error("Error loading subscription stats:", error)
    }
  }

  useEffect(() => {
    loadPlans()
    loadSubscriptionStats()
  }, [])

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan)
    setEditForm({
      originalPrice: plan.originalPriceNum?.toString() || "0",
      sellingPrice: plan.sellingPrice.toString()
    })
  }

  const handleSave = async () => {
    if (!editingPlan) return

    const original = parseFloat(editForm.originalPrice)
    const selling = parseFloat(editForm.sellingPrice)

    if (isNaN(original) || isNaN(selling)) {
      toast.error("Please enter valid numbers")
      return
    }

    if (original < selling) {
      toast.error("Original price cannot be less than selling price")
      return
    }

    const hasDiscount = original > selling

    const newData: Partial<Plan> = {
      sellingPrice: selling,
      originalPriceNum: original,
      price: `₹${selling.toLocaleString()}`,
      originalPrice: hasDiscount ? `₹${original.toLocaleString()}` : null
    }

    try {
      const success = await updatePlan(editingPlan.id, newData)
      if (success) {
        toast.success("Plan updated successfully")
        setEditingPlan(null)
        loadPlans()
      } else {
        toast.error("Failed to update plan")
      }
    } catch (e) {
      toast.error("Error updating plan")
    }
  }

  // Calculate stats from real subscription data
  const totalUsers = subscriptionStats?.totalUsers || 0
  const activeSubscriptions = subscriptionStats?.activeSubscriptions || 0
  const paidUsers = subscriptionStats?.paidUsers || 0
  const mrr = subscriptionStats?.mrr || 0
  const conversionRate = totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0

  // Get plan-specific user counts from subscription stats
  const getPlanUserCount = (planName: string) => {
    if (!subscriptionStats?.planBreakdown) return 0
    const normalized = planName.toUpperCase()
    const planData = subscriptionStats.planBreakdown.find((p: any) => p.plan === normalized)
    return planData?.count || 0
  }

  const getPlanPercentage = (planName: string) => {
    if (!subscriptionStats?.planBreakdown || totalUsers === 0) return 0
    const count = getPlanUserCount(planName)
    return Math.round((count / totalUsers) * 100)
  }

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage subscription plans and revenue</p>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold">₹{mrr.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
              <p className="text-2xl font-bold">{activeSubscriptions.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid Users</p>
              <p className="text-2xl font-bold">{paidUsers.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const Icon = iconMap[plan.name] || iconMap[plan.id] || Zap
          const userCount = getPlanUserCount(plan.name)
          const percentage = getPlanPercentage(plan.name)

          return (
            <Card key={plan.id} className={plan.popular ? "border-primary gold-glow-sm" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${plan.color || 'bg-secondary'}/10 flex items-center justify-center`}>
                    <Icon
                      className={`h-5 w-5 ${plan.popular ? "text-primary" : "text-gray-500"}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.price}/{plan.period.replace("per ", "")}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleEditClick(plan)}>
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Users</span>
                    <span className="font-medium">{userCount.toLocaleString()}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
                </div>
                {plan.originalPrice && (
                  <div className="mb-2 text-xs text-muted-foreground">
                    Original Price: <span className="line-through">{plan.originalPrice}</span>
                  </div>
                )}
                <ul className="text-xs text-muted-foreground space-y-1">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                  {plan.features.length > 3 && <li>• +{plan.features.length - 3} more</li>}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingPlan?.name} Plan</DialogTitle>
            <DialogDescription>
              Update pricing details. Changes reflect immediately on the student pricing page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="originalPrice">Original Price (MRP)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={editForm.originalPrice}
                onChange={(e) => setEditForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                placeholder="499"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sellingPrice">Selling Price (Discounted)</Label>
              <Input
                id="sellingPrice"
                type="number"
                value={editForm.sellingPrice}
                onChange={(e) => setEditForm(prev => ({ ...prev, sellingPrice: e.target.value }))}
                placeholder="199"
              />
            </div>

            {parseInt(editForm.originalPrice) > parseInt(editForm.sellingPrice) && (
              <div className="p-3 bg-green-500/10 text-green-600 rounded-md text-sm font-medium">
                Applying {(100 - (parseInt(editForm.sellingPrice) / parseInt(editForm.originalPrice) * 100)).toFixed(0)}% Discount
              </div>
            )}

            {parseInt(editForm.originalPrice) < parseInt(editForm.sellingPrice) && parseInt(editForm.originalPrice) > 0 && (
              <div className="p-3 bg-red-500/10 text-red-600 rounded-md text-sm font-medium">
                Error: Selling price cannot be higher than Original price.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPlan(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recent Transactions (Static for now) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest subscription payments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{tx.user}</TableCell>
                  <TableCell>
                    <Badge
                      variant={tx.plan === "Elite" ? "default" : "outline"}
                      className={tx.plan === "Elite" ? "bg-primary/20 text-primary" : ""}
                    >
                      {tx.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  <TableCell>
                    {tx.status === "completed" ? (
                      <Badge className="bg-green-500/10 text-green-600">Completed</Badge>
                    ) : (
                      <Badge variant="destructive">Refunded</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {recentTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No transactions yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
