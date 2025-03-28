import { Button } from "./ui/button"

export default function Newsletter() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Join to our WhatsApp Community be the first to know about new collections, special offers, and exclusive
            events.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="number"
              placeholder="Enter Your WhatsApp Number"
              className="flex-1 rounded-md border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <Button className="bg-rosegold hover:bg-rosegold/90">Submit</Button>
          </form>
        </div>
      </div>
    </section>
  )
}

