import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/account/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: 'https://dayofthenews.com/sitemap.xml',
  }
}
