export default defineEventHandler(async (event) => {
  const SITE_URL = 'https://techrank-books.com' // Replace it with actual domain
  const BOOKS_PER_PAGE = 24
  const TOTAL_BOOKS = 500 // This would come from your API in real implementation
  const TOTAL_PAGES = Math.ceil(TOTAL_BOOKS / BOOKS_PER_PAGE)
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main ranking page (infinite scroll) -->
  <url>
    <loc>${SITE_URL}/ranking</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Paginated ranking pages -->
  ${Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(page => `
  <url>
    <loc>${SITE_URL}/ranking/page/${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === 1 ? '0.9' : '0.7'}</priority>
  </url>`).join('')}
  
  <!-- Other static pages -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/favorites</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})