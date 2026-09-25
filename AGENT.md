# AUDITORIA FIRMA CALAMUCHITA — Agosto 2026

## RESUMEN EJECUTIVO

Firma Calamuchita es una sucursal de FIRMA Negocios Inmobiliarios ubicada en Villa Rumipal, Valle de Calamuchita, Córdoba, Argentina. El sitio actual funciona sobre WordPress + HivePress + Tokko Manager, y redirige a los usuarios a ficha.info para ver el detalle de cada propiedad. El objetivo es reemplazar este stack por una aplicación Next.js moderna, manteniendo Tokko como fuente de verdad del inventario.

---

## 1. STACK ACTUAL

### 1.1 CMS y Core
| Componente | Versión | Estado |
|---|---|---|
| WordPress | 6.8.8 | Activo |
| PHP | No determinado (Hostinger) | Activo |
| Hosting | Hostinger | Activo |

### 1.2 Tema
| Componente | Versión | Detalle |
|---|---|---|
| ListingHive (parent) | — | Tema base HivePress |
| ListingHive-child | 1.0 | Tema hijo con personalizaciones CSS |

### 1.3 Plugin Principal
| Plugin | Versión | Función |
|---|---|---|
| HivePress | 1.7.25 | Core de listings, usuarios, mensajes |
| HivePress Geolocation | 1.3.10 | Geolocalización de propiedades |
| HivePress Messages | 1.4.0 | Sistema de mensajería interna |
| HivePress Paid Listings | 1.1.9 | Listados pagados |
| HivePress Reviews | 1.4.0 | Reseñas de usuarios |

### 1.4 Plugin Tokko
| Plugin | Versión | Función |
|---|---|---|
| **tokko-manager** | **4.1** | **Conecta Tokko Broker con WordPress** |

El plugin `tokko-manager` renderiza shortcodes que muestran propiedades de Tokko. Las propiedades se enlazan directamente a `ficha.info`, NO a páginas internas de WordPress.

### 1.5 Otros Plugins
| Plugin | Versión | Función |
|---|---|---|
| Elementor | 4.1.4 | Page builder (usado en páginas internas) |
| Instagram Feed (Smash Balloon) | 6.12.0 | Feed de Instagram |
| Feeds for TikTok | — | Feed de TikTok |
| Custom Facebook Feed | 4.10.0 | Feed de Facebook |
| Custom Twitter Feeds | 2.8.0 | Feed de Twitter |
| Feeds for YouTube | 2.8.1 | Feed de YouTube |
| WP WhatsApp | 3.8.2 | Botón de WhatsApp |
| TranslatePress Multilingual | 3.3.3 | Multilingüe (es-ES, es-AR) |
| PixelYourSite Free | 11.3.0.1 | Tracking (Meta Pixel, GA) |
| Hostinger Reach | — | Suscripciones email |
| Omnisend | 1.8.1 | Email marketing |

### 1.6 Dependencias Visualizadas (CSS/JS de HivePress)
- Fancybox (galería)
- Slick Carousel
- Flatpickr (fechas)
- Select2
- intl-tel-input (teléfono)
- jQuery UI
- Font Awesome 4.7.0

---

## 2. ESTRUCTURA DE URLs ACTUAL

| Página | URL | Función |
|---|---|---|
| Inicio | `/` | Home con hero + categorías + propiedades destacadas |
| Categorías | `/categoria-propiedades/` | Filtrado por tipo (?cat=Casas, ?cat=Terrenos, etc.) |
| Sucursales | `/sucursales/` | Sucursales de FIRMA |
| Propiedades | `/propiedades-tokk/` | Listado completo de propiedades Tokko |
| Asesores | `/asesores-inmobiliarios/` | Agentes inmobiliarios |
| Vender | `/vender-mi-propiedad/` | Formulario para vender |
| Contacto | `/contacto/` | Formulario de contacto |
| Login | `#user_login_modal` | Modal de login (HivePress) |
| Submit Listing | `/submit-listing/` | Publicar anuncio (HivePress) |

### 2.1 URLs de ficha.info (propiedades)
Cada propiedad se redirige a ficha.info:
```
https://ficha.info/p/{hash}?v={timestamp}
```

Ejemplo:
```
https://ficha.info/p/95d6ed74993c4a3e9986551af3514b1e?v=1787169233175
```

---

## 3. INTEGRACIÓN TOKKO — ANÁLISIS DETALLADO

### 3.1 Plugin Tokko Manager
- **Nombre**: tokko-manager v4.1
- **Tipo**: Plugin WordPress personalizado
- **Función**: Renderiza shortcodes que obtienen propiedades de Tokko y las muestra como cards
- **Comportamiento**: Las cards enlazan a ficha.info (NO genera páginas internas en WordPress)
- **Imágenes**: Se cargan directamente desde `static.tokkobroker.com/pictures/...`

### 3.2 Cómo funciona la integración actual

```
WordPress (tokko-manager)
    ↓ shortcode
    ↓ renderiza HTML con datos de Tokko
    ↓
    ↓ cards con:
    ↓   - imagen de static.tokkobroker.com
    ↓   - título
    ↓   - dirección
    ↓   - precio
    ↓   - enlace a ficha.info
    ↓
    ↓
ficha.info (aplicación Next.js de Tokko)
    ↓ muestra detalle completo de la propiedad
    ↓ galería, descripción, agente, mapa, etc.
```

