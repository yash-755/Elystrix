"use client"

import { useEffect, useState } from "react"
import { QuizCard } from "@/components/quiz-card"
import { useAuth } from "@/components/auth-provider"
import { getUserQuizAttempts } from "@/app/actions/quizzes"
import { Loader2 } from "lucide-react"

export default function QuizAttemptsPage() {
  const { user } = useAuth()
  const [quizAttempts, setQuizAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuizzes() {
      if (user?.uid) {
        setLoading(true)
        try {
          const data = await getUserQuizAttempts(user.uid)
          setQuizAttempts(data)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      } else if (!user) { setLoading(false) }
    }
    fetchQuizzes()
  }, [user])

  const passedCount = quizAttempts.filter((q) => q.status === "passed").length
  const failedCount = quizAttempts.filter((q) => q.status === "failed").length

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Quiz Attempts</h1>
        <p className="text-muted-foreground">View your quiz history and retake failed quizzes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{quizAttempts.length}</p>
          <p className="text-sm text-muted-foreground">Total Attempts</p>
        </div>
        <div className="bg-card rounded-2xl border border-green-500/20 p-4 text-center">
          <p className="text-3xl font-bold text-green-500">{passedCount}</p>
          <p className="text-sm text-muted-foreground">Passed</p>
        </div>
        <div className="bg-card rounded-2xl border border-red-500/20 p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{failedCount}</p>
          <p className="text-sm text-muted-foreground">Failed</p>
        </div>
      </div>

      {/* Quiz List */}
      {quizAttempts.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground">No quiz attempts found.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizAttempts.map((quiz) => (
            <QuizCard key={quiz.id} {...quiz} />
          ))}
        </div>
      )}
    </div>
  )
}

