"use client"

import { useEffect, useState } from "react"
import { LearningPathCard } from "@/components/learning-path-card"
import { useAuth } from "@/components/auth-provider"
import { getUserLearningPaths } from "@/app/actions/learning-paths"
import { Loader2 } from "lucide-react"

export default function LearningPathsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<{ enrolled: any[], recommended: any[] }>({ enrolled: [], recommended: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (user?.uid) {
        setLoading(true)
        try {
          const res = await getUserLearningPaths(user.uid)
          setData(res)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      } else if (!user) {
        setLoading(false) // or keep loading if auth is initialising? useAuth handles that.
      }
    }
    fetchData()
  }, [user])

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
  }

  const { enrolled: enrolledPaths, recommended: recommendedPaths } = data

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Learning Paths</h1>
        <p className="text-muted-foreground">Structured roadmaps to achieve your career goals</p>
      </div>

      {/* Enrolled Paths */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Enrolled Paths</h2>
        {enrolledPaths.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {enrolledPaths.map((path) => (
              <LearningPathCard
                key={path.id}
                {...path}
                href={`/dashboard/paths/${path.id}`}
                certificateType={path.certificateType || "BASIC"}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 border border-dashed rounded-lg text-center text-muted-foreground">
            You are not enrolled in any learning paths.
          </div>
        )}
      </section>

      {/* Recommended Paths */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recommended For You</h2>
        {recommendedPaths.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {recommendedPaths.map((path) => (
              <LearningPathCard
                key={path.id}
                {...path}
                href={`/dashboard/paths/${path.id}`}
                certificateType={path.certificateType || "BASIC"}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No recommendations available at the moment.
          </div>
        )}
      </section>
    </div>
  )
}