### 3.3 Datos que maneja tokko-manager

Propiedades renderizadas en home y /propiedades-tokk/:
- Título (publication_title)
- Dirección (address)
- Precio (operations)
- Imagen principal (front_cover_image)
- Enlace a ficha.info (public_url o construido con hash)

### 3.4 Categorías visibles en home

| Categoría | Cantidad | Imagen |
|---|---|---|
| Casas | 26 | /wp-content/uploads/2026/01/Casa-de-lujo.png |
| Terrenos | 5 | /wp-content/uploads/2021/11/Campo1.png |
| Departamentos | 2 | /wp-content/uploads/2025/11/Terrazas-9-copia.png |
| Complejos | 1 | /wp-content/uploads/2025/12/... |
| Campos | 1 | /wp-content/uploads/2021/11/Campo11.png |
| **Total** | **~35** | |

---

## 4. TOKKO API — DOCUMENTACIÓN OFICIAL

### 4.1 Base URL
```
https://www.tokkobroker.com/api/v1/
```

### 4.2 Autenticación
- **Método**: API Key estática
- **Parámetro**: `key` (no `api_key`, no `token`)
- **Ubicación en panel**: MI EMPRESA → PERMISOS → CLAVE API
- **Seguridad**: NUNCA exponer en frontend, Git, logs, o documentación pública
- **Uso**: Solo server-side (Next.js API routes o Server Components)

### 4.3 Endpoints Principales

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/v1/property/` | GET | Listar propiedades con paginación |
| `/api/v1/property/{id}/` | GET | Obtener una propiedad específica |
| `/api/v1/property/search/` | POST | Buscar propiedades con filtros |
| `/api/v1/development/` | GET | Listar desarrollos inmobiliarios |
| `/api/v1/development/{id}/` | GET | Obtener un desarrollo específico |
| `/api/v1/webcontact/` | POST | Enviar lead/contacto al CRM |
| `/api/v1/contact/` | GET | Consultar contactos |
| `/api/v1/user/` | GET | Consultar usuarios/agentes |
| `/api/v1/location/quicksearch/` | GET | Buscar ubicaciones |

### 4.4 Parámetros Comunes
- `key` — API Key (obligatorio)
- `format` — Siempre `json`
- `limit` — Cantidad por página (default: 20, máx recomendado: 50)
- `offset` — Offset para paginación
- `lang` — Idioma (`es`, `en`, `pt`)

### 4.5 Filtros Disponibles (property/search POST)
Basado en la URL del panel Tokko:
```json
{
  "filters": [["branch__id", "op", "85101"]],
  "only_available": "checked",
  "currency": "USD",
  "operation_types": [],
  "property_types": [],
  "network": ["outer-4"],
  "price_from": "0",
  "price_to": "9999999999"
}
```

### 4.6 Limitaciones Conocidas
- **Sin CORS**: No se puede llamar desde el navegador. Siempre server-side.
- **Rate limiting**: ~1 llamada/segundo recomendada. Usar reintentos con backoff exponencial.
- **Intermitencias**: Errores 500/502/503 ocasionales. Implementar retry (3 intentos, 2s/4s/6s).
- **Timeout**: 20-30 segundos recomendado.

### 4.7 Playground
```
http://www.tokkobroker.com/api/playground
```

---

## 5. TOKKO BRANCH 85101 — VALIDACIÓN

### 5.1 Confirmación
Desde ficha.info, el datos de la propiedad analizada confirma:
```json
"branch": {
  "id": 85101,
  "name": "FIRMA Negocios Inmobiliarios",
  "company": {
    "id": 47477,
    "name": "Firma Negocios Inmobiliarios"
  }
}
```

### 5.2 Datos de la Sucursal
| Campo | Valor |
|---|---|
| Branch ID | 85101 |
| Nombre | FIRMA Negocios Inmobiliarios |
| Company ID | 47477 |
| Company Name | Firma Negocios Inmobiliarios |
| Dirección | Av. Carlos F. Gauss 5500 |
| Teléfono | (351) 6195892 Int. - |
| Teléfono alternativo | (+549) 351 Int. 6195892 |
| Email | ezefsar@gmail.com |
| Horario | (24hs) |
| Logo | https://static.tokkobroker.com/branch_logos/None/Logo_Firma_logo_horizontal-negativo_1.png |

### 5.3 Filtro para Obtener Propiedades
```json
{
  "filters": [["branch__id", "op", "85101"]],
  "only_available": "checked",
  "currency": "USD"
}
```

O el endpoint GET con parámetros (a verificar en playground):
```
/api/v1/property/?key=TU_API_KEY&format=json&limit=50&branch__id=85101
```

---

## 6. RELACIÓN TOKKO ↔ FICHA.INFO — DESCUBRIMIENTO CRÍTICO

### 6.1 Análisis del Hash de ficha.info

URL de ejemplo:
```
https://ficha.info/p/95d6ed74993c4a3e9986551af3514b1e?v=1787169233175
```

**El hash `95d6ed74993c4a3e9986551af3514b1e` NO es el Tokko ID.**

### 6.2 Datos Reales de la Propiedad (extraídos de ficha.info)

| Campo | Valor |
|---|---|
| **Tokko Property ID** | `8512753` |
| **Hash ficha.info** | `95d6ed74993c4a3e9986551af3514b1e` |
| **Version param (v)** | `1787169233175` |
| **Reference** | `FHO8512753` |
| **Branch ID** | `85101` |
| **Company ID** | `47477` |
| **TOKKOBROKER_BASE_URL** | `https://www.tokkobroker.com` |
| **hash** | `95d6ed74993c4a3e9986551af3514b1e` |

