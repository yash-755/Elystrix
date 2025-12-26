"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { COURSE_LEVELS, COURSE_DURATIONS } from "@/lib/constants"

export interface FilterState {
  categories: string[]
  levels: string[]
  durations: string[]
}

interface CoursesFilterProps {
  categories?: { id: string, name: string }[]
  onApplyFilters: (filters: FilterState) => void
}

export function CoursesFilter({ categories = [], onApplyFilters }: CoursesFilterProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    )
  }

  const toggleDuration = (duration: string) => {
    setSelectedDurations(prev =>
      prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    )
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      categories: selectedCategories,
      levels: selectedLevels,
      durations: selectedDurations
    })
    // Close mobile menu after applying filters
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <Button
        variant="outline"
        className="lg:hidden mb-4 w-full bg-transparent"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
      </Button>

      <div className={`${mobileOpen ? "block" : "hidden"} lg:block`}>
        <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-10 bg-transparent" />
          </div>

          <Accordion type="multiple" defaultValue={["categories", "levels"]} className="space-y-2">
            {/* Categories */}
            <AccordionItem value="categories" className="border-none">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Categories</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                {categories.length > 0 ? categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label htmlFor={category.id} className="text-sm text-muted-foreground cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No categories found</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Levels */}
            <AccordionItem value="levels" className="border-none">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Level</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                {COURSE_LEVELS.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={level}
                      checked={selectedLevels.includes(level)}
                      onCheckedChange={() => toggleLevel(level)}
                    />
                    <Label htmlFor={level} className="text-sm text-muted-foreground cursor-pointer">
                      {level}
                    </Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Duration */}
            <AccordionItem value="duration" className="border-none">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Duration</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                {COURSE_DURATIONS.map((duration) => (
                  <div key={duration} className="flex items-center space-x-2">
                    <Checkbox
                      id={duration}
                      checked={selectedDurations.includes(duration)}
                      onCheckedChange={() => toggleDuration(duration)}
                    />
                    <Label htmlFor={duration} className="text-sm text-muted-foreground cursor-pointer">
                      {duration}
                    </Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button
            className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  )
}
