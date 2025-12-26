"use client"

import { useState, use, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { createCertificate } from "@/lib/certificates"
import { toast } from "sonner"
import { QuizData, QuizState } from "@/types/quiz-player"
import { IntroScreen } from "@/components/dashboard/quiz-player/intro-screen"
import { QuizScreen } from "@/components/dashboard/quiz-player/quiz-screen"
import { ResultsScreen } from "@/components/dashboard/quiz-player/results-screen"
import { ReviewScreen } from "@/components/dashboard/quiz-player/review-screen"

// --- Mock Data ---
// --- Mock Data Removed ---

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()

  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [quizState, setQuizState] = useState<QuizState>("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [generatedCertId, setGeneratedCertId] = useState<string | null>(null)
  const [hasGeneratedCert, setHasGeneratedCert] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const { getQuizById } = await import("@/app/actions/quizzes")
        const data = await getQuizById(id)
        if (!mounted) return

        if (data) {
          // Ensure questions are typed correctly
          const typedData: QuizData = {
            ...data,
            questions: data.questions.map((q: any) => ({
              id: q.id,
              type: q.type || 'single',
              question: q.question,
              options: q.options || [],
              correctAnswer: q.correctAnswer,
              correctAnswers: q.correctAnswers,
              explanation: q.explanation
            }))
          }
          setQuizData(typedData)
          setTimeRemaining(typedData.timeLimit * 60)
        } else {
          setError("Quiz not found")
        }
      } catch (e) {
        console.error(e)
        setError("Failed to load quiz")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  // Timer Logic
  useEffect(() => {
    if (!quizData) return

    if (quizState === "in-progress" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeRemaining === 0 && quizState === "in-progress") {
      setQuizState("results")
    }
  }, [quizState, timeRemaining, quizData])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>
  }

  if (error || !quizData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Quiz not found"}</div>
  }

  const handleSingleAnswer = (value: string) => {
    if (!quizData) return
    setAnswers((prev) => ({
      ...prev,
      [quizData.questions[currentQuestion].id]: parseInt(value),
    }))
  }

  const handleMultipleAnswer = (optionIndex: number, checked: boolean) => {
    if (!quizData) return
    const questionId = quizData.questions[currentQuestion].id
    const currentAnswers = (answers[questionId] as number[]) || []

    let newAnswers
    if (checked) {
      newAnswers = [...currentAnswers, optionIndex]
    } else {
      newAnswers = currentAnswers.filter((idx) => idx !== optionIndex)
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: newAnswers,
    }))
  }

  const toggleFlag = () => {
    if (flagged.includes(currentQuestion)) {
      setFlagged((prev) => prev.filter((idx) => idx !== currentQuestion))
    } else {
      setFlagged((prev) => [...prev, currentQuestion])
    }
  }

  // Calculate Score
  const calculateScore = () => {
    if (!quizData) return 0
    let correct = 0
    quizData.questions.forEach((q) => {
      const userAnswer = answers[q.id]
      if (userAnswer === undefined) return

      if (q.type === "single") {
        if (userAnswer === q.correctAnswer) correct++
      } else if (q.type === "multiple") {
        const userArr = (userAnswer as number[]).sort()
        const correctArr = (q.correctAnswers || []).sort()
        if (JSON.stringify(userArr) === JSON.stringify(correctArr)) correct++
      }
    })
    return Math.round((correct / quizData.totalQuestions) * 100)
  }

  const score = calculateScore()
  const passed = score >= quizData.passingScore
  const totalAnswered = Object.keys(answers).length

  // Certificate Generation Effect
  useEffect(() => {
    const generateCertificate = async () => {
      if (quizState === "results" && passed && user && !hasGeneratedCert && quizData) {
        setHasGeneratedCert(true);
        try {
          const cert = await createCertificate({
            userId: user.uid,
            courseId: quizData.id,
            studentName: user.displayName || "Student Name",
            courseName: quizData.courseTitle,
            instructorName: "Elystrix Instructor",
            tier: "L1"
          });
          setGeneratedCertId(cert.credentialId);
          toast.success("Certificate Generated!", {
            description: "You passed the quiz. Your certificate is ready."
          });
        } catch (error) {
          console.error("Failed to generate certificate", error);
          toast.error("Certificate generation failed.");
        }
      }
    };

    generateCertificate();
  }, [quizState, passed, user, hasGeneratedCert, quizData]);

  // Render Logic
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      {quizState === "intro" && (
        <IntroScreen quizData={quizData} setQuizState={setQuizState} />
      )}

      {quizState === "in-progress" && (
        <QuizScreen
          quizData={quizData}
          questonIndex={currentQuestion}
          answers={answers}
          flagged={flagged}
          timeRemaining={timeRemaining}
          setQuizState={setQuizState}
          setCurrentQuestion={setCurrentQuestion}
          handleSingleAnswer={handleSingleAnswer}
          handleMultipleAnswer={handleMultipleAnswer}
          toggleFlag={toggleFlag}
        />
      )}

      {quizState === "results" && (
        <ResultsScreen
          quizData={quizData}
          score={score}
          passed={passed}
          totalAnswered={totalAnswered}
          timeRemaining={timeRemaining}
          quizState={quizState}
          setQuizState={setQuizState}
          generatedCertId={generatedCertId}
          setAnswers={setAnswers}
          setFlagged={setFlagged}
          setCurrentQuestion={setCurrentQuestion}
          setTimeRemaining={setTimeRemaining}
        />
      )}

      {quizState === "review" && (
        <ReviewScreen
          quizData={quizData}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          answers={answers}
          setQuizState={setQuizState}
        />
      )}
    </div>
  )
}