### 6.3 Estructura de Datos de ficha.info

La aplicación ficha.info es una **aplicación Next.js** de Tokko que:
- Recibe el hash como parámetro de ruta (`/p/{hash}`)
- Consulta internamente la API de Tokko
- Renderiza la ficha completa de la propiedad

El hash parece ser un **identificador UUID/hash** generado por Tokko, posiblemente un hash del `publication_id` o un identificador único de publicación.

### 6.4 Nota: reference = "FHO8512753"
El prefijo `FHO` podría indicar algo específico (Firma + algo). El número `8512753` coincide con el Tokko Property ID.

### 6.5 Conclusión sobre URLs
- **NO se puede construir la URL de ficha.info** a partir del Tokko ID directamente
- El hash es proporcionado por Tokko en los datos de la propiedad
- Se debe extraer el hash del campo `public_url` o `hash` en la respuesta de la API
- **La nueva web NO debe depender de ficha.info** pero SÍ debe conservar el hash para referencia

---

## 7. MODELO DE DATOS REAL (extraído de ficha.info)

### 7.1 Estructura de Property

```typescript
{
  id: 8512753,                          // Tokko Property ID
  reference: "FHO8512753",              // Referencia interna
  publication_title: "...",             // Título de publicación
  address: "...",                       // Dirección
  fake_address: "...",                  // Dirección alternativa
  description: "...",                   // Descripción HTML
  
  // Operaciones
  operations: {
    Sale: ["USD 60.000"],
    Rent: [],
    TemporaryRent: []
  },
  
  // Tipo
  type: { id: 3, name: "Casa" },
  
  // Estado
  status: { id: 2, name: "Disponible" },
  
  // Ubicación
  location: "San Ignacio | Calamuchita | Cordoba",
  geolocation: { lat: "-32.179626235", lng: "-64.5166367435" },
  
  // Superficies
  measurement: [
    { key: "front_measure", name: "Frente", value: "15 m", original_value: 15 },
    { key: "surface", name: "Terreno", value: "600 m²", original_value: 600 },
    { key: "depth_measure", name: "Fondo", value: "40 m", original_value: 40 },
    { key: "roofed_surface", name: "Superficie cubierta", value: "33 m²", original_value: 33 }
  ],
  
  // Ambientes
  rooms: ["Patio", "Cocina", "Jardín", "Lavadero"],
  
  // Servicios
  services: ["Electricidad", "Encargado", "Gas Envasado", "Internet", ...],
  
  // Tags adicionales
  additional: ["Aire Acondicionado individual", "Amoblado", ...],
  
  // Info básica
  basic_info: [
    { key: "room_amount", name: "Ambiente", value: 1 },
    { key: "bathroom_amount", name: "Baño", value: 1 },
    { key: "suite_amount", name: "Dormitorio", value: 1 },
    { key: "parking_lot_amount", name: "Cochera", value: 1 },
    { key: "age", name: "Antigüedad", value: "2 años" },
    // ...
  ],
  
  // Atributos listados
  attributes_list: [
    { attr: "roofed_surface", value: "33 m² cubierta", icon: "icon-cubierta" },
    { attr: "room_amount", value: "1 ambiente", icon: "icon-ambientes" },
    { attr: "suite_amount", value: "1 dormitorio", icon: "icon-dormitorios" },
    { attr: "bathroom_amount", value: "1 baño", icon: "icon-banos" },
    { attr: "parking_lot_amount", value: "1 cochera", icon: "icon-cochera" },
    { attr: "age", value: "2 años", icon: "icon-reloj" }
  ],
  
  // Imágenes
  pictures: {
    images: ["https://static.tokkobroker.com/pictures/..."],         // ~33 imágenes
    images_social_media: ["https://static.tokkobroker.com/sm_pics/..."], // OG images
    blueprints: [],
    front_cover_image: {
      url: "https://static.tokkobroker.com/pictures/...",
      social_media_url: "https://static.tokkobroker.com/sm_pics/...",
      is_blueprint: false
    }
  },
  
  // Videos
  videos: {
    "360": [],       // Videos 360
    "normal": []     // Videos normales
  },
  
  // Agente principal (produced by)
  producer_user: {
    id: 123805,
    name: "Ezequiel Fernandez",
    mail: "ezefsar@gmail.com",
    phone: " 54 9 3516 19-5892",
    image: ""
  },
  
  // Compañía
  company: {
    id: 47477,
    name: "Firma Negocios Inmobiliarios",
    logo: "https://static.tokkobroker.com/logos/..."
  },
  
  // Branch
  branch: {
    id: 85101,
    name: "FIRMA Negocios Inmobiliarios",
    // ... (ver sección 5.2)
  },
  
  // Agentes asociados
  agents: [
    { id: 117727, name: "FIRMA Negocios Inmobiliarios", phone: "...", email: "...", photo: "..." },
    { id: 123805, name: "Ezequiel Fernandez", ... },
    { id: 125939, name: "Mateo Fernández", ... },
    { id: 127377, name: "Pedro Fernandez", ... },
    { id: 139794, name: "Fausto Pompei", ... },
    { id: 139960, name: "Marcelo Sala Freytes", ... },
    { id: 143903, name: "Yanina Sala", ... },
    { id: 144961, name: "Ignacio Duffau", ... },
    { id: 149833, name: "Sabina Acosta", ... },
    { id: 155356, name: "Ramiro Vitellini", ... },
    { id: 179152, name: "Milagros De Giorgi", ... }
  ],
  
  // Tags (tipos 1=servicio, 2=ambiente, 3=adicional)
  tags: [
    { type: 1, id: 5, name: "Electricidad" },
    { type: 2, id: 12, name: "Cocina" },
    { type: 3, id: 28, name: "Aire Acondicionado individual" },
    // ...
  ],
  
  // Fechas
  created_at: "24-07-2026",
  
  // Flags
  active: true,
  on_web_price: true,
  is_booking_active: false,
  booking_url: "https://ficha.info/calendar/8512753",
  
  // Ficha.info
  edited_ficha: {
    id: 62941048,
    title: "San Javier del Lago, San Ignacio. 0",
    url: "https://ficha.info/p/95d6ed74993c4a3e9986551af3514b1e"
  },
  
  // IDs de ficha
  "hash": "95d6ed74993c4a3e9986551af3514b1e"
}
```

