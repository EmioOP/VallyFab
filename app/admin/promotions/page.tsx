import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div>
        <h1 className='text-red-500 p-4'>for listing the promotional features like featured product in shop, discounts, and this like that...-unnder development phase</h1>

        <div>
            <Link href="/admin/featured-products">
                <button className="bg-blue-500 text-white px-4 py-2 m-4 rounded hover:bg-blue-600 transition duration-300">
                    Manage Featured Products
                </button>
            </Link>
        </div>
    </div>
  )
}
