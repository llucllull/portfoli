import fs from 'fs';

const domain = 'https://llucllull.dev';
const routes = fs.readFileSync('./routes.txt', 'utf-8').split('\n').filter(Boolean);

const languages = ['es', 'en', 'ca'];
const today = new Date().toISOString().split('T')[0];

function buildAlternateLinks(path) {
  const cleanPath = path.replace(/^\/(es|en|ca)/, '');

  return languages.map(lang => {
    return `<xhtml:link rel="alternate" hreflang="${lang}" href="${domain}/${lang}${cleanPath}" />`;
  }).join('\n    ');
}

function getPriority(route) {
  // home de cada idioma
  if (route === '/es' || route === '/en' || route === '/ca') {
    return '1.0';
  }

  return '0.7';
}

const urls = routes.map(route => {
  const fullUrl = `${domain}${route}`;
  const priority = getPriority(route);

  return `
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority}</priority>
    ${buildAlternateLinks(route)}
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${urls}
</urlset>`;

fs.writeFileSync('./src/sitemap.xml', sitemap);

console.log('✅ sitemap generado');