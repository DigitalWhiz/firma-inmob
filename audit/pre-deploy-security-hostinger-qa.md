# Pre-Deploy Security & Hostinger QA

**Fecha**: 2026-08-24
**Estado**: LISTO PARA DEPLOY

---

## 1. Problema Encontrado

`src/app/admin/page.tsx:167` pasaba `process.env.REVALIDATE_SECRET` como prop a un Client Component (`AdminSyncButton`). Esto exponía el secret en:
- HTML renderizado por el servidor
- JavaScript del navegador
- Herramientas de inspección del browser

**Flujo original (INSEGURO):**
```
process.env.REVALIDATE_SECRET
  → prop secret={...}
    → AdminSyncButton (client)
      → revalidateTokko(secret)
        → Server Action compara con process.env
```

---

## 2. Fix Aplicado

### Archivos modificados:

**`src/app/admin/actions.ts`** — Server Action sin parámetro secret:
- `revalidateTokko()` ya no recibe `secret` como argumento
- Lee `process.env.REVALIDATE_SECRET` directamente en servidor
- Retorna `{ success, error?, timestamp? }` — nunca el secret

**`src/app/admin/AdminSyncButton.tsx`** — Client Component limpio:
- Eliminada interfaz `AdminSyncButtonProps`
- Eliminada prop `secret`
- Llama `revalidateTokko()` sin argumentos
- Solo recibe resultado seguro: `{ success: boolean, error?: string }`

**`src/app/admin/page.tsx`** — Server Component limpio:
- `<AdminSyncButton />` sin props
- `process.env.REVALIDATE_SECRET` nunca se pasa al cliente

---

## 3. Arquitectura Final de Revalidation

### Ruta 1: Admin Dashboard (Server Action)
```
Admin page (server)
  → AdminSyncButton (client)
    → revalidateTokko() [Server Action]
      → process.env.REVALIDATE_SECRET (server only)
      → revalidatePath("/", "layout")
      → return { success: true }
```

### Ruta 2: API Externa (POST)
```
POST /api/revalidate
  Header: x-revalidate-secret: <value>
  → process.env.REVALIDATE_SECRET (server only)
  → revalidatePath("/", "layout")
  → return { revalidated: true, timestamp, paths }
```

**Ambas rutas leen el secret exclusivamente en servidor.**

---

## 4. Confirmación: REVALIDATE_SECRET Nunca Llega al Cliente

| Verificación | Resultado |
|--------------|-----------|
| `REVALIDATE_SECRET` en `"use client"` files | ❌ Ninguno |
| `REVALIDATE_SECRET` en props | ❌ Ninguno |
| `REVALIDATE_SECRET` en HTML | ❌ Ninguno |
| `REVALIDATE_SECRET` en JavaScript del browser | ❌ Ninguno |
| `REVALIDATE_SECRET` en `data-*` attributes | ❌ Ninguno |
| `REVALIDATE_SECRET` en URLs | ❌ Ninguno |
| `REVALIDATE_SECRET` en logs | ❌ Ninguno |
| `REVALIDATE_SECRET` en respuestas API | ❌ Nunca lo devuelve |

**PASS** — Secret completamente server-side.

---

## 5. Auditoría de TOKKO_API_KEY

| Verificación | Resultado |
|--------------|-----------|
| `TOKKO_API_KEY` en `"use client"` files | ❌ Ninguno |
| `TOKKO_API_KEY` en Client Components | ❌ Ninguno |
| `TOKKO_API_KEY` en HTML/JS del browser | ❌ Ninguno |
| `TOKKO_API_KEY` en `src/lib/tokko/provider.ts` | ✅ Server-only |
| `TOKKO_API_KEY` en `src/lib/tokko/client.ts` | ✅ Server-only |
| `NEXT_PUBLIC_*` variables definidas | 0 (ninguna definida) |

**PASS** — API key completamente server-side.

---

## 6. Resultado de Tests

```
Test Files  12 passed (12)
Tests       163 passed (163)
Duration    7.13s
```

**PASS** — 163/163 tests passing.

---

## 7. Resultado TypeScript

```
npx tsc --noEmit → (clean, no output)
```

**PASS** — Zero errors.

---

## 8. Resultado Lint

```
83 errors, 388 warnings — TODOS en .agents/skills/ (HyperFrames residual)
0 issues en src/
```

**PASS** — Lint limpio en código de la app. Errores exclusivamente en tooling residual.

---

## 9. Resultado Build

```
Next.js 16.3.1 (Turbopack)
✓ Compiled successfully
✓ TypeScript clean
✓ 16 pages generated

Route (app)                     Revalidate  Expire
┌ ○ /                                  30m      1y
├ ○ /_not-found
├ ƒ /admin
├ ƒ /api/revalidate
├ ○ /calamuchita
├ ○ /contacto
├ ○ /propiedades                       30m      1y
├ ƒ /propiedades/[slug]
├ ○ /propiedades/campos                30m      1y
├ ○ /propiedades/casas                 30m      1y
├ ○ /propiedades/complejos             30m      1y
├ ○ /propiedades/departamentos         30m      1y
├ ○ /propiedades/terrenos              30m      1y
├ ○ /sitemap.xml
├ ○ /sucursales
└ ○ /vender
```

