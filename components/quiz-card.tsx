import { CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface QuizCardProps {
  id: string
  courseName: string
  attemptDate: string
  score: number
  passingScore: number
  status: "passed" | "failed"
  canRetake: boolean
}

export function QuizCard({ id, courseName, attemptDate, score, passingScore, status, canRetake }: QuizCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 transition-all hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{courseName}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {attemptDate}
          </p>
        </div>
        <Badge
          className={cn(
            status === "passed"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-red-500/10 text-red-500 border-red-500/20",
          )}
        >
          {status === "passed" ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
          {status === "passed" ? "Passed" : "Failed"}
        </Badge>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Your Score</span>
            <span className="font-semibold text-foreground">{score}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                score >= passingScore ? "bg-green-500" : "bg-red-500",
              )}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <div className="text-center px-4 border-l border-border">
          <p className="text-xs text-muted-foreground">Passing</p>
          <p className="font-semibold text-foreground">{passingScore}%</p>
        </div>
      </div>

      {status === "failed" && canRetake && (
        <Button variant="outline" className="w-full bg-transparent">
          <RotateCcw className="h-4 w-4 mr-2" />
          Retake Quiz
        </Button>
      )}

      {status === "passed" && (
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Claim Certificate</Button>
      )}
    </div>
  )
}