---

## 8. AGENTES DE FIRMA CALAMUCHITA

| ID | Nombre | Email | Teléfono | Foto |
|---|---|---|---|---|
| 117727 | FIRMA Negocios Inmobiliarios | firma.inmob@gmail.com | 54 9 3513 57-0294 | ✅ |
| 123805 | Ezequiel Fernandez | ezefsar@gmail.com | 54 9 3516 19-5892 | ❌ |
| 125939 | Mateo Fernández | mfernandezsarochar@gmail.com | 03518025030 | ❌ |
| 127377 | Pedro Fernandez | pedrofernandezfirma@gmail.com | 549351255884 | ❌ |
| 139794 | Fausto Pompei | faustopompei2000@gmail.com | — | ❌ |
| 139960 | Marcelo Sala Freytes | marcelosalafreytes@gmail.com | 3513245911 | ✅ |
| 143903 | Yanina Sala | ypsalaf@gmail.com | 54 9 3517 03-6115 | ✅ |
| 144961 | Ignacio Duffau | ignacio.duffau@mi.unc.edu.ar | 54 9 3512 36-1807 | ✅ |
| 149833 | Sabina Acosta | sabiacosta94@gmail.com | 3571609655 | ❌ |
| 155356 | Ramiro Vitellini | ramirovitellini@gmail.com | — | ✅ |
| 179152 | Milagros De Giorgi | degiorgimilagros58@gmail.com | — | ❌ |

---

## 9. ANÁLISIS SEO ACTUAL

### 9.1 Metadata
- **Title**: "Firma Calamuchita Negocios Inmobiliarios"
- **Canonical**: `https://firmacalamuchita.com/`
- **Robots**: `max-image-preview:large`
- **Hreflang**: es-ES, es-AR, es

### 9.2 Sitemap
```
https://firmacalamuchita.com/wp-sitemap.xml
```
Contiene:
- `wp-sitemap-posts-page-1.xml` (páginas)
- `wp-sitemap-posts-hp_listing-1.xml` (listings HivePress)
- `wp-sitemap-posts-hp_vendor-1.xml` (vendors)
- `wp-sitemap-taxonomies-hp_listing_category-1.xml` (categorías)
- `wp-sitemap-users-1.xml` (usuarios)

### 9.3 robots.txt
```
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Sitemap: https://firmacalamuchita.com/wp-sitemap.xml
```

### 9.4 JSON-LD / Schema
- No se detectó JSON-LD estructurado en el HTML analizado
- No se detectaron breadcrumbs estructurados

### 9.5 OpenGraph
- Configurado a nivel de WordPress (probablemente por SEO plugin o theme)

### 9.6 Problemas SEO Detectados
1. **Ficha.info como destino**: Las propiedades enlazan a ficha.info, NO a páginas propias. Google indexa ficha.info, no firmacalamuchita.com
2. **Thin content**: Las páginas de propiedades en WordPress son solo contenedores de shortcodes
3. **Sin Schema estructurado**: No hay RealEstateAgent, Offer, Place, etc.
4. **Sin breadcrumbs**: No hay navegación de migas de pan
5. **Urls de ficha.info**: Las URLs indexadas son de ficha.info, no del dominio propio

---

## 10. ANÁLISIS DE PERFORMANCE ACTUAL

### 10.1 Problemas Identificados
1. **Muchos plugins**: ~15+ plugins cargados
2. **CSS excesivo**: Múltiples hojas de estilo de HivePress, Elementor, feeds sociales
3. **jQuery dependency**: HivePress depende de jQuery
4. **Imágenes sin optimización**: Imágenes de static.tokkobroker.com sin lazy loading nativo
5. **Hero con imagen PNG**: Fondo de hero es un PNG de ~500KB+
6. **Fondo de body**: Imagen `forma1.png` como background fijo
7. **Widgets sociales**: TikTok, Facebook, Twitter, Instagram, YouTube feeds cargados
8. **Elementor**: Agrega CSS/JS adicional innecesariamente

### 10.2 WordPress Heartbeat
- Activo (normal en WordPress)

---

## 11. ANÁLISIS DE DISEÑO ACTUAL