**PASS** — Build exitoso. 13 estáticas + 3 dinámicas.

---

## 10. Validación de /admin

| Aspecto | Estado |
|---------|--------|
| Carga correctamente | ✅ Server Component con `force-dynamic` |
| Muestra estado Tokko | ✅ Conectado/Desconectado + error |
| Muestra cantidad de propiedades | ✅ Total + por categoría |
| Muestra branch ID | ✅ 85101 |
| Muestra última sincronización | ✅ Timestamp formateado |
| Botón ACTUALIZAR PROPIEDADES | ✅ Server Action, sin secret en cliente |
| Feedback éxito/error | ✅ Mensajes visuales |
| Secret expuesto | ❌ NO |

**PASS** — Admin funcional y seguro.

---

## 11. Validación de /api/revalidate

| Escenario | Estado |
|-----------|--------|
| POST sin header → 401 | ✅ "Invalid secret" |
| POST con secret incorrecto → 401 | ✅ "Invalid secret" |
| POST con secret correcto → 200 | ✅ `{ revalidated: true, timestamp, paths }` |
| Sin REVALIDATE_SECRET configurado → 500 | ✅ "REVALIDATE_SECRET not configured" |
| Secret devuelto en respuesta | ❌ Nunca |

**PASS** — API protegida y funcional.

---

## 12. Compatibilidad Real con Hostinger

### Hostinger Business Web Hosting — Node.js Web App

| Aspecto | Compatibilidad |
|---------|----------------|
| Node.js 20.9+ requerido por Next.js 16 | ✅ Hostinger soporta Node.js 18-24 |
| Node.js 22 LTS disponible | ✅ Seleccionar en hPanel |
| `npm install` | ✅ Soportado |
| `npm run build` | ✅ Soportado (build command) |
| `npm start` | ✅ Soportado (start command) |
| `next start` | ✅ Funciona sin `output: "standalone"` |
| Server Actions | ✅ Soportados (server-side only) |
| API Routes | ✅ Soportadas |
| ISR / revalidate | ✅ Funciona con `next start` |
| Puerto | ✅ Hostinger asigna automáticamente via `PORT` |
| SSL | ✅ Let's Encrypt incluido |
| Environment Variables | ✅ Configurables en hPanel |
| Git integration | ✅ GitHub auto-deploy |
| ZIP upload | ✅ Upload manual |

### Decisión: `output: "standalone"` NO es necesario

Hostinger's Node.js Web App hosting:
- Detecta framework automáticamente
- Ejecuta `npm run build`
- Ejecuta `npm start`
- Gestiona proceso internamente
- **No requiere standalone output**

### Configuración recomendada en Hostinger hPanel:

| Campo | Valor |
|-------|-------|
| Framework | Next.js (auto-detectado) |
| Node.js version | **22** |
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Package manager | npm |
| Application root | `/` (raíz del proyecto) |

---

## 13. Build Command Recomendado

```bash
npm install && npm run build
```

---

## 14. Start Command Recomendado

```bash
npm start
```

Equivalente a `next start`. Next.js maneja internamente el puerto y el servidor.

---

## 15. Node.js Recomendado

**Node.js 22 LTS** (v22.x)

Next.js 16.3.1 requiere mínimo Node.js 20.9. Node.js 18 NO está soportado.

---

## 16. Variables de Entorno Necesarias

Configurar en Hostinger hPanel → Environment Variables:

| Variable | Valor (producción) | Exposta al cliente |
|----------|-------------------|--------------------|
| `TOKKO_API_KEY` | *(la misma del .env.local)* | ❌ NO |
| `TOKKO_BRANCH_ID` | `85101` | ❌ NO |
| `TOKKO_COMPANY_ID` | `47477` | ❌ NO |
| `REVALIDATE_SECRET` | *(generar uno nuevo y seguro)* | ❌ NO |
| `NEXT_PUBLIC_SITE_URL` | `https://firmacalamuchita.com` | ✅ SÍ |
| `NODE_ENV` | `production` | Automático |

**IMPORTANTE**: Generar `REVALIDATE_SECRET` nuevo para producción. No usar el de desarrollo (`[REDACTED]`).

---

## 17. Archivos que Deben Subirse

```
package.json              ← Definición de proyecto
package-lock.json         ← Lockfile exacto
next.config.ts            ← Configuración Next.js
tsconfig.json             ← Configuración TypeScript
postcss.config.mjs        ← PostCSS/Tailwind
vitest.config.ts          ← Test config (no afecta runtime)
eslint.config.mjs         ← Lint config (no afecta runtime)
src/                      ← Código fuente completo
public/                   ← Assets estáticos
```

---

## 18. Archivos que NO Deben Subirse

