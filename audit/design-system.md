# Design System — FIRMA Calamuchita

## 1. Brand Identity

**Name**: FIRMA CALAMUCHITA
**Branch**: FIRMA Negocios Inmobiliarios — Suc. Calamuchita
**Location**: Villa Rumipal, Córdoba, Argentina

**Values**: Confianza, Arquitectura, Naturaleza, Territorio, Exclusividad, Profesionalismo, Modernidad, Cercanía, Inversión

**NOT**: Portal genérico, Marketplace, WordPress, HivePress, Plantilla, Dashboard, SaaS

**Artistic Direction**: REAL ESTATE + TERRITORY + ARCHITECTURE

**Experience**: Minimalista, Premium, Futurista, Editorial, Cinematográfica, Inmersiva

**Futurista means**: Typography, Space, Movement, Composition, Interaction, Photography. NOT neon, glassmorphism, excessive gradients.

---

## 2. Color Palette

### Brand Colors

| Name | Hex | Usage |
|------|-----|-------|
| Gold | `#CEB88A` | Accent only — CTAs, highlights, borders |
| Gold Light | `#DFD0AA` | Hover states, subtle accents |
| Gold Dark | `#B8A276` | Active states |
| Navy | `#272F51` | Primary brand — text, headers, dark surfaces |
| Navy Light | `#3A4468` | Elevated dark surfaces |
| Navy Dark | `#1A2140` | Deepest dark backgrounds |
| Blue | `#18286E` | Secondary brand — links, interactive elements |
| Blue Light | `#2A3D8A` | Link hover |
| Blue Dark | `#0F1A52` | Deep backgrounds |
| White | `#FFFFFF` | Backgrounds, text on dark |
| Black | `#000000` | True black (sparingly) |

### Semantic Colors — Light Mode

| Token | Value | Usage |
|-------|-------|-------|
| `--color-background` | White | Page background |
| `--color-surface` | `#F8F7F5` | Cards, sections |
| `--color-surface-elevated` | White | Elevated cards, modals |
| `--color-text-primary` | Navy | Headings, body text |
| `--color-text-secondary` | `#5A6078` | Subtitles, descriptions |
| `--color-text-muted` | `#8E93A8` | Captions, labels |
| `--color-text-inverse` | White | Text on dark backgrounds |
| `--color-border` | `#E5E3DF` | Subtle borders |
| `--color-border-strong` | `#D0CDC8` | Emphasized borders |
| `--color-accent` | Gold | CTAs, highlights |
| `--color-accent-hover` | Gold Dark | CTA hover |
| `--color-overlay` | Navy 60% | Image overlays |
| `--color-overlay-light` | Navy 30% | Subtle overlays |
| `--color-overlay-heavy` | Navy 85% | Full dark overlays |

### Color Modes

Two visual contexts, NOT a user toggle:

| Context | Background | Surface | Text | Usage |
|---------|-----------|---------|------|-------|
| Light | White | `#F8F7F5` | Navy | Content, information |
| Dark | Navy Dark | `#1E2545` | White | Hero, gallery, CTA |

Transitions are intentional, not toggled.

---

## 3. Typography

### Font Combination

| Role | Font | Fallback | Character |
|------|------|----------|-----------|
| Display | Georgia | Times New Roman, serif | Architecture, editorial |
| Body | Inter | system-ui, sans-serif | Modern, legible |
| Mono | JetBrains Mono | monospace | Code only |

**Why Georgia for display**: Classic, architectural, premium feel. Not tech, not generic.

### Font Weights

| Name | Value | Usage |
|------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Labels, captions |
| Semibold | 600 | Headings |
| Bold | 700 | Emphasis (rare) |

### Type Scale — Desktop

| Token | Size | Line Height | Letter Spacing | Usage |
|-------|------|-------------|----------------|-------|
| `display-xl` | 72px | 1.05 | -0.02em | Hero headline |
| `display-lg` | 56px | 1.05 | -0.02em | Section headline |
| `display-md` | 40px | 1.05 | -0.02em | Sub-section |
| `heading-xl` | 32px | 1.15 | -0.01em | Card title |
| `heading-lg` | 24px | 1.15 | -0.01em | Sub-heading |
| `heading-md` | 20px | 1.15 | -0.01em | Small heading |
| `body-lg` | 18px | 1.6 | 0 | Lead paragraph |
| `body-md` | 16px | 1.6 | 0 | Body text |
| `body-sm` | 14px | 1.6 | 0 | Secondary text |
| `caption` | 12px | 1.6 | 0.05em uppercase | Labels, tags |