### 11.1 Colores en Uso
| Uso | Color | Hex |
|---|---|---|
| Primario (botones, links) | Dorado | `#ce941e` |
| Secundario | Azul oscuro | `#18286e` |
| Texto de enlace hover | Dorado | `#ce941e` |
| Precio | Dorado oscuro | `#b8860b` |
| Títulos | Azul | `#002060` |
| Fondo hero | Imagen | — |
| Loader | Dorado | `#ce941e` |

### 11.2 Colores Oficiales Firma (según prompt)
| Token | Hex |
|---|---|
| --firma-sand | `#CEB88A` |
| --firma-navy | `#272F51` |
| --firma-blue | `#18286E` |
| --firma-white | `#FFFFFF` |

**Nota**: El color actual `#ce941e` difiere del oficial `#CEB88A`. La nueva web debe usar los colores oficiales.

### 11.3 Tipografía Actual
- **Headings**: Poppins (500 weight)
- **Body**: Open Sans (400, 600 weight)
- **Carga**: Google Fonts

### 11.4 Layout
- Header fijo con logo + menú + burger
- Hero con imagen de fondo + copy
- Grid de categorías (cards flex)
- Grid de propiedades (cards con shadow)
- Footer (no analizado en detalle)

---

## 12. MAPEO DEPENDENCIAS

### 12.1 Qué depende de WordPress
| Elemento | Dependencia |
|---|---|
| Home page | WordPress (Elementor + shortcodes) |
| Categorías | WordPress (HivePress categories) |
| Sucursales | WordPress (HivePress vendors) |
| Propiedades | WordPress (tokko-manager shortcode) |
| Asesores | WordPress (HivePress vendors) |
| Vender | WordPress (HivePress form) |
| Contacto | WordPress (form) |
| Login/Registro | WordPress (HivePress auth) |
| CMS de contenido | WordPress |

### 12.2 Qué depende de HivePress
| Elemento | Dependencia |
|---|---|
| Listing post type | HivePress |
| Vendor post type | HivePress |
| Categorías de listings | HivePress |
| Sistema de usuarios | HivePress |
| Mensajes | HivePress Messages |
| Reviews | HivePress Reviews |
| Formularios | HivePress |

### 12.3 Qué depende de Tokko (via tokko-manager)
| Elemento | Dependencia |
|---|---|
| Datos de propiedades | Tokko API |
| Imágenes de propiedades | static.tokkobroker.com |
| Enlaces a ficha.info | Tokko (hash) |
| Precios | Tokko |
| Disponibilidad | Tokko |

### 12.4 Qué depende de ficha.info
| Elemento | Dependencia |
|---|---|
| Detalle de propiedad | ficha.info (Next.js app de Tokko) |
| Galería completa | ficha.info |
| Agente asignado | ficha.info |
| Descripción completa | ficha.info |
| Mapa | ficha.info |
| Contacto | ficha.info |

**CONCLUSIÓN**: El sitio actual **NO tiene páginas propias de detalle de propiedad**. Todo el experience de detalle vive en ficha.info.

---

## 13. PROBLEMAS IDENTIFICADOS

### 13.1 Críticos
1. **Sin páginas propias de propiedad**: Todo redirige a ficha.info
2. **SEO perdido**: Google indexa ficha.info, no el dominio propio
3. **Sin control de UX**: La experiencia de detalle depende completamente de Tokko
4. **Sin branding propio**: La ficha de Tokko no refleja la identidad Firma
5. **URLs frágiles**: Si Tokko cambia ficha.info, se rompen todos los enlaces

### 13.2 Importantes
6. **Dependencia de muchos plugins**: 15+ plugins activos
7. **Performance**: Carga pesada de CSS/JS
8. **Sin Schema estructurado**: No hay datos estructurados para Google
9. **Colores inconsistentes**: El dorado actual difiere del oficial
10. **Sin migración de URLs**: Las URLs indexadas no tienen redirects planificados

### 13.3 Menores
11. **Feeds sociales innecesarios**: TikTok, Facebook, Twitter, YouTube cargados en todas las páginas
12. **Elementor innecesario**: Solo usado en algunas páginas
13. **Login de HivePress**: No se necesita para la nueva web (las propiedades son públicas)

---

## 14. RIESGOS

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Tokko cambia API | Alto | Capa de abstracción (Tokko Adapter) |
| Tokko cambia hashes ficha.info | Alto | Almacenar mapeo hash ↔ tokkoId |
| Pérdida de tráfico SEO | Alto | Migración de URLs con 301s |
| API Key comprometida | Crítico | Solo server-side, .env.local |
| Rate limiting Tokko | Medio | Cache + ISR + revalidation |
| ficha.info cae | Medio | La nueva web no depende de ficha.info |
| Datos incompletos en Tokko | Medio | No inventar datos faltantes |

---

## 15. NUEVA ARQUITECTURA PROPUESTA

### 15.1 Stack
```
Next.js 14+ (App Router)
React 18+
TypeScript
Tailwind CSS
shadcn/ui (selectivamente)
Framer Motion
next/image
```