| Archivo | Razón |
|---------|-------|
| `.env.local` | Secrets → configurar en Hostinger hPanel |
| `node_modules/` | `npm install` lo recrea |
| `.next/` | `npm run build` lo genera |
| `.git/` | Control de versiones local |
| `.gitignore` | Solo relevante para Git |
| `.gitignore.bak` | Backup innecesario |
| `audit/` | Documentación interna |
| `scripts/` | Scripts de desarrollo |
| `renders/` | Videos de render local |
| `video-project/` | Proyecto auxiliar |
| `.agents/` | HyperFrames residual |
| `.claude/` | Configuración de IDE |
| `AGENTS.md` | Instrucciones AI agents |
| `AGENT.md` | Instrucciones AI agents |
| `CLAUDE.md` | Configuración IDE |
| `README.md` | Documentación |
| `skills-lock.json` | Dev tooling |
| `next-env.d.ts` | Generado por build |
| `tsconfig.tsbuildinfo` | Cache TypeScript |
| `public/renders/` | Videos locales |
| `public/vercel.svg` | Logo Vercel |
| `public/file.svg` | SVG ejemplo |
| `public/globe.svg` | SVG ejemplo |
| `public/next.svg` | SVG Next.js |
| `public/window.svg` | SVG ejemplo |

---

## 19. Riesgos Restantes

### Riesgo 1: Favicon y OG Image faltantes
`public/assets/brand/favicon/` y `public/assets/brand/social/` están vacíos.
**Impacto**: Sin favicon personalizado. Social sharing sin imagen.
**Fix**: Agregar `favicon.ico` y `og-image.png`.

### Riesgo 2: Assets de asesores y territorio vacíos
`public/assets/advisors/*/` y `public/assets/territory/` vacíos.
**Impacto**: Placeholders visuales. No es bloqueante.

### Riesgo 3: Hostinger resource limits
Plan Business Web Hosting tiene recursos compartidos.
**Mitigación**: ISR reduce carga. Solo `/admin` y `/api/revalidate` son dinámicos.

### Riesgo 4: REVALIDATE_SECRET de desarrollo
El secret actual (`[REDACTED]`) es predecible.
**Fix**: Generar secret aleatorio para producción.

---

## 20. Checklist Exacto para Deploy

### Pre-deploy:
- [ ] Build exitoso local (`npm run build`) ✅
- [ ] Tests pasan (`npm test` → 163 tests) ✅
- [ ] TypeScript limpio (`npx tsc --noEmit`) ✅
- [ ] Secret exposure eliminado ✅
- [ ] `.env.local` NO incluido en ZIP ✅

### En Hostinger hPanel:
- [ ] Crear Node.js Web App
- [ ] Seleccionar Node.js **22**
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Variables de entorno configuradas:
  - [ ] `TOKKO_API_KEY`
  - [ ] `TOKKO_BRANCH_ID=85101`
  - [ ] `TOKKO_COMPANY_ID=47477`
  - [ ] `REVALIDATE_SECRET` *(nuevo, seguro)*
  - [ ] `NEXT_PUBLIC_SITE_URL=https://firmacalamuchita.com`

### Subir archivos:
- [ ] ZIP con archivos necesarios (ver §17)
- [ ] Extraer en directorio de la aplicación

### Post-deploy:
- [ ] `https://firmacalamuchita.com` carga
- [ ] `https://www.firmacalamuchita.com` redirige
- [ ] SSL activo (HTTPS)
- [ ] `/propiedades` muestra propiedades de Tokko
- [ ] `/propiedades/[slug]` muestra detalle
- [ ] `/admin` carga y muestra diagnóstico
- [ ] Botón ACTUALIZAR funciona
- [ ] `/sitemap.xml` genera URLs
- [ ] `/robots.txt` carga
- [ ] WhatsApp links funcionan
- [ ] No hay errores en consola del servidor

### Dominio:
- [ ] Dominio `firmacalamuchita.com` asociado
- [ ] `www.firmacalamuchita.com` configurado
- [ ] DNS: A record → IP Hostinger
- [ ] DNS: CNAME www → firmacalamuchita.com
- [ ] SSL Let's Encrypt activo
- [ ] HTTP redirige a HTTPS

---

## Resultados Finales

```
SECURITY FIX:        PASS  (secret eliminado de client components)
SECRET EXPOSURE:     PASS  (0 secrets en cliente)
ADMIN:               PASS  (funcional, sin exposición)
REVALIDATION:        PASS  (server action + API route, ambas server-only)
TOKKO:               PASS  (server-only, 0 referencias en client)
TYPESCRIPT:          PASS  (0 errors)
TESTS:               PASS  (163/163)
LINT:                PASS  (0 issues en src/)
BUILD:               PASS  (16 pages, Turbopack clean)
HOSTINGER COMPAT:    PASS  (Node.js 22, npm start, sin standalone)
```

---

**PROYECTO LISTO PARA PROCEDER AL DEPLOY EN HOSTINGER**
