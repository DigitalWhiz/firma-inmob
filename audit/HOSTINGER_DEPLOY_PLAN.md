# HOSTINGER DEPLOY PLAN

**Proyecto**: FIRMA Calamuchita
**Fecha**: 2026-08-24
**Estado**: Listo para deploy (con 1 fix pendiente)

---

## 1. Node.js Recomendado

| Requisito | Valor |
|-----------|-------|
| Next.js 16.3.1 | **Requiere Node.js 20.9+** |
| Node.js 18 | **NO SOPORTADO por Next.js 16** |
| **Recomendado** | **Node.js 22 LTS** (v22.x) |
| Alternativa | Node.js 20 LTS (v20.9+) |

**Acción en Hostinger hPanel**: Seleccionar Node.js **22** (o 20 como mínimo) al crear la aplicación Node.js Web App.

---

## 2. Compatibilidad Confirmada

| Feature | Estado | Detalle |
|---------|--------|---------|
| Next.js 16.3.1 | ✅ | Build exitoso con Turbopack |
| React 19.2.8 | ✅ | Compatible |
| TypeScript 5.x | ✅ | `tsc --noEmit` limpio |
| Tailwind CSS v4 | ✅ | PostCSS plugin `@tailwindcss/postcss` |
| App Router | ✅ | Todos los routes usan `src/app/` |
| API Routes | ✅ | `/api/revalidate` funciona |
| Server Components | ✅ | Home, listings, admin son server |
| Server Actions | ✅ | `revalidateTokko` en admin |
| ISR | ✅ | `revalidate = 1800` (30min) en listings |
| Sitemap dinámico | ✅ | `/sitemap.xml` genera URLs desde Tokko |
| robots.txt | ✅ | `public/robots.txt` estático |
| Turbopack | ✅ | Default en Next.js 16, funciona |

---

## 3. Build Command

```bash
npm install && npm run build
```

Build output verificado:
- 16 páginas generadas (10 estáticas + 3 dinámicas + 3 sin path)
- Turbopack compiló en ~11s
- TypeScript verificado en ~12s
- Static pages generadas en ~6s

---

## 4. Start Command

```bash
npm start
```

Next.js internamente ejecuta `node .next/standalone/server.js` o similar. El `start` script de `package.json` es `"start": "next start"`.

**PORT**: Next.js default es `3000`. Hostinger puede asignar un PORT diferente via variable de entorno. La app ya respeta `process.env.PORT` por defecto de Next.js.

---

## 5. Application Root

```
/
```

El directorio raíz del proyecto (donde está `package.json`) debe ser el Application Root.

---

## 6. Port

| Configuración | Valor |
|---------------|-------|
| Next.js default | `3000` |
| Hostinger puede asignar | Variable `PORT` |
| Acción | No configurar manualmente unless Hostinger lo pida |

---

## 7. Variables de Entorno

Configurar en Hostinger hPanel → Environment Variables:

| Variable | Valor | Exposta al cliente |
|----------|-------|--------------------|
| `TOKKO_API_KEY` | `[REDACTED]` | ❌ NO |
| `TOKKO_BRANCH_ID` | `85101` | ❌ NO |
| `TOKKO_COMPANY_ID` | `47477` | ❌ NO |
| `REVALIDATE_SECRET` | *(generar uno nuevo para producción)* | ❌ NO |
| `NEXT_PUBLIC_SITE_URL` | `https://firmacalamuchita.com` | ✅ SÍ |
| `NODE_ENV` | `production` | Automático |

**⚠️ IMPORTANTE**: Generar un `REVALIDATE_SECRET` nuevo y seguro para producción. No usar el de desarrollo.

---

## 8. Archivos Necesarios (Subir a Hostinger)

```
package.json              ← Definición de proyecto + scripts
package-lock.json         ← Lockfile exacto
next.config.ts            ← Configuración Next.js
tsconfig.json             ← Configuración TypeScript
postcss.config.mjs        ← PostCSS/Tailwind
vitest.config.ts          ← Test config (no afecta runtime)
eslint.config.mjs         ← Lint config (no afecta runtime)
src/                      ← Código fuente completo
public/                   ← Assets estáticos (logo, robots.txt)
```

---

## 9. Archivos Excluidos (NO Subir)

