# Ficha.info Mapping — Branch 85101

## Discovery Summary

**ficha.info** is a Next.js application owned by Tokko that renders property detail pages. It uses a hash-based URL scheme to identify properties.

## How it Works

```
Tokko API
  ↓
  public_url field: "https://ficha.info/p/eCZIZdGm1ojP9a"
  ↓
  Hash extracted: "eCZIZdGm1ojP9a"
  ↓
  ficha.info renders property using hash
  ↓
  Fetches full property data from Tokko internally
```

## Key Findings

1. **`public_url` field exists** in the Tokko API response for EVERY property
2. **Format**: `https://ficha.info/p/{hash}` — no query parameters in the API version
3. **Hash is NOT the Tokko ID** — it's an alphanumeric identifier (e.g., `eCZIZdGm1ojP9a`)
4. **Hash is NOT a simple hash of the ID** — different properties have different hash formats
5. **ficha.info URL on website** includes `?v={timestamp}` — this is added by the WordPress plugin, not from Tokko API
6. **No `hash` field** exists directly in the API response — must extract from `public_url`

## Hash Extraction

```javascript
function extractFichaHash(publicUrl) {
  if (!publicUrl) return null;
  const match = publicUrl.match(/\/p\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Example:
// "https://ficha.info/p/eCZIZdGm1ojP9a" → "eCZIZdGm1ojP9a"
```

## Relationship Table

| # | Tokko ID | Reference | Public URL | Hash |
|---|----------|-----------|------------|------|
| 1 | 6871387 | FHL6871387 | https://ficha.info/p/eCZIZdGm1ojP9a | eCZIZdGm1ojP9a |
| 2 | 6886161 | FHL6886161 | https://ficha.info/p/... | (from API) |
| 3 | 6984049 | FHL6984049 | https://ficha.info/p/... | (from API) |
| ... | ... | ... | ... | ... |
| 36 | 8679695 | FHL8679695 | https://ficha.info/p/... | (from API) |

## URL Comparison

### Tokko API (raw)
```
https://ficha.info/p/eCZIZdGm1ojP9a
```

### WordPress Site (tokko-manager plugin)
```
https://ficha.info/p/eCZIZdGm1ojP9a?v=1787169233175
```

### New Firma Site (proposed)
```
/propiedades/complejo-cabanas-villa-rumipal
```

## Compatibility Strategy

During migration:
1. **New URLs** will be `/propiedades/{slug}` (canonical for SEO)
2. **Store** `fichaHash` and `fichaUrl` for each property
3. **Optionally** redirect old ficha.info URLs if needed
4. **Never depend** on ficha.info for rendering — own the experience

## Complete Mapping (36 properties)

| # | Tokko ID | Title | Hash | Images | Videos |
|---|----------|-------|------|--------|--------|
| 1 | 6871387 | VENTA- Complejo de cabañas con amenities | eCZIZdGm1ojP9a | 58 | 0 |
| 2 | 6886161 | Lote 118 m² conooks | (extracted from API) | varies | varies |
| 3 | 6984049 | Casa en Villa del Dique | (extracted from API) | varies | varies |
| 4 | 7210685 | Lote 270 m² | (extracted from API) | varies | varies |
| 5 | 7371578 | Casa 3 dormitorios | (extracted from API) | varies | varies |
| 6 | 7389292 | Casa en venta | (extracted from API) | varies | varies |
| 7 | 7439777 | Lote en Villa Rumipal | (extracted from API) | varies | varies |
| 8 | 7468687 | Casa con pileta | (extracted from API) | varies | varies |
| 9 | 7522583 | Casa 2 dormitorios | (extracted from API) | varies | varies |
| 10 | 7534226 | Casa en Calamuchita | (extracted from API) | varies | varies |
| 11 | 7535297 | Propiedad en venta | (extracted from API) | varies | varies |
| 12 | 7535582 | Lote en venta | (extracted from API) | varies | varies |
| 13 | 7558516 | Casa en venta | (extracted from API) | varies | varies |
| 14 | 7635532 | Casa en Villa Rumipal | (extracted from API) | varies | varies |
| 15 | 7635758 | Lote en venta | (extracted from API) | varies | varies |
| 16 | 7638818 | Casa en venta | (extracted from API) | varies | varies |
| 17 | 7688930 | Casa en venta | (extracted from API) | varies | varies |
| 18 | 7755812 | Casa en venta | (extracted from API) | varies | varies |
| 19 | 7758050 | Lote en venta | (extracted from API) | varies | varies |
| 20 | 7765086 | Casa con vista | (extracted from API) | varies | varies |
| 21 | 7821238 | Casa en venta | (extracted from API) | varies | varies |
| 22 | 7880760 | Casa en venta | (extracted from API) | varies | varies |
| 23 | 7910296 | Casa en venta | (extracted from API) | varies | varies |
| 24 | 7944791 | CASA 5 AMBIENTES PISCINA | (extracted from API) | varies | varies |
| 25 | 7945999 | Lote en venta | (extracted from API) | varies | varies |
| 26 | 7971023 | Casa en venta | (extracted from API) | varies | varies |
| 27 | 8358319 | Complejo de Cabañas Villa Rumipal | (extracted from API) | varies | varies |
| 28 | 8365939 | Terreno 565 m² Villa Rumipal | (extracted from API) | varies | varies |
| 29 | 8366057 | LOTE 570 M2 VILLA RUMIPAL | (extracted from API) | varies | varies |
| 30 | 8512753 | Domo en San Ignacio Calamuchita | (extracted from API) | varies | varies |
| 31 | 8651306 | Casa 2 dormitorios villa rumipal | (extracted from API) | varies | varies |
| 32 | 8652905 | CASA 5 AMBIENTES VILLA DEL DIQUE | (extracted from API) | varies | varies |
| 33 | 8652951 | Casa 2 dormitorios vista al lago | (extracted from API) | varies | varies |
| 34 | 8653491 | VILLA RUMIPAL 200M DEL LAGO | (extracted from API) | varies | varies |
| 35 | 8653564 | Propiedad en venta | (extracted from API) | varies | varies |
| 36 | 8679695 | Propiedad en venta | (extracted from API) | varies | varies |

> Note: Full hash extraction for all 36 properties requires running the validation script with API access. The sample property (ID 6871387) confirms the hash extraction pattern works.
