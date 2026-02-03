import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bella Tavola — Authentic Italian, Reimagined',
  description:
    'Experience the soul of Italy in the heart of London. Handmade pasta, wood-fired pizza, and an unforgettable atmosphere. Reserve your table today.',
  keywords: ['Italian restaurant', 'London dining', 'authentic Italian food', 'fine dining', 'reservation'],
  openGraph: {
    title: 'Bella Tavola — Authentic Italian, Reimagined',
    description:
      'Experience the soul of Italy in the heart of London. Handmade pasta, wood-fired pizza, and an unforgettable atmosphere.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Bella Tavola',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Bella Tavola',
      description: 'Authentic Italian restaurant in London',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '42 Florence Street',
        addressLocality: 'London',
        postalCode: 'EC2A 4BQ',
        addressCountry: 'GB',
      },
      telephone: '+44 20 7946 0123',
      servesCuisine: 'Italian',
      priceRange: '££-£££',
    }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Restaurant',
              name: 'Bella Tavola',
              description: 'Authentic Italian restaurant in London',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '42 Florence Street',
                addressLocality: 'London',
                postalCode: 'EC2A 4BQ',
                addressCountry: 'GB',
              },
              telephone: '+44 20 7946 0123',
              servesCuisine: 'Italian',
              priceRange: '££-£££',
              openingHours: ['Tu-Th 12:00-22:00', 'Fr-Sa 12:00-23:00', 'Su 12:00-21:00'],
            }),
          }}
        />
      </head>
      <body className="bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
