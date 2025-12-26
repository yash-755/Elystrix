"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { INDIAN_STATES, getCitiesForState } from "@/lib/locations"

interface BasicInfoProps {
    user: any
    onSave: (data: any) => Promise<void>
    saving: boolean
}

export function BasicInfoCard({ user, onSave, saving }: BasicInfoProps) {
    const [bio, setBio] = useState(user?.bio || "")
    const [phone, setPhone] = useState(user?.phone || "")
    const [language, setLanguage] = useState(user?.language || "en")
    const [country, setCountry] = useState(user?.country || "India")
    const [state, setState] = useState(user?.state || "")
    const [city, setCity] = useState(user?.city || "")

    // Sync state with user prop (Critical for persistence)
    useEffect(() => {
        if (user) {
            setBio(user.bio || "")
            setPhone(user.phone || "")
            setLanguage(user.language || "en")
            setCountry(user.country || "India")
            setState(user.state || "")
            // Only set city if state matches to avoid conflict, or just trust DB? Trust DB.
            setCity(user.city || "")
        }
    }, [user])

    // Reset city when state changes, unless it's initial load match
    const handleStateChange = (val: string) => {
        setState(val)
        if (val !== user?.state) {
            setCity("") // Clear city if state changes
        }
    }

    const handleSubmit = () => {
        onSave({
            bio,
            phone,
            language,
            country,
            state,
            city
        })
    }

    const cityOptions = getCitiesForState(state)

    return (
        <Card>
            <CardHeader>
                <CardTitle>About You</CardTitle>
                <CardDescription>Tell us a bit about yourself and where you're from.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="I am a passionate learner..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="min-h-[100px] resize-none"
                        maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Country fixed to India for MVP but editable */}
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
                    </div>

                    <div className="space-y-2">
                        <Label>State</Label>
                        <Combobox
                            options={INDIAN_STATES}
                            value={state}
                            onSelect={handleStateChange}
                            placeholder="Select State"
                            searchPlaceholder="Search state..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>City</Label>
                        <Combobox
                            options={cityOptions}
                            value={city}
                            onSelect={setCity}
                            allowCustom={true}
                            placeholder="Select or Type City"
                            searchPlaceholder="Search city..."
                            emptyText="No city found. Type to add."
                            onCreateCustom={(val) => console.log("New city typed:", val)}
                            disabled={!state}
                            className={!state ? "opacity-50" : ""}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">Hindi</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="ja">Japanese</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className={!phone ? "placeholder:text-muted-foreground/50" : ""}
                    />
                    <p className="text-[10px] text-muted-foreground">Used only for important account alerts.</p>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSubmit} disabled={saving} variant="outline">
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Basic Info"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