### Mobile Scale

Reduce by one step on mobile (< 768px):
- `display-xl` → `display-lg` (56px → 40px)
- `display-lg` → `display-md` (56px → 40px)
- `display-md` → `heading-xl` (40px → 32px)

---

## 4. Grid System

### Columns

| Breakpoint | Columns | Gutter | Container |
|------------|---------|--------|-----------|
| Mobile (< 640px) | 4 | 16px | 100% (padding: 16px) |
| Tablet (640-1024px) | 8 | 24px | 100% (padding: 24px) |
| Desktop (> 1024px) | 12 | 24px | Max 1440px, centered |

### Container

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 var(--grid-gutter);
}
```

### Editorial Layouts

Property grids support asymmetric compositions:
- 1 large + 2 small
- 2 large + 1 small
- Full width
- Masonry-like

NOT: 3 identical cards in a row.

---

## 5. Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0 | — |
| `--space-1` | 4px | Inline spacing |
| `--space-2` | 8px | Tight gaps |
| `--space-3` | 12px | Small gaps |
| `--space-4` | 16px | Standard gaps |
| `--space-5` | 24px | Medium gaps |
| `--space-6` | 32px | Large gaps |
| `--space-7` | 48px | Section spacing |
| `--space-8` | 64px | Large sections |
| `--space-9` | 96px | Hero spacing |
| `--space-10` | 128px | Full sections |

---

## 6. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | Sharp edges |
| `--radius-sm` | 2px | Subtle rounding |
| `--radius-md` | 4px | Buttons, inputs |
| `--radius-lg` | 8px | Cards |
| `--radius-xl` | 12px | Modals |

**Principle**: Architectural. Small to medium. Never `rounded-full` for everything.

---

## 7. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-none` | none | — |
| `--shadow-sm` | 0 1px 2px | Subtle lift |
| `--shadow-md` | 0 2px 8px | Cards |
| `--shadow-lg` | 0 4px 16px | Elevated surfaces |
| `--shadow-xl` | 0 8px 32px | Modals, dropdowns |

---

## 8. Motion

### Principles

1. Motion communicates hierarchy.
2. Motion guides attention.
3. Motion must not distract.
4. Motion respects `prefers-reduced-motion`.
5. Mobile has simplified animations.

### Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Hover states, toggles |
| `--duration-normal` | 300ms | Transitions, reveals |
| `--duration-slow` | 600ms | Page transitions |
| `--duration-slower` | 1200ms | Cinematic reveals |
| `--ease-standard` | cubic-bezier(0.4, 0, 0.2, 1) | Default |
| `--ease-emphasized` | cubic-bezier(0.0, 0, 0.2, 1) | Important |
| `--ease-decelerate` | cubic-bezier(0.0, 0, 0, 1) | Entering |

### Animation Types

| Type | Duration | Usage |
|------|----------|-------|
| Fade | 300ms | Content appearing |
| Reveal | 600ms | Scroll-triggered |
| Image Scale | 1200ms | Hero, gallery |
| Parallax | Continuous | Scroll depth |
| Slide | 300ms | Navigation |
| Mask Reveal | 600ms | Text, images |
| Text Reveal | 600ms | Headlines |

---

## 9. Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-above` | 10 | Over siblings |
| `--z-dropdown` | 100 | Dropdowns, tooltips |
| `--z-sticky` | 200 | Sticky header |
| `--z-overlay` | 300 | Overlays |
| `--z-modal` | 400 | Modals |
| `--z-toast` | 500 | Toasts, notifications |

---

## 10. Components

### Component Architecture

```
components/
  layout/
    Container.tsx
    Grid.tsx
    Section.tsx
    Header.tsx
    Footer.tsx
  navigation/
    Navbar.tsx
    MobileMenu.tsx
    Breadcrumb.tsx
  typography/
    Display.tsx
    Heading.tsx
    Body.tsx
    Caption.tsx
  buttons/
    Button.tsx (variants: primary, secondary, ghost, gold, dark, light)
    Link.tsx
  media/
    Image.tsx
    Video.tsx
    Gallery.tsx
    Panorama360.tsx
  property/
    PropertyCard.tsx (variants: editorial, featured, compact)
    PropertyGrid.tsx
    PropertyDetail.tsx
    PropertyHero.tsx
  sections/
    Hero.tsx
    FeaturedProperties.tsx
    Territory.tsx
    Services.tsx
    CTA.tsx
    Testimonials.tsx
  ui/
    Badge.tsx
    Tag.tsx
    Price.tsx
    WhatsAppButton.tsx
```

