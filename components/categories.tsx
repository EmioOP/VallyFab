import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "women",
    name: "Women",
    image: "https://ik.imagekit.io/bufohim2jd/blog-image_iia1S0KhT.jpg",
    db_id: "67e236c78090c10b23959174"
  },
  {
    id: "tops",
    name: "Kids",
    image: "/kids.jpeg",
    db_id: "67e236fa8090c10b23959179"
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/accessories.jpeg",
    db_id: "67e2372c8090c10b23959183"
  },
  {
    id: "home",
    name: "Home",
    image: "/home-decor.jpeg",
    db_id: "67e2373d8090c10b23959188"
  },
]

export default function Categories() {
  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Shop by Category</h2>
          <p className="mt-2 text-sm md:text-base text-gray-600">Browse our collections by category</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[calc(100vh-180px)] md:h-auto">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/products?category=${category.db_id}`}
              className="group relative h-full w-full overflow-hidden rounded-lg"
            >
              <div className="relative h-full w-full">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={400}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                  <h3 className="text-lg md:text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

