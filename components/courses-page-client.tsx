'use client'

import { useState, useMemo } from 'react'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CourseCard } from "@/components/course-card"
import { CoursesFilter, FilterState } from "@/components/courses-filter"

interface CoursesPageClientProps {
    initialCourses: any[]
    categories: any[]
}

export default function CoursesPageClient({ initialCourses, categories }: CoursesPageClientProps) {
    const [appliedFilters, setAppliedFilters] = useState<FilterState>({
        categories: [],
        levels: [],
        durations: []
    })

    const filteredCourses = useMemo(() => {
        let filtered = [...initialCourses]

        // Apply category filter
        if (appliedFilters.categories.length > 0) {
            filtered = filtered.filter(course =>
                course.category?.id && appliedFilters.categories.includes(course.category.id)
            )
        }

        // Apply level filter
        if (appliedFilters.levels.length > 0) {
            filtered = filtered.filter(course =>
                course.difficulty && appliedFilters.levels.includes(course.difficulty)
            )
        }

        // Apply duration filter (if courses have duration data)
        if (appliedFilters.durations.length > 0) {
            filtered = filtered.filter(course => {
                const duration = course.duration || "0h"
                // Match duration ranges like "0-2 hours", "2-5 hours", etc.
                for (const durationFilter of appliedFilters.durations) {
                    if (durationFilter.includes("0-2") && duration.includes("h") && parseInt(duration) <= 2) {
                        return true
                    }
                    if (durationFilter.includes("2-5") && duration.includes("h")) {
                        const hours = parseInt(duration)
                        if (hours > 2 && hours <= 5) return true
                    }
                    if (durationFilter.includes("5-10") && duration.includes("h")) {
                        const hours = parseInt(duration)
                        if (hours > 5 && hours <= 10) return true
                    }
                    if (durationFilter.includes("10+") && duration.includes("h")) {
                        const hours = parseInt(duration)
                        if (hours > 10) return true
                    }
                }
                return false
            })
        }

        return filtered
    }, [initialCourses, appliedFilters])

    const handleApplyFilters = (filters: FilterState) => {
        setAppliedFilters(filters)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <section className="py-12 md:py-20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mb-12">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Browse Courses</h1>
                            <p className="text-lg text-muted-foreground">Explore our curated collection of YouTube-powered courses</p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <aside className="lg:w-64 shrink-0">
                                <CoursesFilter categories={categories} onApplyFilters={handleApplyFilters} />
                            </aside>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm text-muted-foreground">{filteredCourses.length} courses found</p>
                                </div>

                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredCourses.length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-muted-foreground">
                                            No courses match your filters. Try adjusting your selection.
                                        </div>
                                    ) : (
                                        filteredCourses.map((course: any) => (
                                            <CourseCard
                                                key={course.id}
                                                id={course.id}
                                                title={course.title}
                                                description={course.description || ""}
                                                thumbnail={course.thumbnailUrl || course.thumbnail || ""}
                                                duration={course.duration || "0h"}
                                                modules={0}
                                                level={course.difficulty || "Beginner"}
                                                category={course.category?.name || "General"}
                                                rating={course.rating}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
