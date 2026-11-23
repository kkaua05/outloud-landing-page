import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { siteConfig } from './src/config/site.ts'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Injects brand + SEO values from src/config/site.ts into index.html,
 * so the brand name only has to be changed in one place.
 */
function siteMetaPlugin(): Plugin {
  const siteUrl = siteConfig.seo.siteUrl.replace(/\/$/, '')
  const tokens: Record<string, string> = {
    BRAND_NAME: siteConfig.brand.name,
    SEO_TITLE: siteConfig.seo.title,
    SEO_DESCRIPTION: siteConfig.seo.description,
    OG_IMAGE: `${siteUrl}/og-image.jpg`,
    OG_URL: siteUrl ? `${siteUrl}/` : '/',
  }
  return {
    name: 'site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
          key in tokens ? escapeHtml(tokens[key]) : match,
        ),
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteMetaPlugin()],
})
