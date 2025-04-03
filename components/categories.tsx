import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "women",
    name: "Women",
    image: "https://img.freepik.com/free-photo/portrait-beautiful-woman-holding-shopping-bag_329181-18532.jpg?t=st=1742113260~exp=1742116860~hmac=84c840acb5618443b727103aac6fee9443dcdf89191f8e15b946a13ab37d6ad8&w=740",
    db_name: "women"
  },
  {
    id: "tops",
    name: "Kids",
    image: "https://img.freepik.com/free-photo/young-teenage-girl-recording-reels-herself-outdoors-social-media_23-2149749821.jpg?t=st=1742113341~exp=1742116941~hmac=7640d5fbb135978f0fa8a56fe3c866a278222c1a6a2a1d9e271a4f1cf9c1fd6a&w=740",
    db_name: "kids"
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://img.freepik.com/free-photo/full-body-portrait-happy-smiling-beautiful-young-woman-white_231208-9033.jpg?t=st=1742113609~exp=1742117209~hmac=af3c47ca4dfba7ed9939d440197049519712de8796cf6cfad4a07ca57d3f60a2&w=740",
    db_name: "accessories"
  },
  {
    id: "home",
    name: "Home",
    image: "https://img.freepik.com/free-photo/mixed-color-tailoring-leather-tissues-catalog_114579-7247.jpg?t=st=1742113665~exp=1742117265~hmac=c3d008788c4ae8e38847c4b3be7a262490435273893cbba610b49aba64e44acc&w=740",
    db_name: "home"
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
              href={`/shop/products?category=${encodeURIComponent(category.db_name)}`}
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

