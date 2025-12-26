"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { DEGREES } from "@/lib/locations"

interface EducationProps {
    user: any
    onSave: (data: any) => Promise<void>
    saving: boolean
}

export function EducationCard({ user, onSave, saving }: EducationProps) {
    const [qualification, setQualification] = useState(user?.qualification || "")
    const [degree, setDegree] = useState(user?.degree || "")
    const [college, setCollege] = useState(user?.college || "")
    const [graduationYear, setGraduationYear] = useState(user?.graduationYear || "")

    useEffect(() => {
        if (user) {
            setQualification(user.qualification || "")
            setDegree(user.degree || "")
            setCollege(user.college || "")
            setGraduationYear(user.graduationYear || "")
        }
    }, [user])

    const handleSubmit = () => {
        onSave({
            qualification,
            degree,
            college,
            graduationYear
        })
    }

    const years = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() + 5 - i).toString())

    return (
        <Card>
            <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>Your academic background.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="qualification">Highest Qualification</Label>
                    <Select value={qualification} onValueChange={setQualification}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Qualification" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="High School">High School</SelectItem>
                            <SelectItem value="Undergraduate">Undergraduate (B.Tech, B.Sc, etc.)</SelectItem>
                            <SelectItem value="Postgraduate">Postgraduate (M.Tech, MBA, etc.)</SelectItem>
                            <SelectItem value="PhD">PhD</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="degree">Degree / Course</Label>
                    <Combobox
                        options={DEGREES}
                        value={degree}
                        onSelect={setDegree}
                        allowCustom={true}
                        placeholder="Select or Type Degree"
                        searchPlaceholder="Search degree..."
                        emptyText="Degree not found. Type to add."
                        onCreateCustom={(val) => console.log("New degree:", val)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="college">College / University</Label>
                    <Input id="college" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="University of Technology" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="year">Graduation Year</Label>
                    <Select value={graduationYear} onValueChange={setGraduationYear}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSubmit} disabled={saving} variant="outline">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Education"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
