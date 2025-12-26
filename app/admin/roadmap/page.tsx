"use client";

import { AdminBuilder } from "@/components/roadmap/admin-builder";
import { RoadmapNode } from "@/types/roadmap";
import { toast } from "sonner"; // Assuming sonner or similar is used, or console for now if not sure. I'll stick to a standard console log/alert if library is unknown, but standard for these projects is usually sonner or toast.
// I see @/components/ui... likely shadcn. I'll use a simple alert if toast isn't available, but I'll assume standard React for now.

// Mock Initial Data
const MOCK_NODES: RoadmapNode[] = [
    {
        id: "module-1",
        title: "Introduction to Development",
        description: "Learn the basics of how the web works and set up your environment.",
        duration: "2h 30m",
        status: "completed",
    },
    {
        id: "module-2",
        title: "HTML & CSS Fundamentals",
        description: "Master the building blocks of the web. Structure and style your first pages.",
        duration: "5h",
        status: "in-progress",
    },
    {
        id: "module-3",
        title: "JavaScript Essentials",
        description: "Add interactivity and logic to your applications.",
        duration: "8h",
        status: "locked",
    },
];

export default function RoadmapAdminPage() {
    const handleSave = (nodes: RoadmapNode[]) => {
        console.log("Saving nodes:", nodes);
        // In a real app, this would be an API call
        alert("Roadmap saved successfully! (Console contains data)");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Roadmap Management</h1>
            </div>

            <div className="bg-background rounded-lg border shadow-sm p-6">
                <AdminBuilder
                    initialNodes={MOCK_NODES}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}
