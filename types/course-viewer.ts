export interface Lesson {
    id: string
    title: string
    duration: string
    completed: boolean
    type: string
    current?: boolean
    locked?: boolean
    watchedPercentage?: number
}

export interface Module {
    id: string
    title: string
    duration: string
    lessons: Lesson[]
    expanded: boolean
    completed: boolean
    locked?: boolean
}

export interface CourseData {
    id: string
    title: string
    instructor: string
    progress: number
    totalLessons: number
    completedLessons: number
    totalDuration: string
    currentLesson: {
        id: string
        title: string
        duration: string
        videoId: string
        watchedPercentage?: number
        description?: string
    }
    modules: Module[]
    resources: { title: string; type: string; size: string }[]
    notes: { id: string; timestamp: string; content: string }[]
}
