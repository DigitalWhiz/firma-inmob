# Tokko API Validation Report

## Credentials
- **API Key**: [REDACTED — stored in .env.local]
- **Company ID**: 47477
- **Branch ID**: 85101

## Endpoint
```
GET https://www.tokkobroker.com/api/v1/property/
```

## Authentication
- Parameter: `key` (NOT `api_key`, NOT `token`)
- Format: `format=json`
- Always server-side (no CORS)

## Pagination
- `limit`: results per page (default 20, tested up to 50)
- `offset`: starting position
- `meta.total_count`: total properties available
- `meta.next`: URL for next page (null when no more)
- Rate limit: ~1 request/second recommended

## Filtering
- **`branch_id` parameter**: Returns 400 Bad Request — NOT supported as URL parameter
- **`branch__id` parameter**: Also returns 400 Bad Request
- **Server-side filtering**: NOT available via URL parameters
- **Client-side filtering**: Required — download all properties, filter by `branch.id === 85101`

## Total Properties
- **API total**: 128 properties (all branches)
- **Branch 85101 (Ezequiel)**: 36 properties
- **All properties have status = 2** (Available)
- **All properties have `deleted_at` field set** — this does NOT mean deletion; all properties are live

## Branch Distribution
| Branch ID | Name | Properties |
|-----------|------|------------|
| 85101 | Ezequiel | 36 |
| 75931 | Firma Negocios Inmobiliarios | 32 |
| 103861 | Sucursal Yanina | 14 |
| 103898 | Sucursal FIRMA COFICO | 13 |
| 85969 | Pedrito | 9 |
| 84950 | Mateo | 7 |
| 101570 | Duffau | 7 |
| 94570 | Fausto Pompei | 5 |
| 94211 | Ramiro Vitellini | 3 |
| N/A | N/A | 2 |

## Available Fields (90 total)
Key fields for Firma Calamuchita:

### Identity
- `id` (number): Tokko property ID
- `reference_code` (string): e.g., "FHL6871387"
- `publication_title` (string): Display title

### Property
- `type` (object): `{id, name, code}` — e.g., House, Land, Apartment
- `status` (number): 2 = Available
- `description` (string): Plain text description
- `rich_description` (string): HTML description
- `property_condition` (string): e.g., "Excellent"
- `age` (number): Years since construction

### Location
- `address` (string): Street address
- `real_address` (string): Real/alternative address
- `fake_address` (string): Display address
- `location` (object): `{id, name, full_location, short_location, state, divisions}`
- `geo_lat` (string): Latitude
- `geo_long` (string): Longitude

### Measurements
- `surface` (string): Total surface in m²
- `roofed_surface` (string): Covered surface in m²
- `front_measure` (string): Front measurement
- `depth_measure` (string): Depth measurement
- `surface_measurement` (string): Unit (e.g., "M2")

### Rooms
- `room_amount` (number): Total rooms
- `suite_amount` (number): Bedrooms
- `total_suites` (number): Total bedrooms
- `bathroom_amount` (number): Bathrooms
- `toilet_amount` (number): Half baths
- `dining_room` (number): Dining rooms
- `living_amount` (number): Living rooms
- `tv_rooms` (number): TV rooms

### Parking
- `covered_parking_lot` (number): Covered parking
- `uncovered_parking_lot` (number): Uncovered parking
- `parking_lot_amount` (number): Total parking

### Operations
- `operations` (array): Each item has:
  - `operation_id` (number)
  - `operation_type` (string): "Sale", "Rent", "TemporaryRent"
  - `prices` (array): Each item has:
    - `currency` (string): "USD", "ARS"
    - `price` (number): Amount
    - `is_promotional` (boolean)
    - `period` (number)

### Media
- `photos` (array): Each item has:
  - `image` (string): Standard URL
  - `original` (string): High-res URL
  - `thumb` (string): Thumbnail URL
  - `social_media_url` (string): OG image URL
  - `is_front_cover` (boolean)
  - `is_blueprint` (boolean)
  - `order` (number)
  - `description` (string|null)
- `videos` (array): Currently empty for Branch 85101
- `files` (array): Attached files

### Agent
- `producer` (object): `{id, name, email, cellphone, phone, picture, position}`

### Branch
- `branch` (object): `{id, name, display_name, address, phone, email, logo, ...}`

### SEO
- `public_url` (string): Ficha.info URL
- `seo_description` (string): SEO meta description
- `seo_keywords` (string): SEO keywords
- `web_price` (boolean): Show price on web
- `is_starred_on_web` (boolean): Featured on web

### Tags
- `tags` (array): Each item has `{id, name, type}` — type 1=service, 2=room, 3=feature

## Media Fields
- **Images**: `photos[].image`, `photos[].original`, `photos[].thumb`, `photos[].social_media_url`
- **Videos**: `videos[]` (empty for Branch 85101)
- **Blueprints**: `photos[].is_blueprint === true`

## Agent Fields
- `producer.id`, `producer.name`, `producer.email`, `producer.cellphone`, `producer.phone`, `producer.picture`

## URL Fields
- `public_url`: Contains ficha.info URL (e.g., `https://ficha.info/p/eCZIZdGm1ojP9a`)
- Hash extracted from: `public_url.match(/\/p\/([a-zA-Z0-9]+)/)`

## Ficha.info Findings
- **`public_url`** field exists on ALL 36 properties
- **Format**: `https://ficha.info/p/{hash}` (no `?v=` parameter in API response)
- **Hash**: alphanumeric string (e.g., `eCZIZdGm1ojP9a`)
- **No `hash` field**: The hash must be extracted from `public_url`
- **ficha.info is a Next.js app** that renders property details using this hash

## Errors Encountered
- `branch_id` and `branch__id` URL parameters return HTTP 400
- All filtering must be done client-side after downloading all properties

## Recommendations
1. **Download all 128 properties** on each sync (or use `fields` parameter for lighter responses)
2. **Filter client-side** by `branch.id === 85101`
3. **Cache responses** with ISR (revalidate every 30-60 minutes)
4. **Extract hash** from `public_url` for ficha.info compatibility
5. **Monitor rate limits** — 1 request/second with backoff on 429
6. **Use `deleted_at` cautiously** — it does NOT indicate actual deletion
7. **Store `reference_code`** for internal tracking (format: FHL{tokkoId})
