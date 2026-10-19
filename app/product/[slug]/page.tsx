import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { products } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return {
      title: 'Article introuvable | ATELIER 212',
    };
  }

  return {
    title: `${product.name} | ATELIER 212`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ATELIER 212`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  // Related products from same category or general list
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isNew))
    .slice(0, 4);

  // Structured Data (JSON-LD Product Schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'ATELIER 212',
    },
    offers: {
      '@type': 'Offer',
      url: `https://atelier212.ma/product/${product.slug}`,
      priceCurrency: 'MAD',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'ATELIER 212 Casablanca',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: 38,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
