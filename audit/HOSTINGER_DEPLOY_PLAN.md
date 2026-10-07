# HOSTINGER DEPLOY PLAN

**Proyecto**: FIRMA Calamuchita
**Fecha**: 2026-10-07 (actualizado)
**Estado**: Listo para deploy vía Git
**Referencia oficial**: https://docs.hostinger.com/node.js/creating-an-app · https://docs.hostinger.com/node.js/overview-1/next

---

## 1. Runtime

| Requisito | Valor |
|-----------|-------|
| Next.js | **16.4.0** (actualizado por RCEs GHSA en ≤16.3.5) |
| Node.js en Hostinger | **22 LTS** (soportados: 18, 20, 22, 24) |
| React | 19.2.8 ✅ |
| Package manager | npm (lockfile detectado automáticamente) |

---

## 2. Compatibilidad confirmada

| Feature | Estado | Detalle |
|---------|--------|---------|
| Next.js 16.4.0 | ✅ | `npm run build` exitoso (Turbopack) |
| `next.config.ts` | ✅ | Filename soportado; Hostinger lo importa y agrega `output: "standalone"` automáticamente (no setearlo nosotros) |
| Output dir | ✅ | `.next` (default, no cambiar) |
| App Router / Server Actions / ISR | ✅ | `revalidate = 1800` en listings |
| robots.txt / sitemap | ✅ | Generados por `src/app/robots.ts` y `src/app/sitemap.ts` (no hay `public/robots.txt`) |
| Middleware (protege /admin) | ✅ | `src/middleware.ts` funciona en standalone |
| Tests | ✅ | 313 passing (24 archivos) |
| npm audit (prod) | ✅ | 0 vulnerabilidades (`npm audit --omit=dev`) |

**Nota**: Hostinger construye siempre Next.js con `output: "standalone"` y arranca el server empaquetado (`.next/standalone/server.js`). Nuestro script `npm start` NO se usa en el servidor; solo importa que `build` exista en `package.json`.

---

## 3. Variables de entorno (hPanel → Deployment settings → Environment variables)

