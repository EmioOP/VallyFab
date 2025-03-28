import Image from "next/image"

const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Fashion Designer",
    content:
      "The quality of fabrics from Vally is exceptional. I've been using them for my designs for years and my clients always notice the difference.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Regular Customer",
    content:
      "I love the unique pieces I've found at Vally. The attention to detail and quality of materials is unmatched. Highly recommend!",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    role: "Interior Designer",
    content:
      "Vally's fabrics have transformed my home decor projects. Their selection is diverse and the customer service is always helpful.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary">What Our Customers Say</h2>
          <p className="mt-2 text-gray-600">Hear from our satisfied customers</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-primary">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

