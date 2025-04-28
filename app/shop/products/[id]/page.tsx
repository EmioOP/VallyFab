import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailPage from '@/components/ProductDetailsPage';

async function getProduct(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const {id} = await params
  const { product } = await getProduct(id);


  console.log(product)

  if (!product) return {
    title: 'Product Not Found',
    description: 'The requested product does not exist.',
  };

  const imageUrl = product.image.startsWith('http')
    ? `${product.image}?tr=w-1200,h-630,cm-pad_resize` // Add image transformation params
    : `${process.env.NEXT_PUBLIC_SITE_URL}${product.image}?tr=w-1200,h-630,cm-pad_resize`;

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description || 'Discover this amazing product',
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: product.name,
      }],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/products/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || 'Discover this amazing product',
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const {id} = await params
  const { product } = await getProduct(id);

  console.log(product)
  
  if (!product) notFound();

  return <ProductDetailPage serverProduct={product} />;
}