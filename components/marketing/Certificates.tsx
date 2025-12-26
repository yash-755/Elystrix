import { Award, CheckCircle, Share2, Shield } from "lucide-react"

const certificateLevels = [
  {
    level: "L1",
    name: "Premium Certificate",
    color: "#D4AF37",
    description: "Premium certification for comprehensive learning paths",
    features: ["Full path completion", "Advanced quizzes", "LinkedIn badge", "Employer verified"],
  },
  {
    level: "L2",
    name: "Career Certificate",
    color: "#C0C0C0",
    description: "Professional certification for individual courses",
    features: ["Course completion", "Standard quiz", "Shareable link", "Digital download"],
  },
  {
    level: "L3",
    name: "Basic Certificate",
    color: "#F8F8F8",
    description: "Participation certificate for course completion",
    features: ["Module completion", "Basic verification", "PDF download", "Course badge"],
  },
]

export function Certificates() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Verified Certificates</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Earn recognized credentials that showcase your skills to employers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {certificateLevels.map((cert) => (
            <div
              key={cert.level}
              className="relative bg-card rounded-2xl border-2 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl"
              style={{ borderColor: cert.color, boxShadow: `0 0 30px ${cert.color}20` }}
            >
              {/* Certificate Header */}
              <div
                className="p-6 text-center"
                style={{ background: `linear-gradient(135deg, ${cert.color}10, transparent)` }}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: cert.color }}
                >
                  <Award className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{cert.name}</h3>
                <p className="text-sm text-muted-foreground">{cert.description}</p>
              </div>

              {/* Features */}
              <div className="p-6 border-t border-border">
                <ul className="space-y-3">
                  {cert.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: cert.color }} />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-sm">Blockchain Verified</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Share2 className="h-6 w-6 text-primary" />
            <span className="text-sm">LinkedIn Compatible</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="text-sm">Employer Trusted</span>
          </div>
        </div>
      </div>
    </section>
  )
}