| Archivo/Razón | Por qué |
|---------------|---------|
| `.env.local` | Secrets → configurar en Hostinger hPanel |
| `node_modules/` | `npm install` lo recrea en el servidor |
| `.next/` | `npm run build` lo genera |
| `.git/` | Control de versiones local |
| `.gitignore` | Solo relevante para Git |
| `audit/` | Documentación interna |
| `scripts/` | Scripts de desarrollo |
| `renders/` | Archivos de render local |
| `video-project/` | Proyecto de video auxiliar |
| `.agents/` | HyperFrames residual (dev tooling) |
| `.claude/` | Configuración de IDE |
| `AGENTS.md` | Instrucciones para AI agents |
| `AGENT.md` | Instrucciones para AI agents |
| `CLAUDE.md` | Configuración de IDE |
| `README.md` | Documentación (no afecta runtime) |
| `skills-lock.json` | Dev tooling |
| `next-env.d.ts` | Generado por `next build` |
| `tsconfig.tsbuildinfo` | Cache de TypeScript |
| `.gitignore.bak` | Backup innecesario |
| `public/renders/` | Videos locales de render |
| `public/vercel.svg` | Logo de Vercel (no necesario) |
| `public/file.svg` | SVG de ejemplo |
| `public/globe.svg` | SVG de ejemplo |
| `public/next.svg` | SVG de Next.js |
| `public/window.svg` | SVG de ejemplo |

---

## 10. Configuración de Dominio

### En Hostinger hPanel:

1. **Websites** → Seleccionar la aplicación Node.js
2. **Domain Settings** → Asociar `firmacalamuchita.com`
3. Configurar **both**:
   - `firmacalamuchita.com` (dominio principal)
   - `www.firmacalamuchita.com` (redirect a principal)

### En DNS (Hostinger):

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | `@` | IP del servidor Hostinger |
| CNAME | `www` | `firmacalamuchita.com` |

**NO modificar DNS hasta que la app esté funcionando en Hostinger.**

---

## 11. SSL / HTTPS

