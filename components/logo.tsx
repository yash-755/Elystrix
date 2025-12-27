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
    sm: 40,  // h-10 equivalent (40px) for public navbar
    md: 48,  // h-12 equivalent (48px) for admin sidebar
    lg: 64,  // h-16 equivalent (64px)
  }

  const heightClasses = {
    sm: "h-10",  // 40px for public navbar/sidebars
    md: "h-12",  // 48px for admin sidebar
    lg: "h-16",  // 64px for large displays
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="/logo-header.png"
        alt="Elystrix Logo"
        width={iconSizes[size]}
        height={iconSizes[size]}
        className={cn(heightClasses[size], "w-auto object-contain")}
      />
      <span className={cn("font-bold tracking-tight", sizes[size])}>
        <span className="text-yellow-500">Ely</span>
        <span className="text-foreground">strix</span>
      </span>
    </div >
  )
}
