import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer at Meta",
    avatar: "/professional-woman-avatar.png",
    content:
      "Elystrix helped me transition from marketing to tech. The structured paths and certificates gave me the credibility I needed to land my dream job.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Data Scientist",
    avatar: "/professional-man-avatar.png",
    content:
      "The quality of curated YouTube content combined with verified certificates is unmatched. I've recommended Elystrix to my entire team.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "UX Designer at Spotify",
    avatar: "/professional-woman-avatar-indian.jpg",
    content:
      "What I love about Elystrix is how it turns free YouTube content into a structured learning experience with real credentials.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Students Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of learners who have transformed their careers with Elystrix
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card rounded-2xl border border-border p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <Quote className="h-8 w-8 text-primary/30 mb-4" />
              <p className="text-muted-foreground mb-6">{testimonial.content}</p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