Hostinger Business Web Hosting incluye **SSL gratuito** (Let's Encrypt).

### Activación:
1. hPanel → **SSL** → Seleccionar dominio
2. Activar **SSL Let's Encrypt**
3. Forzar HTTPS (redirect HTTP → HTTPS)

### Verificar:
- `https://firmacalamuchita.com` → Funciona
- `https://www.firmacalamuchita.com` → Funciona
- HTTP redirige a HTTPS

---

## 12. Procedimiento de Deploy

### Deploy Inicial:

```
1. Preparar ZIP con archivos necesarios (ver §9)
2. Subir ZIP a Hostinger via hPanel File Manager
3. Extraer en el directorio de la aplicación
4. Configurar variables de entorno en hPanel
5. Configurar Node.js 22 en hPanel
6. Build command: npm install && npm run build
7. Start command: npm start
8. Asociar dominio
9. Activar SSL
10. Verificar funcionamiento
```

### Actualización Futura:

```
1. Subir ZIP con archivos actualizados (o usar Git)
2. Hostinger ejecuta: npm install && npm run build
3. Hostinger reinicia la app
4. La app sigue funcionando con cache ISR
```

**NO requiere**:
- Modificar propiedades manualmente
- Reconstruir la base de datos
- Cambiar configuración de Tokko

---

## 13. Procedimiento de Actualización

### Vía Git (recomendado):
```bash
# En local
git add .
git commit -m "Update: descripción"
git push origin main

# En Hostinger hPanel
# → Deployments → Pull latest
```

### Vía ZIP:
```bash
# En local
# Crear ZIP con archivos necesarios (sin .env.local, node_modules, .next)
# Subir vía hPanel File Manager
# Extraer sobre archivos existentes
# npm install && npm run build en terminal de Hostinger
```

### Post-actualización:
- ISR mantiene cache por 30 minutos
- Admin → "ACTUALIZAR PROPIEDADES" fuerza revalidación inmediata
- Las propiedades nuevas de Tokko aparecen automáticamente

---

## 14. Rollback

Si la actualización falla:

1. **Hostinger hPanel** → Deployments → Seleccionar versión anterior
2. O **restaurar ZIP** de la versión anterior
3. O **revertir Git** y redeployar

**Backup**: Mantener ZIP de la última versión funcionando localmente.

---

## 15. Checklist de Producción

### Pre-deploy:
- [ ] Build exitoso local (`npm run build`)
- [ ] Tests pasan (`npm test` → 163 tests)
- [ ] TypeScript limpio (`npx tsc --noEmit`)
- [ ] `.env.local` NO incluido en ZIP
- [ ] `REVALIDATE_SECRET` nuevo generado para producción

### Deploy:
- [ ] Node.js 22 seleccionado en Hostinger
- [ ] Variables de entorno configuradas en hPanel
- [ ] Build command configurado
- [ ] Start command configurado
- [ ] Application root correcto

### Post-deploy:
- [ ] `https://firmacalamuchita.com` carga correctamente
- [ ] `https://www.firmacalamuchita.com` redirige correctamente
- [ ] SSL activo (HTTPS)
- [ ] `/propiedades` muestra propiedades de Tokko
- [ ] `/propiedades/[slug]` muestra detalle correcto
- [ ] `/admin` carga (diagnóstico Tokko)
- [ ] `/api/revalidate` responde (POST con secret)
- [ ] `/sitemap.xml` genera URLs
- [ ] `/robots.txt` carga
- [ ] WhatsApp funciona (links a wa.me)
- [ ] Admin → "ACTUALIZAR PROPIEDADES" funciona
- [ ] No hay errores en consola del servidor
- [ ] No hay secrets expuestos en HTML/código fuente del navegador

---

## 16. Riesgos

### ⚠️ Riesgo 1: SECRET EXPUESTO EN ADMIN (CRITICO)

**Problema**: `src/app/admin/page.tsx:167` pasa `process.env.REVALIDATE_SECRET` como prop a un componente client (`AdminSyncButton`). Esto expone el secret en el HTML renderizado por el servidor.

**Impacto**: Cualquiera que inspeccione el HTML de `/admin` puede ver el `REVALIDATE_SECRET`.

**Fix requerido**: Modificar `AdminSyncButton` para que use un Server Action que lea el secret de `process.env` directamente, sin recibirlo como prop.

**Estado**: Pendiente de fix ANTES del deploy.

### ⚠️ Riesgo 2: Hostinger Business Web Hosting — Recursos Limitados

**Problema**: El plan Business Web Hosting tiene recursos compartidos (CPU, RAM).

**Impacto**: Tokko API hace fetch de propiedades cada 30min. El build de Next.js consume memoria.

**Mitigación**: ISR reduce carga. Solo `/admin` y `/api/revalidate` son dinámicos. Las páginas estáticas se sirven desde cache.

### ⚠️ Riesgo 3: Falta Favicon y OG Image

**Problema**: `public/assets/brand/favicon/` y `public/assets/brand/social/` están vacíos.

**Impacto**: El sitio se muestra sin favicon. Social sharing no tiene imagen personalizada.

**Fix**: Agregar `favicon.ico` y `og-image.png` antes del deploy.

### ⚠️ Riesgo 4: Assets de Asesores y Territorio Vacíos

**Problema**: `public/assets/advisors/*/` y `public/assets/territory/` están vacíos.

**Impacto**: Los componentes muestran placeholders. No es bloqueante.

### ⚠️ Riesgo 5: Turbopack en Producción

**Problema**: Next.js 16 usa Turbopack por defecto para `next build`.

**Impacto**: Funcionó correctamente en el build local. Pero Hostinger podría tener configuraciones que afecten Turbopack.

**Mitigación**: Si falla, usar `npx next build --webpack` como fallback.

---

## RESUMEN EJECUTIVO

| Aspecto | Estado |
|---------|--------|
| Compatibilidad Next.js 16 + Hostinger | ✅ Compatible (Node.js 22) |
| Build de producción | ✅ Exitoso |
| Tokko server-side | ✅ Verificado (no expone secrets) |
| Revalidation | ✅ Funcional (secret-protected) |
| Admin | ⚠️ Fix de secret exposure pendiente |
| WordPress dependency | ✅ Eliminada |
| SEO | ✅ Sitemap, robots, OG, Twitter cards |
| Tests | ✅ 163 passing |
| **Listo para deploy** | **⚠️ Con 1 fix pendiente** |

**Próximo paso**: Fix del secret exposure en admin → deploy.
