# FIRMA Calamuchita — Pre-Deploy Final Report

**Fecha:** 2026-09-21
**Estado:** READY FOR DEPLOY

---

## 1. Tests

| Suite | Archivos | Tests | Pass | Fail |
|-------|----------|-------|------|------|
| Editorial Store | 2 | 27 | 27 | 0 |
| Editorial Merge | 2 | 22 | 22 | 0 |
| Auth | 2 | 28 | 28 | 0 |
| Security | 3 | 18 | 18 | 0 |
| Tokko | 3 | 56 | 56 | 0 |
| Property | 3 | 26 | 26 | 0 |
| Lib | 2 | 23 | 23 | 0 |
| Config | 2 | 25 | 25 | 0 |
| API | 1 | 4 | 4 | 0 |
| SEO | 1 | 8 | 8 | 0 |
| Media | 1 | 6 | 6 | 0 |
| Client Bundle | 1 | 5 | 5 | 0 |
| **Total** | **22** | **276** | **276** | **0** |

**Causa raíz del flaky (corregida):** Vitest ejecutaba test files en paralelo (`fileParallelism` default `true`). Ambos `store.test.ts` y `editorial-full.test.ts` escribían al mismo `data/editorial-overrides.json`. Corregido con `fileParallelism: false` en `vitest.config.ts`.

---

## 2. Build

| Comando | Estado |
|---------|--------|
| `npx tsc --noEmit` | ✅ 0 errores |
| `npx eslint src/` | ✅ 0 errores, 7 warnings intencionales |
| `npx vitest run` | ✅ 276/276 |
| `npx next build` | ✅ 20 rutas generadas |

---

## 3. JWT / Cookie

| Check | Estado |
|-------|--------|
| HMAC-SHA256 (Web Crypto API) | ✅ |
| `ADMIN_JWT_SECRET` independiente de `ADMIN_PASSWORD` | ✅ |
| Firma validada (verify) | ✅ |
| `exp` claim validado | ✅ |
| `iat` claim presente | ✅ |
| Algoritmo `HS256` validado en header | ✅ |
| `sub` y `jti` requeridos | ✅ |
| Cookie HttpOnly | ✅ |
| Cookie Secure en producción | ✅ |
| Cookie SameSite=Lax | ✅ |
| Cookie path=/ | ✅ |
| Expiración 8 horas | ✅ |
| JWT nunca en localStorage/sessionStorage | ✅ |
| JWT nunca en query string | ✅ |
| JWT nunca en logs | ✅ |
| JWT nunca en mensajes de error | ✅ |
| Sin secretos hardcodeados | ✅ |

---

## 4. Endpoints Admin

| Endpoint | Auth | Validación | Seguridad | Estado |
|----------|------|-----------|-----------|--------|
| `POST /api/admin/login` | Rate limit + credenciales | email/password required | Generic errors | ✅ |
| `POST /api/admin/logout` | Middleware JWT | N/A | Cookie cleared | ✅ |
| `GET /api/admin/editorial` | `isAuthenticated()` | N/A | Generic errors | ✅ |
| `POST /api/admin/editorial` | `isAuthenticated()` | propertyId type, sortOrder bounds, editorialStatus enum, booleans, internalNote length | No mass assignment | ✅ |
| `DELETE /api/admin/editorial` | `isAuthenticated()` | propertyId parsed + validated > 0 | Generic errors | ✅ |
| `POST /api/revalidate` | `x-revalidate-secret` (constant-time) | Secret required | Generic errors | ✅ |

---

## 5. Variables de Entorno

| Variable | Tipo | .env.example | NEXT_PUBLIC | Estado |
|----------|------|-------------|-------------|--------|
| `TOKKO_API_KEY` | Server | Vacío | No | ✅ |
| `TOKKO_BRANCH_ID` | Server | 85101 | No | ✅ |
| `TOKKO_COMPANY_ID` | Server | 47477 | No | ✅ |
| `REVALIDATE_SECRET` | Server | Vacío | No | ✅ |
| `ADMIN_USERNAME` | Server | Vacío | No | ✅ |
| `ADMIN_PASSWORD` | Server | Vacío | No | ✅ |
| `ADMIN_JWT_SECRET` | Server | Vacío | No | ✅ |
| `NEXT_PUBLIC_SITE_URL` | Public | URL | Sí | ✅ |

---

## 6. Secretos

| Verificación | Estado |
|-------------|--------|
| Sin API keys hardcodeadas en src/ | ✅ |
| Sin passwords hardcodeadas en src/ | ✅ |
| Sin JWT secrets hardcodeados en src/ | ✅ |
| Sin process.env en Client Components | ✅ |
| Sin console.log con secretos | ✅ |
| .env*.local en .gitignore | ✅ |
| .env.example sin valores reales | ✅ |
| Errores no exponen stack traces | ✅ |
| error.message sanitizado en admin | ✅ (corregido en FASE E) |

---

## 7. Security Headers

| Header | Valor | Estado |
|--------|-------|--------|
| X-Content-Type-Options | nosniff | ✅ |
| X-Frame-Options | DENY | ✅ |
| X-XSS-Protection | 1; mode=block | ✅ |
| Referrer-Policy | strict-origin-when-cross-origin | ✅ |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | ✅ |
| Strict-Transport-Security | max-age=63072000; includeSubDomains; preload | ✅ |
| Cache-Control (api/admin) | no-store, no-cache, must-revalidate | ✅ |

Imágenes Tokko/CDN: sin bloqueo por headers. ✅

---

## 8. Orden Editorial

| Feature | Estado |
|---------|--------|
| Campo sortOrder numérico por propiedad | ✅ |
| Botones subir/bajar | ✅ |
| Input numérico editable | ✅ |
| Orden por Tokko más reciente | ✅ (requiere confirmación) |
| Orden por Tokko más antiguo | ✅ (requiere confirmación) |
| Orden alfabético A→Z | ✅ (requiere confirmación) |
| Orden alfabético Z→A | ✅ (requiere confirmación) |
| Desempate determinista (sortOrder → updatedAt → id) | ✅ |
| Propiedades sin override: sortOrder = 0 | ✅ |
| Persistencia via `/api/admin/editorial` | ✅ |
| Confirmación antes de persistir orden automático | ✅ |

---

## 9. Archivos Modificados (FASE E)

| Archivo | Cambio |
|---------|--------|
| `vitest.config.ts` | `fileParallelism: false` |
| `src/__tests__/editorial/store.test.ts` | `beforeEach`/`afterEach` |
| `src/__tests__/editorial/editorial-full.test.ts` | `beforeEach`/`afterEach` |
| `src/lib/auth.ts` | Import `timingSafeEqual` en top-level |
| `src/app/admin/page.tsx` | Error message sanitizado |
| `src/app/admin/actions.ts` | Error message sanitizado |
| `src/app/admin/AdminPropertyList.tsx` | Fix unused variable |
| `next.config.ts` | HSTS header |

---

## 10. Estado Final

| Criterio | Estado |
|----------|--------|
| 0 errores TypeScript | ✅ |
| Lint OK (0 errors) | ✅ |
| Build OK | ✅ |
| 276/276 tests OK | ✅ |
| Editorial Store 27/27 | ✅ |
| Ningún secreto expuesto | ✅ |
| Todas las APIs admin protegidas | ✅ |
| JWT validado correctamente | ✅ |
| Cookie segura | ✅ |
| Variables server-only | ✅ |
| Orden editorial validado | ✅ |
| Reporte final generado | ✅ |

## **ESTADO: READY FOR DEPLOY**
