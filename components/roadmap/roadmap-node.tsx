import { RoadmapNode as NodeData } from "@/types/roadmap";
import { CheckCircle, Circle, Lock, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RoadmapNodeProps extends NodeData {
  index: number;
  isRight: boolean;
}

export function RoadmapNode({
  id,
  title,
  description,
  duration,
  status,
  index,
  isRight,
}: RoadmapNodeProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";

  return (
    <div
      className={cn(
        "relative flex items-center mb-16 w-full",
        isRight ? "justify-start flex-row-reverse" : "justify-end"
      )}
    >
      {/* Connector Line */}
      <div
        className={cn(
          "absolute top-1/2 w-[50%] h-[2px] border-t-2 border-dashed border-border z-0",
          isRight ? "left-1/2" : "right-1/2"
        )}
      />

      {/* Node Card */}
      <div
        className={cn(
          "relative w-[45%] z-10 p-6 rounded-xl border bg-card transition-all",
          isLocked && "opacity-60 grayscale",
          isInProgress && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg",
          !isLocked && "hover:scale-[1.02] hover:shadow-md"
        )}
      >
        {/* Index Badge */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-sm shadow-sm z-20">
          {index + 1}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className={cn("font-bold text-lg leading-tight", isLocked && "text-muted-foreground")}>
              {title}
            </h3>
            {isCompleted && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
            {isInProgress && <Circle className="w-5 h-5 text-primary fill-primary/20 shrink-0 animate-pulse" />}
            {isLocked && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {duration}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}

          {isInProgress && (
            <Link href={`/dashboard/learn/${id}`} className="block pt-2">
              <Button size="sm" className="w-full font-semibold">
                Continue Learning <Play className="w-3.5 h-3.5 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