### 15.2 Estructura de Directorios
```
src/
  app/
    layout.tsx              # Root layout
    page.tsx                # Home
    propiedades/
      page.tsx              # Listado de propiedades
      [slug]/
        page.tsx            # Detalle de propiedad
    localidades/
      page.tsx              # Listado de localidades
      [slug]/
        page.tsx            # Detalle de localidad
    asesores/
      page.tsx              # Listado de asesores
    contacto/
      page.tsx              # Contacto
    vender/
      page.tsx              # Vender propiedad
    api/
      properties/
        route.ts            # API proxy a Tokko
      revalidate/
        route.ts            # Revalidation endpoint
  components/
    layout/
      Header.tsx
      Footer.tsx
      Navigation.tsx
    properties/
      PropertyCard.tsx
      PropertyGrid.tsx
      PropertyGallery.tsx
      PropertyHero.tsx
      PropertyFeatures.tsx
      PropertyAgent.tsx
      PropertyMap.tsx
    home/
      Hero.tsx
      FeaturedProperties.tsx
      CategoryExplorer.tsx
      LocationExplorer.tsx
      CTASection.tsx
    ui/                     # shadcn/ui components
    shared/                 # Shared components
  features/
    properties/
      index.ts
      types.ts
      provider.tsx          # PropertyProvider
      use-properties.ts     # Hook
    media/
      gallery.tsx
      video-player.tsx
      panorama-viewer.tsx
  lib/
    tokko/
      client.ts             # Tokko API client
      adapter.ts            # Tokko → PropertyModel mapper
      types.ts              # Tokko raw types
      cache.ts              # Cache strategy
    seo/
      metadata.ts
      json-ld.ts
      sitemap.ts
    whatsapp/
      message-builder.ts
    utils/
      slug.ts
      format.ts
      hash.ts
  types/
    property.ts             # Internal Property model
    agent.ts
    location.ts
  config/
    site.ts                 # Site configuration
    tokens.ts               # Design tokens
    navigation.ts
```

### 15.3 Tokko Adapter Pattern
```
Component → PropertyProvider → TokkoPropertyProvider → Tokko API
                                        ↓
                                   Cache Layer
                                        ↓
                                   PropertyModel
```

### 15.4 Modelo Property Interno
```typescript
interface Property {
  // Identificadores
  id: string;
  tokkoId: number;
  publicationId?: string;
  fichaId?: string;          // hash de ficha.info
  slug: string;              // slug propio para URLs
  
  // Contenido
  title: string;
  description: string;
  shortDescription?: string;
  
  // Operación
  operation: 'venta' | 'alquiler' | 'alquiler-temporario';
  propertyType: string;      // "Casa", "Terreno", etc.
  
  // Ubicación
  location: {
    address: string;
    city: string;
    neighborhood?: string;
    province: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  
  // Precio
  price: {
    amount: number;
    currency: string;         // "USD", "ARS"
    formatted: string;       // "USD 60.000"
  };
  
  // Características
  features: {
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
    parking?: number;
    surface?: number;         // m² terreno
    roofedSurface?: number;   // m² cubierta
    age?: string;
    frontMeasure?: number;
    depthMeasure?: number;
  };
  
  // Detalles
  roomsList: string[];        // ["Patio", "Cocina", "Jardín"]
  services: string[];         // ["Electricidad", "Wifi", ...]
  additional: string[];       // ["Aire Acondicionado", ...]
  
  // Media
  images: string[];
  coverImage: string;
  ogImage?: string;
  videos: {
    normal: string[];
    panoramic: string[];
  };
  virtualTourUrl?: string;
  
  // Agente
  agent: {
    id: number;
    name: string;
    email: string;
    phone: string;
    photo?: string;
  };
  
  // Compañía
  company: {
    id: number;
    name: string;
    logo: string;
  };
  
  // URLs externas
  externalUrls: {
    ficha?: string;           // https://ficha.info/p/{hash}
    tokko?: string;
    public?: string;
  };
  
  // Estado
  status: string;             // "Disponible", "Vendida", etc.
  isActive: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt?: string;
}
```

---

## 16. ESTRATEGIA DE URLs NUEVAS

### 16.1 Estructura
```
/                                    → Home
/propiedades                         → Listado
/propiedades/{slug}                  → Detalle
/localidades                         → Localidades
/localidades/{slug}                  → Detalle localidad
/asesores                            → Agentes
/contacto                            → Contacto
/vender                              → Vender
```

### 16.2 Generación de Slugs
```typescript
function generateSlug(title: string, city: string): string {
  // "Casa 2 dormitorios, villa rumipal." → "casa-2-dormitorios-villa-rumipal"
  return `${slugify(title)}-${slugify(city)}`.slice(0, 80);
}
```

### 16.3 Mapeo de URLs
```typescript
// Cada propiedad almacena:
{
  slug: "casa-2-dormitorios-villa-rumipal",
  tokkoId: 8651306,
  fichaId: "f4dc7a275ea84d44bd2ec74c76fbd240",
  externalUrls: {
    ficha: "https://ficha.info/p/f4dc7a275ea84d44bd2ec74c76fbd240?v=...",
  }
}
```

### 16.4 Redirects
```typescript
// next.config.js
async redirects() {
  return [
    // Redirigir URLs viejas de ficha.info si es necesario
    {
      source: '/ficha/:path*',
      destination: 'https://ficha.info/p/:path*',
      permanent: false, // temporal, hasta confirmar migración
    },
  ];
}
```

---

## 17. ESTRATEGIA DE CACHE

