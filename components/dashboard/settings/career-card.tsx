"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Combobox } from "@/components/ui/combobox"
import { ROLES } from "@/lib/locations"

interface CareerProps {
    user: any
    onSave: (data: any) => Promise<void>
    saving: boolean
}

export function CareerCard({ user, onSave, saving }: CareerProps) {
    const [careerStatus, setCareerStatus] = useState(user?.careerStatus || "")
    const [targetRole, setTargetRole] = useState(user?.targetRole || "")
    const [skills, setSkills] = useState<string[]>(user?.skills || [])
    const [skillInput, setSkillInput] = useState("")

    useEffect(() => {
        if (user) {
            setCareerStatus(user.careerStatus || "")
            setTargetRole(user.targetRole || "")
            setSkills(user.skills || [])
        }
    }, [user])

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && skillInput.trim()) {
            e.preventDefault()
            const newSkill = skillInput.trim()
            // Prevent duplicates (case-insensitive check for UX?)
            if (!skills.some(s => s.toLowerCase() === newSkill.toLowerCase()) && skills.length < 10) {
                setSkills([...skills, newSkill])
            }
            setSkillInput("")
        }
    }

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove))
    }

    const handleSubmit = () => {
        onSave({
            careerStatus,
            targetRole,
            skills
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Career & Skills</CardTitle>
                <CardDescription>Professional goals and technical skills.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Current Status</Label>
                    <Select value={careerStatus} onValueChange={setCareerStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="I am currently..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Job Seeker">Job Seeker</SelectItem>
                            <SelectItem value="Working Professional">Working Professional</SelectItem>
                            <SelectItem value="Freelancer">Freelancer</SelectItem>
                            <SelectItem value="Career Switcher">Career Switcher</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role">Target Role</Label>
                    <Combobox
                        options={ROLES}
                        value={targetRole}
                        onSelect={setTargetRole}
                        allowCustom={true}
                        placeholder="Select or Type Role"
                        searchPlaceholder="Search role..."
                        emptyText="Role not found. Type to add."
                        onCreateCustom={(val) => console.log("New role:", val)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="skills">Skills (Press Enter to add)</Label>
                    <Input
                        id="skills"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        placeholder="e.g. React, Python, Data Analysis"
                        disabled={skills.length >= 10}
                    />
                    <div className="flex flex-wrap gap-2 pt-2">
                        {skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                                {skill}
                                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeSkill(skill)} />
                            </Badge>
                        ))}
                    </div>
                    {skills.length >= 10 && <p className="text-[10px] text-destructive">Max 10 skills allowed.</p>}
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSubmit} disabled={saving} variant="outline">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Career Info"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
