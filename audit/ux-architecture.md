# UX Architecture — FIRMA Calamuchita

## 1. Site Map

```
/                           → HOME
/propiedades                → PROPERTIES LIST
/propiedades/[slug]         → PROPERTY DETAIL
/calamuchita                → TERRITORY / ABOUT
/vender                     → SELL PROPERTY
/contacto                   → CONTACT
```

**Not implemented yet** (future):
- `/blog`
- `/nosotros`
- `/favoritos`

---

## 2. Navigation

### Desktop

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  FIRMA                                    PROPIEDADES  CALAMUCHITA  VENDER  CONTACTO  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

- Fixed position
- Transparent over hero → Solid on scroll
- Logo: FIRMA (wordmark)
- Links: Uppercase, wide letter-spacing

### Mobile

```
┌───────────────────────────────┐
│  FIRMA                  MENU  │
└───────────────────────────────┘
```

Menu opens full-screen overlay:
```
┌───────────────────────────────┐
│                           ✕   │
│                               │
│  PROPIEDADES                  │
│  CALAMUCHITA                  │
│  VENDER                       │
│  CONTACTO                     │
│                               │
│  ─────────────────────────    │
│  +54 9 3516 19-5892          │
│                               │
└───────────────────────────────┘
```

---

## 3. HOME Page

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         HERO                                │
│  [Background: property image or video]                      │
│  [Overlay: dark gradient]                                   │
│                                                             │
│  FIRMA CALAMUCHITA                                          │
│                                                             │
│  PROPIEDADES                                                │
│  QUE ENCUENTRAN                                             │
│  SU LUGAR.                                                  │
│                                                             │
│  [EXPLORAR PROPIEDADES →]                                   │
│                                                             │
│  ─────────────────────────────                              │
│  36 propiedades disponibles                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  FEATURED PROPERTIES                        │
│                                                             │
│  PROPIEDADES DESTACADAS                                     │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────┐                │
│  │                      │  │              │                │
│  │    [LARGE IMAGE]     │  │  [SMALL IMG] │                │
│  │                      │  │              │                │
│  │  Complejo de Cabañas │  │  Casa 5 Amb  │                │
│  │  Villa Rumipal       │  │  Villa Dique │                │
│  │                      │  │              │                │
│  │  USD 750.000         │  │  USD 450.000 │                │
│  └──────────────────────┘  └──────────────┘                │
│  ┌──────────────────────┐                                   │
│  │    [SMALL IMAGE]     │                                   │
│  │  Domo San Ignacio    │                                   │
│  │  USD 60.000          │                                   │
│  └──────────────────────┘                                   │
│                                                             │
│  [VER TODAS →]                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      TERRITORY                              │
│  [Background: landscape image]                              │
│  [Overlay]                                                  │
│                                                             │
│  VALLE DE CALAMUCHITA                                       │
│                                                             │
│  Un territorio que combina                                   │
│  naturaleza y oportunidad.                                  │
│                                                             │
│  Villa Rumipal • Embalse • Mina Clavero                     │
│                                                             │
│  [CONOCER MÁS →]                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       SERVICES                              │
│                                                             │
│  ¿QUÉ HACEMOS?                                              │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │  VENTA      │ │  ALQUILER   │ │  ASESORAMIENTO│         │
│  │             │ │             │ │             │          │
│  │  Encontrá   │ │  Viví el    │ │  Invertí    │          │
│  │  tu hogar   │ │  territorio │ │  con respaldo│         │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        CTA                                  │
│  [Background: Navy]                                         │
│                                                             │
│  ¿BUSCÁS VENDER                                              │
│  TU PROPIEDAD?                                              │
│                                                             │
│  Te asesoramos desde la tasación                            │
│  hasta la escrituración.                                    │
│                                                             │
│  [HABLEMOS →]                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       FOOTER                                │
│                                                             │
│  FIRMA                                                      │
│  Negocios Inmobiliarios                                     │
│  Suc. Calamuchita                                           │
│                                                             │
│  PROPIEDADES    CALAMUCHITA    VENDER    CONTACTO           │
│                                                             │
│  Villa Rumipal, Córdoba, Argentina                         │
│  +54 9 3516 19-5892                                        │
│  ezefsar@gmail.com                                          │
│                                                             │
│  © 2026 FIRMA. Todos los derechos reservados.              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. PROPERTIES Page

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [Breadcrumb]                                               │
│                                                             │
│  PROPIEDADES                                                │
│  36 propiedades disponibles                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FILTERS                                                    │
│                                                             │
│  [Todos] [Casas] [Terrenos] [Departamentos] [Campo]        │
│                                                             │
│  Ordenar: [Más recientes ▾]                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PROPERTY GRID                                              │
│                                                             │
│  ┌──────────────────────────────────┐ ┌────────────────┐   │
│  │                                  │ │                │   │
│  │        [LARGE IMAGE]             │ │  [SMALL IMAGE] │   │
│  │                                  │ │                │   │
│  │  CASA • VILLA RUMIPAL            │ │  LOTE • 565 M² │   │
│  │  Casa 5 ambientes con pileta     │ │  Villa Rumipal │   │
│  │                                  │ │                │   │
│  │  USD 450.000                     │ │  USD 30.000    │   │
│  └──────────────────────────────────┘ └────────────────┘   │
│  ┌──────────────────┐ ┌──────────────────┐ ┌───────────┐   │
│  │  [IMG]           │ │  [IMG]           │ │  [IMG]    │   │
│  │  DOMO • SAN IGN. │ │  CABANA • RUMIPAL│ │  LOTE     │   │
│  │  USD 60.000      │ │  USD 105.000     │ │  USD 19k  │   │
│  └──────────────────┘ └──────────────────┘ └───────────┘   │
│                                                             │
│  [CARGAR MÁS]                                               │
└─────────────────────────────────────────────────────────────┘
```

### Filter Behavior

- Pills/tabs for property type
- Dropdown for sort
- No complex sidebar filters (minimalist)
- URL updates with filters: `/propiedades?tipo=casa`

---

## 5. PROPERTY DETAIL Page

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HERO                                                       │
│  [Full-width image]                                         │
│  [Dark overlay]                                             │
│                                                             │
│  [← Volver]                                                 │
│                                                             │
│  CASA • VILLA RUMIPAL                                       │
│  Casa 5 Ambientes con Piscina                               │
│                                                             │
│  USD 450.000                                                │
│                                                             │
│  [VER GALERÍA]  [CONSULTAR]                                 │
│                                                             │
│  1/12                                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  OVERVIEW                                                   │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  5 AMB   │ │  3 DORM  │ │  2 BAÑOS │ │  200 M²  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  Hermosa casa con vista al lago, ubicada en Villa           │
│  Rumipal a solo 200 metros del embalse.                     │
│  Perfecta para quienes buscan naturaleza y tranquilidad.    │
│                                                             │
│  [VER MÁS]                                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  GALLERY                                                    │
│                                                             │
│  ┌──────────────────────────────────┐ ┌────────────────┐   │
│  │                                  │ │  [THUMB 2]     │   │
│  │        [MAIN IMAGE]              │ ├────────────────┤   │
│  │                                  │ │  [THUMB 3]     │   │
│  │                                  │ ├────────────────┤   │
│  │                                  │ │  [THUMB 4]     │   │
│  └──────────────────────────────────┘ └────────────────┘   │
│                                                             │
│  [VER GALERÍA COMPLETA →]                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DETAILS                                                    │
│                                                             │
│  CARACTERÍSTICAS                                            │
│                                                             │
│  Superficie total      200 m²                               │
│  Superficie cubierta   150 m²                               │
│  Dormitorios           3                                    │
│  Baños                 2                                    │
│  Estacionamiento       2                                    │
│  Antigüedad            5 años                               │
│                                                             │
│  UBICACIÓN                                                  │
│                                                             │
│  [MAP]                                                      │
│  Villa Rumipal, Calamuchita, Córdoba                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  VIDEO                                                      │
│                                                             │
│  VIDEO DE LA PROPIEDAD                                      │
│                                                             │
│  ┌──────────────────────────────────────────┐              │
│  │              [VIDEO PLAYER]              │              │
│  │                                          │              │
│  │                  ▶                       │              │
│  │                                          │              │
│  └──────────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  AGENT                                                      │
│                                                             │
│  TU ASESOR                                                  │
│                                                             │
│  [PHOTO]  Ezequiel Fernandez                                │
│           FIRMA Negocios Inmobiliarios                      │
│           +54 9 3516 19-5892                                │
│                                                             │
│  [WHATSAPP]  [LLAMAR]  [EMAIL]                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CTA                                                        │
│  [Background: Navy + Gold]                                  │
│                                                             │
│  ¿TE INTERESA ESTA PROPIEDAD?                               │
│                                                             │
│  [CONSULTAR AHORA →]                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  RELATED                                                    │
│                                                             │
│  PROPIEDADES SIMILARES                                      │
│                                                             │
│  [Card] [Card] [Card]                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STICKY BOTTOM (Mobile)                                     │
│                                                             │
│  [WHATSAPP]  [CONSULTAR]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. CONTACT Page

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HERO (small)                                               │
│  [Background: Navy]                                         │
│                                                             │
│  CONTACTO                                                   │
│  Estamos para ayudarte                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │                      │  │                      │        │
│  │  FORMULARIO          │  │  INFORMACIÓN         │        │
│  │                      │  │                      │        │
│  │  Nombre              │  │  FIRMA Calamuchita   │        │
│  │  [___________]       │  │                      │        │
│  │                      │  │  Villa Rumipal       │        │
│  │  Email               │  │  Córdoba, Argentina  │        │
│  │  [___________]       │  │                      │        │
│  │                      │  │  +54 9 3516 19-5892  │        │
│  │  Teléfono            │  │  ezefsar@gmail.com   │        │
│  │  [___________]       │  │                      │        │
│  │                      │  │  [MAP]               │        │
│  │  Mensaje             │  │                      │        │
│  │  [___________]       │  │                      │        │
│  │  [___________]       │  │                      │        │
│  │                      │  │                      │        │
│  │  [ENVIAR →]          │  │                      │        │
│  └──────────────────────┘  └──────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. SELL PROPERTY Page

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HERO                                                       │
│  [Background: Navy]                                         │
│                                                             │
│  VENDER TU                                                   │
│  PROPIEDAD                                                  │
│  Te acompañamos en todo el proceso                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PROCESS                                                    │
│                                                             │
│  CÓMO TRabajAMOS                                            │
│                                                             │
│  01  TASACIÓN                                               │
│  Evaluamos tu propiedad con criterios                      │
│  de mercado actualizados.                                   │
│                                                             │
│  02  ESTRATEGIA                                             │
│  Diseñamos el plan de venta más                            │
│  efectivo para tu caso.                                     │
│                                                             │
│  03  PUBLICACIÓN                                            │
│  Presentamos tu propiedad con fotos,                       │
│  videos y descripción profesional.                          │
│                                                             │
│  04  CIERRE                                                 │
│  Negociamos y acompañamos hasta                           │
│  la escrituración.                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CTA                                                        │
│                                                             │
│  ¿QUERÉS VENDER?                                            │
│                                                             │
│  [HABLEMOS →]                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. CALAMUCHITA / TERRITORY Page

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HERO                                                       │
│  [Full-width landscape]                                     │
│  [Overlay]                                                  │
│                                                             │
│  VALLE DE CALAMUCHITA                                       │
│  Donde la naturaleza                                       │
│  se encuentra con la oportunidad                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TERRITORY                                                  │
│                                                             │
│  CALAMUCHITA                                                │
│                                                             │
│  Ubicado en el corazón de Córdoba,                         │
│  el Valle de Calamuchita ofrece un                         │
│  equilibrio perfecto entre naturaleza                       │
│  y conectividad.                                            │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                      │
│  │ EMBALSE │ │V.RUMIPAL│ │MINA     │                      │
│  │         │ │         │ │CLAVERO  │                      │
│  └─────────┘ └─────────┘ └─────────┘                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PROPERTIES IN TERRITORY                                    │
│                                                             │
│  PROPIEDADES EN CALAMUCHITA                                 │
│                                                             │
│  [Property Grid]                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Page Transitions

- Fade in content on page load (300ms)
- No flashy transitions
- Scroll-triggered reveals for sections (600ms)
- Image scale on hero (subtle, 1200ms)

---

## 10. Media Architecture

### PropertyMedia Types

| Type | Source | Status |
|------|--------|--------|
| Image | Tokko photos[] | Active (982 total) |
| Video | Tokko videos[] | Active (34 total) |
| 360 Panorama | — | Future (model ready) |
| Tour (Matterport) | — | Future |

### Image Contexts

| Context | Size | Priority | Lazy |
|---------|------|----------|------|
| Hero | Full width | Yes | No |
| Card | Thumbnail | No | Yes |
| Gallery main | Large | No | Yes |
| Gallery thumb | Small | No | Yes |
| Map marker | Tiny | No | Yes |

### Video Contexts

| Context | Autoplay | Muted | Controls | Poster |
|---------|----------|-------|----------|--------|
| Hero | Yes | Yes | No | Yes |
| Detail | No | Yes | Yes | Yes |
| Gallery | No | Yes | Yes | Yes |

---

## 11. WhatsApp Integration

Floating WhatsApp button on:
- Property detail (mobile: sticky bottom)
- Contact page
- All pages (floating, bottom-right)

Number: +54 9 3516 19-5892

---

## 12. SEO Structure

### Per Page

| Page | Title | Description | OG Image |
|------|-------|-------------|----------|
| Home | FIRMA Calamuchita — Propiedades en Calamuchita | ... | Brand image |
| Properties | Propiedades en Venta — FIRMA Calamuchita | ... | Collage |
| Property Detail | {Title} — FIRMA Calamuchita | {description} | Main photo |
| Territory | Calamuchita — FIRMA | ... | Landscape |
| Contact | Contacto — FIRMA Calamuchita | ... | Brand image |
| Sell | Vender tu Propiedad — FIRMA Calamuchita | ... | Navy bg |
