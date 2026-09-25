# Assets — FIRMA Calamuchita

Estructura de assets estáticos del proyecto.

## Brand

```
public/assets/brand/
├── logo/
│   ├── logo.svg           # Logo principal (fondo claro)
│   ├── logo-light.svg     # Logo sobre fondo oscuro
│   └── logo-dark.svg      # Logo sobre fondo claro (alternativo)
├── favicon/
│   ├── favicon.ico        # Favicon estándar
│   └── apple-touch-icon.png  # Apple Touch Icon (180x180)
└── social/
    └── og-image.png       # Open Graph image (1200x630)
```

## Advisors (Fotos de asesores)

```
public/assets/advisors/
├── sabina-acosta/
│   └── photo.webp         # Foto de Sabina Acosta
├── ezequiel-fernandez/
│   └── photo.webp         # Foto de Ezequiel Fernandez
└── aldo-fabricatore/
    └── photo.webp         # Foto de Aldo Fabricatore
```

## Territory (Fotos del Valle de Calamuchita)

```
public/assets/territory/
└── *.webp                 # Fotos de Villa Rumipal, Embalse, etc.
```

## Properties (Fotos de propiedades destacadas)

```
public/assets/properties/
└── *.webp                 # Fotos de portada de propiedades destacadas
```

## Videos

```
public/assets/videos/
└── *.mp4                  # Videos de propiedades (futuro)
```

## Instrucciones

1. Subí los archivos a las rutas indicadas arriba.
2. Los componentes usan las rutas centralizadas en `src/config/assets.ts`.
3. Si una imagen no existe, se muestra un placeholder elegante automáticamente.
4. Formato recomendado: WebP para fotos, SVG para logos, PNG para favicons.
5. Tamaño recomendado fotos: 1200px de ancho máximo.
6. Tamaño OG image: 1200x630px.
