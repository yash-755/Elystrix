export type NodeStatus = "locked" | "in-progress" | "completed";

export interface RoadmapNode {
    id: string;
    title: string;
    description?: string;
    duration?: string;
    status: NodeStatus;
}