### 17.1 Niveles de Cache
```
Tokko API
    ↓
ISR (Incremental Static Regeneration)
    ↓ revalidation: 3600 (1 hora)
    ↓
Next.js Cache
    ↓
CDN (Vercel/Cloudflare)
    ↓
Usuario
```

### 17.2 Configuración
```typescript
// Listado: revalidar cada hora
export const revalidate = 3600;

// Detalle: revalidar cada 30 minutos
export const revalidate = 1800;

// Categorías/Localidades: revalidar cada 6 horas
export const revalidate = 21600;
```

### 17.3 Cache Tags
```typescript
// Para revalidation selectiva
revalidateTag('properties');
revalidateTag('property-8512753');
revalidateTag('agents');
```

### 17.4 Fallback Strategy
```typescript
// Si Tokko falla, usar cache
if (error) {
  const cached = await cache.get(`property:${tokkoId}`);
  if (cached) return cached;
  // No inventar datos
  return null;
}
```

---

## 18. ESTRATEGIA MULTIMEDIA

### 18.1 Imágenes
- **Fuente**: `static.tokkobroker.com/pictures/...`
- **Optimización**: `next/image` con remotePatterns
- **Lazy loading**: Nativo de next/image
- **Responsive**: Srcset automático
- **Formato**: WebP/AVIF automático

### 18.2 Videos
- **Fuente**: Tokko (campo `videos.normal[]`)
- **Player**: Video HTML5 con controles custom
- **Lazy loading**: Poster image + intersection observer
- **Formato**: MP4

### 18.3 360 Real
- **Cuando existe**: Viewer panorama (Pannellum o similar)
- **Cuando NO existe**: NO afirmar que es 360
- **Detección**: Verificar `videos["360"]` en datos de Tokko

### 18.4 Recorrido Visual
- **Concepto**: Secuencia de imágenes con animaciones (pan, zoom, parallax)
- **Nombre**: "Recorrido visual" (NO "360")
- **Implementación**: Framer Motion + secuencia de imágenes

### 18.5 Video Automático
- **Pipeline**: Property → Images → Storyboard → Template → Renderer → MP4
- **Ejecución**: Job async, NO durante visita
- **Storage**: CDN o almacenamiento propio

---

## 19. HYPERFRAMES

### 19.1 Estado
- Skill disponible: `hyperframes`
- Propósito: Composición y render de videos
- Uso: Property reels, videos para redes sociales

### 19.2 Uso Previsto
- Generar videos a partir de propiedades
- Templates 16:9 y 9:16
- Integración con pipeline de video automático

### 19.3 Limitaciones
- NO usar como framework principal del sitio
- Solo para generación de contenido multimedia

---

## 20. WHATSAPP

### 20.1 Formato de Mensaje
```
Hola, vi la propiedad {TITLE} en Firma Calamuchita y quisiera recibir información.
{PROPERTY_URL}
```

### 20.2 URL de WhatsApp
```
https://wa.me/{PHONE}?text={ENCODED_MESSAGE}
```

### 20.3 Implementación
- Cada propiedad tiene CTA "Consultar por WhatsApp"
- En mobile: barra sticky inferior
- Botón visible en todas las páginas de propiedad

---

## 21. DISEÑO PROPUESTO

