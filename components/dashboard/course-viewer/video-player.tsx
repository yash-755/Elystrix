"use client"

import { useState, useEffect, useRef } from "react"
import { CourseData } from "@/types/course-viewer"
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube"
import { useAuth } from "@/components/auth-provider"
import { saveVideoProgress } from "@/app/actions/progress"
import { toast } from "sonner"

interface VideoPlayerProps {
    courseData: CourseData
    onProgressUpdate?: (lessonId: string, percent: number, completed: boolean) => void
}

export function VideoPlayer({ courseData, onProgressUpdate }: VideoPlayerProps) {
    const { user } = useAuth()
    const [player, setPlayer] = useState<YouTubePlayer | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const activeLesson = courseData.currentLesson

    // Tracking refs
    const lastTimeRef = useRef<number>(0)
    const accumulatedTimeRef = useRef<number>(0)
    const lastSavedPercentRef = useRef<number>(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isCompletedRef = useRef<boolean>(false)

    // Reset and Initialize Tracking on Lesson Change
    useEffect(() => {
        // Reset tracking variables
        lastTimeRef.current = 0

        // Initialize from server state
        // If server says 50%, we assume 50% accumulation.
        // We can't know absolute seconds until we know duration (onReady)
        const initialPercent = activeLesson.watchedPercentage || 0
        lastSavedPercentRef.current = initialPercent
        isCompletedRef.current = initialPercent >= 70
        // accumulatedTimeRef set in onReady

        // If same video reload, duration might be known? 
        // Safer to wait for onReady or just rely on player reference update?
        // react-youtube re-mounts on videoId change usually? 
        // Yes, if we use videoId as key or if the comp props change. 
        // We should add key={activeLesson.videoId} to YouTube component to force remount/clean state
    }, [activeLesson.id, activeLesson.watchedPercentage])

    const onReady = (event: YouTubeEvent) => {
        setPlayer(event.target)
        const duration = event.target.getDuration()

        // Restore accumulated time
        if (activeLesson.watchedPercentage && duration > 0) {
            accumulatedTimeRef.current = (activeLesson.watchedPercentage / 100) * duration
        } else {
            accumulatedTimeRef.current = 0
        }

        lastTimeRef.current = 0
    }

    const onStateChange = (event: YouTubeEvent) => {
        const status = event.data
        const PLAYING = 1
        setIsPlaying(status === PLAYING)

        if (status === PLAYING) {
            lastTimeRef.current = event.target.getCurrentTime()
        }
    }

    // Timer Loop
    useEffect(() => {
        if (isPlaying && player && user) {
            intervalRef.current = setInterval(() => {
                const currentTime = player.getCurrentTime()
                const duration = player.getDuration()

                if (!duration) return

                const dt = currentTime - lastTimeRef.current

                // Logic: Only accumulate if time advanced normally (0 < dt < 5s)
                // This prevents seeking from adding huge chunks of time
                if (dt > 0 && dt < 5) {
                    accumulatedTimeRef.current += dt
                }

                lastTimeRef.current = currentTime

                // Calculate percentage
                // Cap at 100
                const rawPercent = (accumulatedTimeRef.current / duration) * 100
                const percent = Math.min(100, Math.floor(rawPercent))

                // Save logic
                const COMPLETED_THRESHOLD = 70

                // 1. Just verified completion
                if (percent >= COMPLETED_THRESHOLD && !isCompletedRef.current) {
                    isCompletedRef.current = true
                    saveProgress(percent, true, true) // force complete param
                }
                // 2. Periodic save (every 5% or just periodic)
                // Let's save every 5% progress
                else if (percent > lastSavedPercentRef.current + 5) {
                    saveProgress(percent, isCompletedRef.current, false)
                }

            }, 1000)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isPlaying, player, user, activeLesson.id])

    const saveProgress = async (percent: number, completed: boolean, showToast: boolean) => {
        if (!user) return

        lastSavedPercentRef.current = percent

        // Optimistic UI Update
        if (onProgressUpdate) {
            onProgressUpdate(activeLesson.id, percent, completed)
        }

        try {
            const res = await saveVideoProgress(user.uid, courseData.id, activeLesson.id, percent)

            if (showToast && res.lessonCompleted) {
                toast.success("Lesson Completed!", { description: "Progress saved." })
            }
        } catch (e) {
            console.error("Failed to save progress", e)
        }
    }

    // YouTube Options
    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
        },
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-border/50 ring-1 ring-border/50">
                {/* Key ensures remount on video change */}
                <YouTube
                    key={activeLesson.videoId}
                    videoId={activeLesson.videoId}
                    opts={opts}
                    className="w-full h-full absolute top-0 left-0"
                    onReady={onReady}
                    onStateChange={onStateChange}
                />
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{activeLesson.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>{courseData.title}</span>
                        <span>•</span>
                        <span>{courseData.instructor}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
