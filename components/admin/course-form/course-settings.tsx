"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function CourseSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Enable Comments</p>
                        <p className="text-sm text-muted-foreground">Allow students to comment on lessons</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Enable Notes</p>
                        <p className="text-sm text-muted-foreground">Allow students to take notes while watching</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Sequential Learning</p>
                        <p className="text-sm text-muted-foreground">Require students to complete lessons in order</p>
                    </div>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Featured Course</p>
                        <p className="text-sm text-muted-foreground">Show this course on the homepage</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
        </Card>
    )
}