| Variable | Valor | Cliente |
|----------|-------|---------|
| `TOKKO_API_KEY` | **REGENERAR en Tokko Broker** (la anterior estuvo expuesta en git público) | ❌ |
| `TOKKO_BRANCH_ID` | `85101` | ❌ |
| `TOKKO_COMPANY_ID` | `47477` | ❌ |
| `REVALIDATE_SECRET` | Generar: `openssl rand -base64 32` | ❌ |
| `ADMIN_USERNAME` | Elegir (usuario del panel) | ❌ |
| `ADMIN_PASSWORD` | Generar contraseña fuerte | ❌ |
| `ADMIN_JWT_SECRET` | Generar: `openssl rand -base64 32` | ❌ |
| `NEXT_PUBLIC_SITE_URL` | `https://firmacalamuchita.com` | ✅ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XCP7Y9HD2M` | ✅ |

Nunca subir `.env.local` al repo ni al hosting.

---

## 4. Deploy inicial (Git — recomendado)

### 4.0 Pre-requisitos de seguridad (HACER ANTES)

1. **Rotar `TOKKO_API_KEY`** en Tokko Broker — la clave anterior (`f43a…`) está en el historial de commits de un repo que fue público. Regenerar y usar la nueva solo en hPanel.
2. **Hacer privado el repo** GitHub `DigitalWhiz/firma-inmob` (Settings → Change visibility → Private) — contiene `audit/` con datos de contacto internos. Hostinger soporta repos privados vía su GitHub App.
3. **Regenerar** `REVALIDATE_SECRET` y `ADMIN_JWT_SECRET` para producción.
4. Verificar que ningún archivo trackeado contenga secrets (`npm test` incluye el escaneo de fugas).

### 4.1 Liberar el dominio (si sigue el WordPress actual)

El dominio ya está asignado al sitio WordPress de la cuenta. Un sitio Node.js necesita el dominio libre:

1. hPanel → **Websites** → sitio WordPress → descargar **Backup** (o File Manager → ZIP de `public_html`).
2. Eliminar ese sitio desde el panel (**seleccionalo → Delete/Remove website**). El hosting y los correos del dominio no se eliminan; solo el sitio web.
3. Verificar que el dominio quedó sin sitio asignado.

### 4.2 Crear la app Node.js desde GitHub

1. hPanel → **Websites → Add Website → Node.js web app**.
2. Elegir **Import Git repository** → **Connect with GitHub** → instalar la **Hostinger GitHub App** (elegir solo el repo `firma-inmob`).
3. Seleccionar el repo → Hostinger detecta **Next.js** y pre-llena: branch `main`, Node **22**, build `npm run build`, output `.next`.
4. Revisar settings → **Deploy** (primer build).
5. En **Deployment settings → Environment variables**, cargar las variables de la §3 → **Save and redeploy**.
6. **Domain**: asignar `firmacalamuchita.com` (+ redirigir `www` → principal).
7. **SSL**: hPanel → SSL → Let's Encrypt para el dominio + forzar HTTPS.

**Auto-deploy**: cada `git push` a `main` dispara webhook → `npm install` → build → restart (Deployments → logs en vivo).

### 4.3 Actualizaciones futuras

```bash
git add <archivos> && git commit -m "mensaje" && git push origin main
# Hostinger hace pull + build + restart solo
```

Fallback (sin Git): subir archive vía hPanel en el mismo flujo de Add Website (mismos settings).

---

## 5. Checklist pre-deploy

### Código
- [x] `npx eslint "src/**/*.{ts,tsx}"` → 0 errores
- [x] `npm test` → 313/313
- [x] `npm run build` → OK
- [x] `npm audit --omit=dev` → 0 vulnerabilidades (next@16.4.0, sharp, source-map-js actualizados)
- [x] Secretos redactados del repo (test de fugas incluido)
- [x] `/admin` noindex (layout + robots disallow)
- [x] Open redirect en login validado
- [x] `x-powered-by` deshabilitado, `X-XSS-Protection: 0`

### Seguridad (usuario)
- [ ] Rotar `TOKKO_API_KEY` en Tokko Broker
- [ ] Repo GitHub → Private
- [ ] Borrar historial con secrets o `git filter-repo` (opcional si la key se rotó y repo es privado)
- [ ] `REVALIDATE_SECRET` y `ADMIN_JWT_SECRET` nuevos en hPanel

### Deploy
- [ ] Node 22 seleccionado
- [ ] Variables de entorno cargadas (§3)
- [ ] Dominio + www + SSL activos
- [ ] `https://firmacalamuchita.com` carga
- [ ] `/propiedades` lista propiedades de Tokko
- [ ] `/admin/login` accesible, `/admin` requiere login
- [ ] `/robots.txt` y `/sitemap.xml` OK
- [ ] WhatsApp / CTA de contacto funcionan

---

## 6. Riesgos conocidos

| # | Riesgo | Estado |
|---|--------|--------|
| 1 | Secret de revalidate pasado como prop a client component en `/admin` | ✅ RESUELTO (ya no se pasa; verificado) |
| 2 | Recursos compartidos (Business plan) | ⚠️ ISR mitiga; solo /admin y /api son dinámicos |
| 3 | Favicon y OG image vacíos | ⚠️ Cosmético — agregar antes de compartir en redes |
| 4 | Assets de asesores/territorio vacíos | ⚠️ Placeholders, no bloqueante |
| 5 | Turbopack en build remoto | ⚠️ Si falla: fallback `npx next build --webpack` |

---

## RESUMEN

| Aspecto | Estado |
|---------|--------|
| Build / tests / lint / audit prod | ✅ Todo verde |
| Secretos en repo | ✅ Redactados (rotación pendiente de usuario) |
| Next.js | ✅ 16.4.0 (RCEs corregidas) |
| Flujo de deploy | ✅ Git → hPanel (auto-deploy por push) |
| Pendiente del usuario | Rotar key Tokko, repo privado, cargar env vars |
