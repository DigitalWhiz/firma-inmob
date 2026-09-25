# FASE 8 — Media Pipeline Validation Report

## HyperFrames

**Version:** 0.8.4 (installed as devDependency)
**Status:** REAL — renders HTML compositions to MP4 via headless Chrome + FFmpeg

### How it works
- `npx hyperframes render` takes an HTML composition with `data-*` timing attributes
- Headless Chrome captures frames at 30fps
- FFmpeg encodes frames to H.264 MP4
- Output: standard MP4 video file

### System requirements
- FFmpeg 9.0 ✓ (installed via winget)
- Chrome headless ✓ (Puppeteer cached)
- Node.js 22 ✓
- Memory: low (0.8GB available) — use `--low-memory-mode`

### Commands used
```bash
npx hyperframes check          # Validate composition
npx hyperframes render         # Render to MP4
npx hyperframes doctor         # Check dependencies
```

### Configuration
- No `HYPERFRAMES_API_KEY` needed for local rendering
- `hyperframes.json` configures project metadata
- `index.html` is the composition file

## Modo: REAL

El pipeline funciona de verdad:
1. HTML composition → headless Chrome → frame capture → FFmpeg → MP4
2. Sin API externa requerida
3. Render local completo

## Propiedad utilizada

**Tokko ID:** 6984049
**Título:** CASA DE CATEGORIA EN VENTA- LOMA DEL TIGRE CALAMUCHITA
**Tipo:** House
**Ciudad:** Calamuchita, Córdoba
**Precio:** USD 330.000
**Estado:** Disponible (status 2)

## Imágenes utilizadas

21 fotos reales de Tokko,选取 7 para el video:
1. Cover (order 6) — Exterior frontal
2. Interior 1 (order 0)
3. Interior 2 (order 1)
4. Interior 3 (order 2)
5. Interior 4 (order 4)
6. Interior 5 (order 5)
7. Cierre FIRMA (generated)

URLs verificadas — HTTP 200, cargan correctamente.

## Storyboard

**Formato:** PROPERTY_REEL (9:16)
**Duración:** 24 segundos
**Escenas:** 7 (6 fotos + 1 cierre FIRMA)
**Transiciones:** Ken Burns zoom entre escenas

**PASS** ✓

## Video

**Archivo:** `renders/property-6984049.mp4` (also in `public/renders/`)
**Resolución:** 1080x1920 (9:16 vertical)
**Codec:** H.264
**FPS:** 30
**Duración:** 24.0s
**Tamaño:** 13.7 MB
**Bitrate:** 4773 kbps

**PASS** ✓

## Output

**Path local:** `C:\Users\agust\FirmaInmobiliariaCalamuchita\renders\property-6984049.mp4`
**Web path:** `/renders/property-6984049.mp4` (accessible from dev server)
**URL:** `http://localhost:3001/renders/property-6984049.mp4`

## Video visible en Property Detail

**PASS** ✓
- PropertyVideoCTA muestra "VIDEO FIRMA" con botón "VER VIDEO"
- Al hacer clic, reproduce el MP4 inline
- No reemplaza video Tokko (coexisten)

## Branding

- Logo FIRMA en gold (#CEB88A) sobre fondo navy (#272F51)
- Tipografía Georgia para títulos, Inter para cuerpo
- Barra de marca en cada escena
- Cierre con logo FIRMA + CALAMUCHITA
- Colores consistentes con la web

**PASS** ✓

## Share

- PropertyShare funciona con WhatsApp, Facebook, X, Copy link
- URL compartida: `/propiedades/[slug]`
- No usa ficha.info

**PASS** ✓

## Favorites

- FavoriteButton funciona con localStorage
- Persiste entre sesiones
- Toggle correctly adds/removes

**PASS** ✓

## Tests

**194/194 tests pass**
- Media adapters: ✓
- Storyboard generator: ✓
- HyperFrames adapter: ✓
- Video generator: ✓
- All previous tests: ✓

## Build

**PASS** ✓ — TypeScript compiles, Next.js builds successfully

## Lint

**PASS** ✓ — 0 errors, 1 warning (intentional `_id` convention)

## TypeScript

**PASS** ✓ — No type errors in src/

## DEV

**http://localhost:3001** — funcionando

## Seguridad

- No se exponen API keys en el cliente
- No se envían secretos al cliente
- No se incluyen secrets en HTML
- Tokko API key solo en server-side
- HyperFrames no necesita API key para render local

## Cache / Duplicados

**Limitación documentada:**
- No hay persistencia de videos generados entre sesiones
- Cada generación crea un nuevo archivo
- No hay base de datos para rastrear videos existentes
- Futuro: implementar con DB o filesystem cache

## Problemas encontrados y resueltos

1. **FFmpeg no instalado** → Instalado via winget
2. **Google Fonts bloqueado por ORB** → Eliminado import, usando fonts del sistema
3. **child_process en client-side** → Separado adapter (server) de componentes (client)
4. **Tests timeout** → Instalado hyperframes como devDependency para避免 npx download
5. **Tipos de StoryboardScene sin `start`** → Agregado campo start

## Siguiente fase

FASE 9: Performance optimization (images, fonts, code splitting)
FASE 10: SEO refinement (sitemap, robots.txt, structured data)
FASE 11: Deployment (Vercel/Netlify config)
