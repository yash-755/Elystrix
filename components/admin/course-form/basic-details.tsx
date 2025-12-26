"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { uploadMedia } from "@/app/actions/upload"
import { toast } from "sonner"
import Image from "next/image"

export interface Category {
    id: string
    name: string
    slug: string
}

interface BasicDetailsProps {
    courseId?: string // Optional for edit mode

    // Core Fields
    title: string
    setTitle: (value: string) => void
    description: string
    setDescription: (value: string) => void
    thumbnailUrl: string
    setThumbnailUrl: (value: string) => void

    // Categorization
    categories: Category[]
    categoryId: string
    setCategoryId: (value: string) => void
    difficulty: string
    setDifficulty: (value: string) => void
    tags: string[]
    setTags: (value: string[]) => void

    // Instructor
    instructorName: string
    setInstructorName: (value: string) => void
    instructorChannelName: string
    setInstructorChannelName: (value: string) => void

    // Certificate
    certificateType: string
    setCertificateType: (value: string) => void
}

export function BasicDetails({
    title, setTitle,
    description, setDescription,
    thumbnailUrl, setThumbnailUrl,
    categories,
    categoryId, setCategoryId,
    difficulty, setDifficulty,
    tags, setTags,
    instructorName, setInstructorName,
    instructorChannelName, setInstructorChannelName,
    certificateType, setCertificateType
}: BasicDetailsProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tagInput, setTagInput] = useState("");

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size exceeds 5MB limit.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "elystrix/courses");

        try {
            const result = await uploadMedia(formData, "elystrix/courses");
            if (result.success && result.url) {
                setThumbnailUrl(result.url);
                toast.success("Thumbnail uploaded successfully");
            } else {
                throw new Error(result.error || "Upload failed");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to upload thumbnail");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleTagsBlur = () => {
        if (!tagInput.trim()) return;
        const newTags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
        // Merge unique tags
        const uniqueTags = Array.from(new Set([...tags, ...newTags]));
        setTags(uniqueTags);
        setTagInput("");
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Enter the course title, description and category.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                placeholder="e.g., React Masterclass: From Zero to Hero"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what students will learn in this course..."
                                className="min-h-[150px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category <span className="text-red-500">*</span></Label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Level</Label>
                                <Select value={difficulty} onValueChange={setDifficulty}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <Input
                                placeholder="Type tags and separate with commas..."
                                value={tagInput}
                                onChange={handleTagsChange}
                                onBlur={handleTagsBlur}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagsBlur())}
                            />
                            <p className="text-xs text-muted-foreground">Type and press comma or enter to add.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructor Card Moved Here for Better Flow */}
                <Card>
                    <CardHeader>
                        <CardTitle>Instructor Details</CardTitle>
                        <CardDescription>These details will appear on the certificate.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="instructorName">Instructor Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="instructorName"
                                placeholder="e.g. Sarah Chen"
                                value={instructorName}
                                onChange={(e) => setInstructorName(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                This name will be signed on the certificate.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructorChannelName">
                                Instructor YouTube Channel Name
                                {certificateType === "PREMIUM" && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <Input
                                id="instructorChannelName"
                                placeholder="e.g. CodeWithSarah"
                                value={instructorChannelName}
                                onChange={(e) => setInstructorChannelName(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Thumbnail <span className="text-red-500">*</span></CardTitle>
                    </CardHeader>
                    <CardContent>
                        {thumbnailUrl ? (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border group">
                                <Image
                                    src={thumbnailUrl}
                                    alt="Course Thumbnail"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setThumbnailUrl("")}
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition-colors cursor-pointer"
                                onClick={() => !uploading && fileInputRef.current?.click()}
                            >
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                                ) : (
                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                )}
                                <p className="text-sm text-muted-foreground">
                                    {uploading ? "Uploading..." : "Drop image here or click to upload"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">1280x720px recommended</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleThumbnailUpload}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Certificate Type</Label>
                            <Select value={certificateType} onValueChange={setCertificateType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select certificate" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BASIC">Basic Certificate</SelectItem>
                                    <SelectItem value="CAREER">Career Certificate (Pro/Elite Only)</SelectItem>
                                    {/* <SelectItem value="PREMIUM">Premium Certificate</SelectItem> Removed as per prompt focus on Basic/Career */}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Choose which certificate students receive upon completion.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
