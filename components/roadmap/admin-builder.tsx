"use client";

import { useState } from "react";
import { RoadmapNode } from "@/types/roadmap";
import { RoadmapView } from "./roadmap-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowUp, ArrowDown, Trash2, Save, Eye, EyeOff } from "lucide-react";

interface AdminBuilderProps {
    initialNodes?: RoadmapNode[];
    onSave?: (nodes: RoadmapNode[]) => void;
}

export interface BuilderNode extends RoadmapNode { }

export function AdminBuilder({ initialNodes = [], onSave }: AdminBuilderProps) {
    const [nodes, setNodes] = useState<RoadmapNode[]>(initialNodes);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const handleAddNode = () => {
        const id = `node-${Date.now()}`;
        const newNode: RoadmapNode = {
            id,
            title: "New Module",
            description: "",
            duration: "1h",
            status: "locked",
        };
        setNodes([...nodes, newNode]);
    };

    const handleDeleteNode = (id: string) => {
        setNodes(nodes.filter((node) => node.id !== id));
    };

    const handleMoveNode = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === nodes.length - 1) return;

        const newNodes = [...nodes];
        const swapIndex = direction === "up" ? index - 1 : index + 1;
        [newNodes[index], newNodes[swapIndex]] = [newNodes[swapIndex], newNodes[index]];
        setNodes(newNodes);
    };

    const updateNodeField = (id: string, field: keyof RoadmapNode, value: string) => {
        setNodes(nodes.map((n) => (n.id === id ? { ...n, [field]: value } : n)));
    };

    return (
        <div className="space-y-6">
            {/* Builder Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur z-50 py-4 border-b">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        Roadmap Builder
                        {isPreviewMode && (
                            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                Preview Mode
                            </span>
                        )}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {nodes.length} modules configured
                    </p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                        {isPreviewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {isPreviewMode ? "Edit" : "Preview"}
                    </Button>

                    <Button onClick={handleAddNode} className="flex-1 sm:flex-none">
                        <Plus className="w-4 h-4 mr-2" /> Add Module
                    </Button>

                    <Button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 sm:flex-none"
                        onClick={() => onSave?.(nodes)}
                    >
                        <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                </div>
            </div>

            {isPreviewMode ? (
                <div className="border rounded-xl bg-muted/10 min-h-[600px]">
                    <RoadmapView nodes={nodes} />
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-4 pb-20">
                    {nodes.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-card">
                            No modules added yet. Click "Add Module" to start building the roadmap.
                        </div>
                    )}

                    {nodes.map((node, index) => (
                        <div
                            key={node.id}
                            className="group flex gap-4 items-start bg-card p-6 rounded-xl border hover:border-primary/50 transition-all shadow-sm"
                        >
                            <div className="flex flex-col gap-1 mt-1 text-muted-foreground">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === 0}
                                    onClick={() => handleMoveNode(index, "up")}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </Button>
                                <div className="flex items-center justify-center font-mono text-xs font-bold w-8 h-8 rounded bg-muted">
                                    {index + 1}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === nodes.length - 1}
                                    onClick={() => handleMoveNode(index, "down")}
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Title</Label>
                                        <Input
                                            value={node.title}
                                            onChange={(e) => updateNodeField(node.id, "title", e.target.value)}
                                            placeholder="Module Title"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold uppercase text-muted-foreground">Status</Label>
                                        <Select
                                            value={node.status}
                                            onValueChange={(val: any) => updateNodeField(node.id, "status", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="locked">Locked</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Duration</Label>
                                    <Input
                                        value={node.duration}
                                        onChange={(e) => updateNodeField(node.id, "duration", e.target.value)}
                                        placeholder="e.g. 2h 30m"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase text-muted-foreground">Description</Label>
                                    <Textarea
                                        rows={3}
                                        value={node.description}
                                        onChange={(e) => updateNodeField(node.id, "description", e.target.value)}
                                        className="resize-none"
                                        placeholder="Enter a brief description of this module..."
                                    />
                                </div>
                            </div>

                            <div className="ml-2 pt-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleDeleteNode(node.id)}
                                    title="Delete Module"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

