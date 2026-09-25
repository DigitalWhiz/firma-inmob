# FIRMA Calamuchita — Auditoría de Producción

Fecha: 2026-08-24

## Estado: PRODUCCIÓN ✅

---

## Stack
- Next.js 16.3.1 + React 19.2.8 + TypeScript + Tailwind CSS v4
- Vitest v4.1.11 · 163 tests · 12 archivos de test
- `tsc --noEmit`: limpio

## Fuentes de Datos
- **Única fuente**: Tokko API v1, branch `85101`
- **NO hay** WordPress, Supabase, ni base de datos propia
- ISR 30min (`revalidate = 1800`) en Home y listings
- In-memory cache en `TokkoPropertyProvider`
- Revalidación manual via `/api/revalidate` (POST, secret-protected)

## Seguridad
- `REVALIDATE_SECRET` en `.env.local`, protege endpoint de revalidación
- No hay API keys hardcodeadas en `src/`
- Sin `console.log` ni `console.warn` en código fuente
- Sin números de teléfono visibles (WhatsApp via wa.me)
- Sin emails personales (todos usan `info@firmacalamuchita.com`)

## SEO
- `robots.txt` — permite todo, bloquea `/admin/` y `/api/`
- `sitemap.ts` — dinámico, genera URLs de todas las propiedades + páginas estáticas
- Open Graph + Twitter cards configurados en `layout.tsx`
- JSON-LD: RealEstateListing + BreadcrumbList
- Títulos con template pattern

## Asesores
- 3 asesores con **jerarquía igualitaria**: Sabina Acosta, Ezequiel Fernandez, Aldo Fabricatore
- Dropdown en WhatsAppCTA (Home, listados, ficha)
- Sin asesor hardcodeado como "principal"
- Email institucional único: `info@firmacalamuchita.com`

## Sucursales
- Solo 2: FIRMA INMOB + FIRMA INMOB CALAMUCHITA
- Sin sucursal "Manantiales"
- Logo local: `public/assets/brand/logo/firma-logo.png`

## Propiedad Destacada (Home)
- Seleccionada por hash: `0641fec0171245d7bb3c067568be3d03`
- Muestra en Hero de Home y página dedicada

## Diseño Premium
- Tokens de diseño en `globals.css` (radius, shadows, motion, surfaces)
- Brand colors: Gold `#CEB88A`, Navy `#272F51`, Blue `#18286E`
- Header responsive con blur effect en scroll
- Footer con grid 3 columnas, grid 2 mobile
- Cards con border-radius 12px, hover states
- ScrollReveal con IntersectionObserver

## Archivos Clave
| Archivo | Propósito |
|---------|-----------|
| `src/app/admin/page.tsx` | Dashboard admin (server) |
| `src/app/admin/actions.ts` | Server action revalidación |
| `src/app/api/revalidate/route.ts` | POST endpoint revalidación |
| `src/lib/tokko/provider.ts` | Cache 30min + fetch |
| `src/data/advisors.ts` | 3 asesores, email institucional |
| `src/components/seo/JsonLd.tsx` | Property + Breadcrumb schemas |
| `src/app/sitemap.ts` | Sitemap dinámico |
| `public/robots.txt` | Crawl rules |
| `.env.local` | REVALIDATE_SECRET |

## Tests (163)
- `tokko/` — mapper, golden, batch (33)
- `seo/` — JSON-LD property + breadcrumbs (13)
- `property/` — media, related, video (36)
- `config/` — categories, advisors (16)
- `lib/` — whatsapp, filters (26)
- `api/` — revalidation route (5)

## Errores Lint
- Solo en `.agents/skills/` (HyperFrames residual, no es código de la app)

## Pendiente (No bloqueante)
- Deploy a Vercel
- DNS para `firmacalamuchita.com`
- Favicon y OG image
- Verificar en devices reales (responsive audit visual)
