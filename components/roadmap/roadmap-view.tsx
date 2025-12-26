import { RoadmapNode as NodeData } from "@/types/roadmap";
import { RoadmapNode } from "./roadmap-node";
import { cn } from "@/lib/utils";

interface RoadmapViewProps {
    nodes: NodeData[];
}

export function RoadmapView({ nodes }: RoadmapViewProps) {
    if (!nodes.length) {
        return <div className="text-center py-12 text-muted-foreground">No roadmap modules found.</div>;
    }

    return (
        <div className="relative container max-w-4xl mx-auto py-12 px-4">
            {/* Central Spine (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -ml-[1px] bg-border" />

            <div className="relative space-y-8 md:space-y-0">
                {nodes.map((node, index) => {
                    const isRight = index % 2 !== 0;
                    const status = node.status;

                    return (
                        <div key={node.id} className="relative group">
                            {/* Central Spine Dot (Desktop) */}
                            <div
                                className={cn(
                                    "hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-background z-20",
                                    status === "completed" ? "bg-green-500" :
                                        status === "in-progress" ? "bg-primary animate-pulse" :
                                            "bg-border"
                                )}
                            />

                            {/* Mobile Layout (Stacked) */}
                            <div className="md:hidden pl-8 border-l-2 border-border ml-3 pb-8 last:pb-0 relative">
                                <div
                                    className={cn(
                                        "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-background",
                                        status === "completed" ? "bg-green-500" :
                                            status === "in-progress" ? "bg-primary" :
                                                "bg-border"
                                    )}
                                />
                                <RoadmapNode
                                    {...node}
                                    index={index}
                                    isRight={false}
                                />
                            </div>

                            {/* Desktop Layout (Alternating) */}
                            <div className="hidden md:block">
                                <RoadmapNode
                                    {...node}
                                    index={index}
                                    isRight={isRight}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* End Marker */}
            <div className="flex flex-col items-center justify-center mt-12 relative z-10">
                <div className="w-3 h-3 bg-border rounded-full" />
            </div>
        </div>
    );
}
