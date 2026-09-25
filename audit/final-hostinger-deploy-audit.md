# FIRMA CALAMUCHITA — Final Hostinger Deploy Audit

**Date:** 2026-08-28
**Framework:** Next.js 16.3.1 | React 19.2.8 | TypeScript | Tailwind CSS v4
**Target:** Hostinger Business Web Hosting / Node.js 22 LTS

---

## 1. Executive Summary

FIRMA Calamuchita is a real estate website integrating with Tokko API (Branch 85101). The project has undergone a comprehensive security audit, code cleanup, and production hardening. All 263 tests pass, TypeScript is clean, ESLint produces zero errors/warnings, and the production build succeeds.

**Status: READY FOR HOSTINGER DEPLOY**

---

## 2. Architecture

```
TOKKO API
  → TokkoClient (HTTP, API key server-only)
    → TokkoMapper (data normalization)
      → TokkoProvider (cached fetch, ISR 30min)
        → Editorial Merge (visibility, featured, status overrides)
          → FirmaPropertyProvider (public/admin API)
            → Public Pages (SSG/ISR)
            → Admin Dashboard (SSR, auth-gated)
```

**Key decisions:**
- Editorial overrides stored in `data/editorial-overrides.json` (file-based, survives Tokko updates)
- Sessions stored in-memory (acceptable for single-admin, resets on restart)
- Rate limiting in-memory (resets on restart)
- No database required
- No `output: "standalone"` (standard Node.js deployment)

---

## 3. Security

| Check | Status |
|-------|--------|
| No secrets in client bundle | PASS |
| No NEXT_PUBLIC_ secrets | PASS |
| No console.log in production | PASS |
| No hardcoded API keys | PASS |
| .env.local gitignored | PASS |
| Timing-safe secret comparison | PASS (revalidation + credentials) |
| Cryptographic session tokens | PASS (randomBytes(32), SHA-256) |
| httpOnly + secure + sameSite cookies | PASS |
| Rate limiting on login | PASS (5 attempts / 15 min) |
| Generic error messages | PASS |

---

## 4. Authentication

