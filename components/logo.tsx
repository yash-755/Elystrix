import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  }

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/logo-header.png"
        alt="Elystrix Logo"
        width={iconSizes[size]}
        height={iconSizes[size]}
        className="object-contain" // Ensures aspect ratio is maintained
      />
      <span className={cn("font-bold tracking-tight", sizes[size])}>
        <span className="text-yellow-500">Ely</span>
        <span className="text-foreground">strix</span>
      </span>
    </div >
  )
}