### 21.1 Design Tokens
```css
:root {
  --firma-sand: #CEB88A;
  --firma-navy: #272F51;
  --firma-blue: #18286E;
  --firma-white: #FFFFFF;
  
  --firma-sand-light: #D4C4A0;
  --firma-sand-dark: #B8A070;
  --firma-navy-light: #3A4268;
  --firma-blue-light: #2A3A8A;
  
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### 21.2 Principios Visuales
- Minimalista y elegante
- Fotografía como protagonista
- Mucho espacio negativo
- Tipografía elegante y legible
- Animaciones sutiles (Framer Motion)
- Nada de exceso de tarjetas, sombras o gradientes
- Mobile-first

### 21.3 Home Sections
1. Hero (video/imagen + copy narrativo)
2. Propiedades destacadas
3. Explorar por tipo
4. Explorar por localidad
5. Firma Calamuchita (sobre nosotros)
6. Vender propiedad
7. CTA final
8. Footer

---

## 22. DECISIONES QUE NECESITAN APROBACIÓN

### 22.1 API Key de Tokko
- **Necesario**: Obtener la API Key de Tokko desde el panel
- **Acción**: Ir a MI EMPRESA → PERMISOS → CLAVE API
- **Uso**: Solo server-side, nunca en frontend

### 22.2 Hosting/Nube
- **Opción A**: Vercel (recomendado para Next.js)
- **Opción B**: AWS (más control, más complejidad)
- **Opción C**: Hostinger (actual, pero limitado para Next.js)

### 22.3 Dominio
- **Mantener**: firmacalamuchita.com
- **DNS**: No cambiar hasta QA completo
- **SSL**: Mantener actual

### 22.4 Base de Datos Local
- **Opción A**: Solo cache (Redis/SQLite) — recomendado
- **Opción B**: PostgreSQL para datos adicionales
- **Recomendación**: NO crear segunda base inmobiliaria

### 22.5 Ficha.info
- **Estrategia**: Mantener compatibilidad temporal
- **Redirección**: Preparar redirects de URLs viejas
- **Largo plazo**: La nueva web reemplaza ficha.info

### 22.6 Autenticación
- **Actual**: HivePress login (usuarios/agentes)
- **Nuevo**: ¿Mantener login de agentes? ¿Para qué?
- **Recomendación**: No implementar login innecesariamente

---

## 23. PLAN DE IMPLEMENTACIÓN

### FASE 1: Setup Inicial
- [ ] Inicializar proyecto Next.js
- [ ] Configurar TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar design tokens
- [ ] Configurar estructura de carpetas

### FASE 2: Tokko Integration
- [ ] Crear Tokko Adapter
- [ ] Crear Property Model
- [ ] Implementar cache strategy
- [ ] Probar con API Key real
- [ ] Validar Branch 85101

### FASE 3: Core Pages
- [ ] Home page
- [ ] Property listing
- [ ] Property detail
- [ ] Agents page
- [ ] Contact page

### FASE 4: Components
- [ ] Header/Footer/Navigation
- [ ] Property Card
- [ ] Property Gallery
- [ ] Property Features
- [ ] WhatsApp CTA
- [ ] Filters

### FASE 5: SEO
- [ ] Metadata
- [ ] JSON-LD
- [ ] Sitemap
- [ ] robots.txt
- [ ] OpenGraph

### FASE 6: Performance
- [ ] Image optimization
- [ ] Lazy loading
- [ ] ISR configuration
- [ ] Cache headers

### FASE 7: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

### FASE 8: Deployment
- [ ] Staging environment
- [ ] QA completo
- [ ] SEO audit
- [ ] Redirects
- [ ] Production deployment

---

## 24. CRITERIO DE ÉXITO

1. ✅ La nueva web NO depende de WordPress
2. ✅ NO depende de HivePress
3. ✅ Tokko sigue siendo la fuente de verdad
4. ✅ Branch 85101 es respetado
5. ✅ Las propiedades aparecen automáticamente
6. ✅ Los datos se actualizan (ISR/revalidation)
7. ✅ Las URLs propias funcionan (/propiedades/{slug})
8. ✅ La relación con ficha.info no se rompe (compatibilidad)
9. ✅ Las imágenes tienen excelente presentación
10. ✅ Los videos funcionen cuando existan
11. ✅ Los recorridos visuales funcionen
12. ✅ Los 360 reales funcionen cuando existan
13. ✅ HyperFrames permite generar videos
14. ✅ La web es mobile-first
15. ✅ El SEO es correcto (Schema, metadata, sitemap)
16. ✅ El rendimiento es alto (Lighthouse 90+)
17. ✅ WhatsApp funciona
18. ✅ No existen API keys expuestas
19. ✅ Los tests pasan
20. ✅ La migración puede hacerse sin perder tráfico

---

## 25. TABLA DE VALIDACIÓN TOKKO (Pendiente de API Key)

> **NOTA**: Esta tabla se completará cuando se obtenga la API Key y se pueda consultar la API directamente.

| # | Property Title | Tokko ID | Branch ID | Publication ID | Ficha ID | Operation | Type | Price | Currency | Location | Available |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Domo en San Ignacio Calamuchita | 8512753 | 85101 | — | 95d6ed74... | Venta | Casa | 60.000 | USD | San Ignacio | ✅ |
| 2 | Casa 2 dormitorios, villa rumipal | — | 85101 | — | f4dc7a27... | Venta | Casa | 105.000 | USD | Villa Rumipal | ✅ |
| 3 | CASA 5 AMBIENTES VILLA DEL DIQUE | — | 85101 | — | 3445bb15... | Venta | Casa | 130.000 | USD | Villa del Dique | ✅ |
| 4 | Casa 2 dormitorios con vista al lago | — | 85101 | — | c33d3d79... | Venta | Casa | 169.000 | USD | Villa Rumipal | ✅ |
| 5 | VILLA RUMIPAL 200M DEL LAGO | — | 85101 | — | 61128cbd... | Venta | Casa | 178.000 | USD | Villa Rumipal | ✅ |
| 6 | Complejo de Cabañas Villa Rumipal | — | 85101 | — | ae611e1c... | Venta | Complejo | 160.000 | USD | Villa Rumipal | ✅ |
| 7 | Terreno 565 m² Villa Rumipal | — | 85101 | — | ad6be8ae... | Venta | Terreno | 30.000 | USD | Villa Rumipal | ✅ |
| 8 | LOTE 570 M2 VILLA RUMIPAL | — | 85101 | — | f9acc9d5... | Venta | Terreno | — | USD | Villa Rumipal | ✅ |

> **Completar con API Key**: Se necesitan al menos 20 propiedades con todos los campos.

---

## 26. CONCLUSIÓN

El sitio actual de Firma Calamuchita es funcional pero tiene dependencias críticas de WordPress, HivePress y ficha.info que limitan el control sobre la experiencia de usuario y SEO. La nueva plataforma Next.js permitirá:

1. **Control total** sobre la experiencia de usuario
2. **SEO propio** con páginas indexadas en firmacalamuchita.com
3. **Performance superior** con SSR/ISR y optimización moderna
4. **Identidad de marca** consistente con los colores y estilo Firma
5. **Mantenibilidad** con código TypeScript moderno y testing
6. **Escalabilidad** para futuras funcionalidades (video, 360, etc.)

**PRÓXIMO PASO**: Obtener la API Key de Tokko para validar la integración y completar la tabla de propiedades.

---

*Documento generado el 20 de Agosto de 2026*
*Fase: Auditoría Completa*
*Estado: PENDIENTE DECISIONES*