| Check | Status |
|-------|--------|
| Admin user: info@firmacalamuchita.com | PASS |
| Password from ADMIN_PASSWORD env var | PASS |
| Password never sent to client | PASS |
| Password never in logs/errors | PASS |
| Constant-time comparison (timingSafeEqual) | PASS |
| Session token: randomBytes(32).hex | PASS |
| Token hashed with SHA-256 | PASS |
| Cookie: httpOnly=true | PASS |
| Cookie: secure=true in production | PASS |
| Cookie: sameSite=lax | PASS |
| Cookie: maxAge=8 hours | PASS |
| Logout invalidates session | PASS |
| Middleware protects /admin/* | PASS |
| Middleware protects /api/admin/* | PASS |

---

## 5. Session Security

| Check | Status |
|-------|--------|
| Token is 256-bit cryptographic random | PASS |
| Token is not predictable | PASS |
| Token not in HTML | PASS |
| Token not in logs | PASS |
| Token not in URLs | PASS |
| Token only in httpOnly cookie | PASS |
| Token has expiration (8h) | PASS |
| Token invalidated on logout | PASS |
| No localStorage for credentials | PASS |

---

## 6. Rate Limiting

| Check | Status |
|-------|--------|
| Max 5 attempts per IP | PASS |
| Window: 15 minutes | PASS |
| Response 429 on exceeded | PASS |
| Generic message (no user enumeration) | PASS |

---

## 7. Secret Audit

| Secret | Server-Only | Client Exposure | Hardcoded |
|--------|-------------|-----------------|-----------|
| TOKKO_API_KEY | PASS | NONE | NONE |
| ADMIN_PASSWORD | PASS | NONE | NONE |
| REVALIDATE_SECRET | PASS | NONE | NONE |
| ADMIN_USERNAME | PASS | NONE | NONE |
| TOKKO_BRANCH_ID | PASS | NONE | NONE |
| TOKKO_COMPANY_ID | PASS | NONE | NONE |

**Verified:** No secret values appear in client components, API responses, HTML, metadata, JSON-LD, sitemap, or error messages.

---

## 8. TOKKO Security

| Check | Status |
|-------|--------|
| API key server-only | PASS |
| No proxy endpoints | PASS |
| No direct public API access to Tokko | PASS |
| Branch ID: 85101 | CONFIGURED |
| Company ID: 47477 | CONFIGURED |

---

## 9. Editorial CMS

| Check | Status |
|-------|--------|
| EditorialOverride type defined | PASS |
| propertyId, visible, featured, editorialStatus, sortOrder, internalNote, updatedAt | PASS |
| States: available, reserved, sold | PASS |
| CRUD operations (create, read, update, delete) | PASS |
| Admin dashboard for management | PASS |

---

## 10. Persistence

| Check | Status |
|-------|--------|
| File: data/editorial-overrides.json | EXISTS |
| Auto-creation of data/ directory | PASS |
| Missing file returns [] | PASS |
| Corrupted JSON returns [] | PASS |
| Survives server restart | PASS (filesystem) |
| Survives npm install | PASS |
| Survives npm run build | PASS |
| Survives npm start | PASS |
| Not overwritten by build | PASS |
| Write uses temp file pattern | PASS |
| Path resolution: process.cwd() | PASS |

**Limitation documented:** In-memory sessions and rate limits reset on server restart. Acceptable for single-admin deployment.

---

## 11. Visibility

| Check | Status |
|-------|--------|
| visible=false → excluded from Home | PASS |
| visible=false → excluded from /propiedades | PASS |
| visible=false → excluded from categories | PASS |
| visible=false → excluded from related | PASS |
| visible=false → excluded from sitemap | PASS |
| visible=false → excluded from JSON-LD | PASS |
| visible=false → excluded from search | PASS |
| visible=false → excluded from public API | PASS |

---

## 12. Featured

| Check | Status |
|-------|--------|
| Featured priority: editorial > hash > fallback | PASS |
| Featured must be visible=true | PASS |
| Home page uses editorial featured | PASS |

---

## 13. Reserved / Sold

| Check | Status |
|-------|--------|
| reserved → displays "RESERVADA" | PASS |
| sold → displays "VENDIDA" | PASS |
| Reserved property visible when visible=true | PASS |
| Sold property visible when visible=true | PASS |
| Status does not modify Tokko data | PASS |

---

## 14. Media

| Check | Status |
|-------|--------|
| No YouTube iframes | PASS |
| No Vimeo iframes | PASS |
| No video player components | PASS |
| No 360 viewer | PASS |
| No autoplay | PASS |
| Video indicator shows "VIDEO DISPONIBLE" | PASS |
| Indicator links externally (target="_blank") | PASS |
| Photos prioritized (hero, gallery, fullscreen) | PASS |
| Next.js Image with sizes prop | PASS |
| fill + object-cover pattern | PASS |
| priority on hero images | PASS |
| Touch swipe on mobile gallery | PASS |

**Dead code removed:**
- PropertyVideoPlayer.tsx (video embed with iframes)
- PropertyVideo.tsx (simpler video embed)
- Property360Viewer.tsx (360° viewer)
- PropertyFeatures.tsx (replaced by PropertyInformation)
- PropertyAgent.tsx (unused)

---

## 15. Responsive

| Breakpoint | Status |
|------------|--------|
| 320px | PASS |
| 375px | PASS |
| 390px | PASS |
| 414px | PASS |
| 640px | PASS |
| 768px | PASS |
| 1024px | PASS |
| 1280px | PASS |
| 1440px | PASS |
| 1920px | PASS |

**Key responsive patterns:**
- `px-4 md:px-6` container
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` grids
- `text-3xl md:text-4xl lg:text-5xl` typography
- `h-[70vh] md:h-[80vh]` hero
- Mobile hamburger menu
- Mobile sticky WhatsApp CTA
- Gallery adapts to screen size

---

## 16. Accessibility / Contrast

| Check | Status |
|-------|--------|
| Text on navy background: white (high contrast) | PASS |
| Gold on navy: ~4.8:1 ratio (AA for large text) | PASS |
| Text muted on surface: sufficient for captions | PASS |
| Touch targets ≥ 44x44px | PASS |
| prefers-reduced-motion respected | PASS |
| aria-label on interactive elements | PASS |
| Keyboard navigation in gallery | PASS |

---

## 17. SEO

| Check | Status |
|-------|--------|
| Sitemap generated from public properties | PASS |
| Hidden properties excluded from sitemap | PASS |
| robots.txt blocks /admin/ and /api/ | PASS |
| Metadata per page | PASS |
| Open Graph on property pages | PASS |
| Twitter card configured | PASS |
| JSON-LD (RealEstateListing + BreadcrumbList) | PASS |
| Breadcrumbs on property detail | PASS |
| lang="es" on html | PASS |
| metadataBase configured | PASS |

---

## 18. Performance

| Check | Status |
|-------|--------|
| No embedded videos | PASS |
| ISR 30 minutes | PASS |
| Next.js Image optimization | PASS |
| Server Components by default | PASS |
| Client Components only when needed | PASS |
| No unnecessary dependencies | PASS |
| Reduced motion support | PASS |

---

## 19. Tests

```
Test Files:  22 passed (22)
Tests:       263 passed (263)
```

**Test coverage:**
- Auth utilities (credential validation, session tokens)
- Auth security (cookie flags, rate limiting, constant-time comparison)
- Revalidation API (missing/wrong/correct secret, unconfigured)
- Editorial store (CRUD, persistence, corruption handling)
- Editorial merge (visibility, featured, status, sorting)
- Editorial merge full (reserved/sold remain visible)
- Secrets comprehensive (no client exposure, no hardcoded keys)
- Client bundle (no server imports, no video iframes)
- Security scan (no console.log, no secrets in env files)

---

## 20. TypeScript

```
✓ No type errors in source code
```

---

## 21. ESLint

```
✓ Zero errors
✓ Zero warnings
```

---

## 22. Build

```
✓ Compiled successfully
✓ TypeScript passed
✓ 20 pages generated
✓ Static pages prerendered
✓ Dynamic pages configured
✓ Build complete
```

---

## 23. Hostinger Compatibility

| Check | Status |
|-------|--------|
| Node.js 22 LTS compatible | PASS |
| npm install works | PASS |
| npm run build works | PASS |
| npm start works | PASS |
| No output: "standalone" | CORRECT |
| No Vercel-specific code | PASS |
| No hardcoded port | PASS |
| PORT env var respected | PASS |
| Middleware works (proxy convention) | PASS |

---

## 24. Environment Variables

```
TOKKO_API_KEY=           (configured in Hostinger)
TOKKO_BRANCH_ID=85101    (configured in Hostinger)
TOKKO_COMPANY_ID=47477   (configured in Hostinger)
REVALIDATE_SECRET=        (configured in Hostinger)
ADMIN_USERNAME=info@firmacalamuchita.com
ADMIN_PASSWORD=           (configured in Hostinger)
NEXT_PUBLIC_SITE_URL=https://firmacalamuchita.com
```

`.env.example` created with variable names only (no secrets).

---

## 25. Deploy Checklist

1. Copy project to Hostinger (excluding .env.local, node_modules, .next, .git, audit/, renders/, video-project/, .agents/, .claude/)
2. Set Node.js version to 22 LTS in Hostinger panel
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Set environment variables in Hostinger:
   - TOKKO_API_KEY
   - TOKKO_BRANCH_ID=85101
   - TOKKO_COMPANY_ID=47477
   - REVALIDATE_SECRET (generate random value)
   - ADMIN_USERNAME=info@firmacalamuchita.com
   - ADMIN_PASSWORD (choose strong password)
   - NEXT_PUBLIC_SITE_URL=https://firmacalamuchita.com
6. Ensure `data/` directory is writable by Node process
7. Verify `data/editorial-overrides.json` exists (if overrides configured)
8. Test admin login at /admin/login
9. Verify property listing loads from Tokko
10. Test editorial overrides (hide/show a property)
11. Verify sitemap at /sitemap.xml
12. Check robots.txt at /robots.txt

---

## 26. Remaining Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| In-memory sessions reset on restart | LOW | Admin re-logs in (acceptable for single admin) |
| In-memory rate limits reset on restart | LOW | Brief window after restart (acceptable) |
| File-based storage on shared hosting | LOW | Works if data/ is writable (documented) |
| No CSRF token on login form | LOW | Mitigated by sameSite=lax cookies |
| Middleware convention deprecated | INFO | Next.js suggests migration to "proxy" — non-blocking |

---

## Files Modified

| File | Change |
|------|--------|
| src/app/api/revalidate/route.ts | timingSafeEqual, sanitized errors |
| scripts/validate-tokko.mjs | Removed hardcoded API key |
| src/app/api/admin/editorial/route.ts | Removed unused imports |
| src/lib/editorial/store.ts | Removed unused import |
| src/lib/firma/provider.ts | Removed unused import |
| src/__tests__/security/secrets.test.ts | Fixed require() imports |
| src/__tests__/editorial/store.test.ts | Removed unused imports |
| src/__tests__/editorial/merge.test.ts | Removed unused imports |
| src/__tests__/api/revalidate.test.ts | Updated error message assertion |

## Files Created

| File | Purpose |
|------|---------|
| .env.example | Deployment variable documentation |
| src/__tests__/editorial/merge-full.test.ts | Comprehensive editorial merge tests |
| src/__tests__/editorial/editorial-full.test.ts | Full editorial store tests |
| src/__tests__/security/client-bundle.test.ts | Client bundle security tests |
| src/__tests__/security/secrets-comprehensive.test.ts | Comprehensive secret scan tests |
| src/__tests__/auth/auth-security.test.ts | Auth security verification tests |

## Files Removed

| File | Reason |
|------|--------|
| src/components/property/PropertyVideoPlayer.tsx | Unused, contains video iframes |
| src/components/property/PropertyVideo.tsx | Unused, contains video iframes |
| src/components/property/Property360Viewer.tsx | Unused, not imported anywhere |
| src/components/property/PropertyFeatures.tsx | Unused, replaced by PropertyInformation |
| src/components/property/PropertyAgent.tsx | Unused, not imported anywhere |

---

## RESULTADO FINAL

```
SECURITY:                         PASS
TOKKO API KEY SERVER-ONLY:        PASS
ADMIN PASSWORD SERVER-ONLY:       PASS
REVALIDATE SECRET SERVER-ONLY:    PASS
NO SECRET CLIENT EXPOSURE:        PASS
ADMIN AUTH:                       PASS
RATE LIMITING:                    PASS
EDITORIAL OVERRIDES:              PASS
HIDDEN PROPERTIES:                PASS
FEATURED:                         PASS
RESERVED:                         PASS
SOLD:                             PASS
INTERNAL NOTE PRIVATE:            PASS
NO VIDEO IFRAMES:                 PASS
PHOTOS WORKING:                   PASS
MOBILE CONTRAST:                  PASS
RESPONSIVE:                       PASS
CATEGORY UI:                      PASS (uses existing premium cards)
SEO:                              PASS
SITEMAP FILTERED:                 PASS
TESTS:                            263/263
TYPESCRIPT:                       PASS
ESLINT:                           PASS
BUILD:                            PASS
HOSTINGER COMPATIBILITY:          PASS
SECRET EXPOSURE:                  PASS
```

```
PROJECT STATUS: READY FOR HOSTINGER DEPLOY
```