### Button Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| Primary | Navy | White | None | Main CTAs |
| Secondary | White | Navy | Navy | Secondary actions |
| Ghost | Transparent | Navy | None | Tertiary actions |
| Gold | Gold | Navy | None | Accent CTAs |
| Dark | Navy Dark | White | None | Dark contexts |
| Light | White | Navy | None | Light contexts |

**Button text style**: Uppercase, wide letter-spacing, editorial feel.

### Navigation

**Desktop**:
```
FIRMA                                    PROPIEDADES | CALAMUCHITA | VENDER | CONTACTO
```

**Mobile**:
```
FIRMA                                    MENU (hamburger)
```

Mobile menu: Full-screen overlay, navy background, large typography.

### Header

Two modes:
1. **Transparent** — Over hero (white text, logo inverted)
2. **Solid** — Over content (navy text, standard logo)

### Property Card

Three variants:
1. **Editorial** — Large image, minimal text, asymmetric layout
2. **Featured** — Gold accent, prominent price, badge
3. **Compact** — Horizontal layout, smaller image, dense info

**Photography dominates**. Not marketplace feel.

### Property Grid

Editorial layouts:
- 1 large + 2 small (asymmetric)
- 2 large + 1 small
- Full width hero card
- 3-column equal (rare)

### Hero

Architecture:
```
Hero
├── background media (image/video/slider)
├── overlay (dark gradient)
├── eyebrow (caption text)
├── title (display-xl)
├── description (body-lg)
├── CTA (button)
└── pagination (if slider)
```

### Gallery

Features:
- Fullscreen mode
- Thumbnails
- Keyboard navigation
- Swipe gestures
- Lazy loading
- Mobile-optimized

### Property Detail Sections

```
01 HERO
02 PROPERTY OVERVIEW
03 GALLERY
04 PROPERTY DETAILS
05 VIDEO
06 360 / TOUR (future)
07 LOCATION
08 AGENT
09 CONTACT CTA
10 RELATED PROPERTIES
```

---

## 11. Responsive Breakpoints

| Name | Min | Max | Columns | Usage |
|------|-----|-----|---------|-------|
| Mobile | 0 | 639px | 4 | Phones |
| Tablet | 640px | 1023px | 8 | Tablets |
| Desktop | 1024px | 1279px | 12 | Small desktop |
| Wide | 1280px | 1439px | 12 | Standard desktop |
| Ultra | 1440px | — | 12 | Large screens |

**Mobile first**: Design for 375px, scale up.

**Validate**: 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px.

---

## 12. Mobile UX

Mobile is first-class:
- Property hero: Full-width image, overlay text
- Gallery: Swipe gestures, fullscreen
- Video: Lazy load, poster image
- CTA: Sticky bottom bar
- WhatsApp: Floating button
- Navigation: Hamburger → full-screen overlay

**Sticky Bottom CTA** on property detail:
```
[WHATSAPP]  [CONSULTAR]
```

---

## 13. Accessibility

**Target**: WCAG AA minimum

- Contrast: 4.5:1 for text, 3:1 for large text
- Focus: Visible focus rings on all interactive elements
- Keyboard: Full keyboard navigation
- ARIA: Labels on all interactive elements
- Alt text: Descriptive alt on all images
- Reduced motion: Respect `prefers-reduced-motion`
- Semantic HTML: Proper heading hierarchy, landmarks

---

## 14. Performance

Media-heavy site requires:
- Lazy loading for all images below fold
- Responsive images (`srcset`, `sizes`)
- Priority only for hero image
- Poster images for videos
- Dynamic imports for gallery, 360 viewer
- No autoplay video on mobile
- No huge JS bundles
- Load only visible images (982 total, show ~20 per page)

---

## 15. Design Tokens File

All tokens defined in: `src/app/globals.css`

Single source of truth. Never repeat `#CEB88A` across 30 files.

Use CSS variables, not Tailwind arbitrary values.

**Good**: `bg-[var(--color-brand-gold)]`
**Bad**: `bg-[#CEB88A]`
**Better**: Use semantic classes defined in globals.css
