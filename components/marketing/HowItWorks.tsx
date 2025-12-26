import { Search, Play, CheckCircle, Award } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Choose Your Course",
    description: "Browse our curated catalog of YouTube-powered courses across various domains.",
  },
  {
    icon: Play,
    title: "Learn at Your Pace",
    description: "Watch video lessons, track progress, and learn whenever and wherever you want.",
  },
  {
    icon: CheckCircle,
    title: "Pass the Quiz",
    description: "Test your knowledge with our comprehensive quizzes to validate your learning.",
  },
  {
    icon: Award,
    title: "Get Certified",
    description: "Earn verified certificates that you can share on LinkedIn and with employers.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How Elystrix Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your journey from curious learner to certified professional in four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="bg-card rounded-2xl border border-border p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 relative">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
