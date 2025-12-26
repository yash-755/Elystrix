import { Download, Share2, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface CertificateCardProps {
  id: string
  courseName: string
  issueDate: string
  level: "L1" | "L2" | "L3"
  verificationCode: string
  studentName: string
  // New props
  pdfUrl?: string | null
  verificationUrl?: string
}

export function CertificateCard({
  id,
  courseName,
  issueDate,
  level,
  verificationCode,
  studentName,
  pdfUrl,
  verificationUrl
}: CertificateCardProps) {
  const levelConfig = {
    L1: {
      label: "Gold",
      color: "bg-[#D4AF37]",
      borderColor: "border-[#D4AF37]",
      textColor: "text-[#D4AF37]",
      bgGlow: "shadow-[0_0_30px_rgba(212,175,55,0.3)]",
    },
    L2: {
      label: "Career",
      color: "bg-[#C0C0C0]",
      borderColor: "border-[#C0C0C0]",
      textColor: "text-[#C0C0C0]",
      bgGlow: "shadow-[0_0_30px_rgba(192,192,192,0.3)]",
    },
    L3: {
      label: "White",
      color: "bg-white dark:bg-gray-200",
      borderColor: "border-gray-300",
      textColor: "text-gray-600",
      bgGlow: "shadow-[0_0_30px_rgba(255,255,255,0.2)]",
    },
  }

  const config = levelConfig[level] || levelConfig.L1

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      toast.error("Certificate PDF not available yet.");
    }
  }

  const handleShare = () => {
    if (verificationUrl) {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`;
      window.open(linkedinUrl, '_blank', 'width=600,height=600');
    } else {
      toast.error("Verification URL missing.");
    }
  }

  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:-translate-y-1",
        config.borderColor,
        config.bgGlow,
      )}
    >
      {/* Certificate Preview */}
      <div className="aspect-[4/3] relative p-6 bg-gradient-to-br from-card to-muted/50">
        <div className="absolute top-4 right-4">
          <Badge className={cn(config.color, "text-black font-semibold")}>{config.label} Certificate</Badge>
        </div>

        <div className="h-full flex flex-col justify-center items-center text-center">
          <div className={cn("w-16 h-16 rounded-full mb-4", config.color)} />
          <p className="text-xs text-muted-foreground mb-1">Certificate of Completion</p>
          <h3 className="font-bold text-lg text-foreground mb-2">{courseName}</h3>
          <p className="text-sm text-muted-foreground">Awarded to</p>
          <p className={cn("font-semibold text-lg", config.textColor)}>{studentName}</p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">Issued: {issueDate}</p>
          <p className="text-xs font-mono text-muted-foreground">{verificationCode}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleDownload} disabled={!pdfUrl}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          {verificationUrl && (
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
