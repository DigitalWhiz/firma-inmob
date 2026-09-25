# Property Model Documentation

## Architecture

```
Tokko API
   ↓
TokkoClient (HTTP, auth, pagination, retries)
   ↓
TokkoPropertyProvider (branch filtering, caching, queries)
   ↓
TokkoMapper (pure transformation)
   ↓
Property Domain Model
   ↓
Application / UI
```

**Rule**: No component should call Tokko API directly. Always go through the provider.

## Files

| File | Purpose |
|------|---------|
| `src/types/property.ts` | Domain model, enums, unions |
| `src/lib/tokko/client.ts` | HTTP layer, auth, error handling |
| `src/lib/tokko/mapper.ts` | Pure transformation Tokko → Property |
| `src/lib/tokko/provider.ts` | High-level interface, branch filtering, caching |
| `src/lib/tokko/index.ts` | Barrel export |

## Field Mapping — Tokko → Internal

### Identity

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `id` | `Property.id` | Direct (number) |
| `reference_code` | `Property.referenceCode` | Direct (string) |
| `publication_title` | `Property.slug` | `generatePropertySlug(title)` |

### Listing

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `publication_title` | `Property.title` | Direct (fallback: "Propiedad {id}") |
| `description` | `Property.description` | Trim whitespace |
| `type.name` | `Property.type` | `TOKKO_TYPE_MAP[name] ?? "other"` |
| `operations[0].operation_type` | `Property.operation` | `TOKKO_OPERATION_MAP[type] ?? "other"` |
| `status` | `Property.status` | `TOKKO_STATUS_MAP[status] ?? "unavailable"` |

### Pricing

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `operations[].operation_type` | `PropertyPrice.operation` | Mapped per operation |
| `operations[].prices[].price` | `PropertyPrice.amount` | Direct (number) |
| `operations[].prices[].currency` | `PropertyPrice.currency` | Direct (string) |
| `operations[].prices[].is_promotional` | `PropertyPrice.isPromotional` | Direct (boolean) |

**Decision**: All prices from all operations are flattened into `Property.prices[]`. No information is lost.

### Location

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `location.full_location` | `PropertyLocation.fullLocation` | Direct |
| `location.full_location` | `PropertyLocation.country` | Parse first part of `\|`-delimited string |
| `location.full_location` | `PropertyLocation.province` | Parse second part |
| `location.full_location` | `PropertyLocation.city` | Parse third part |
| `location.full_location` | `PropertyLocation.neighborhood` | Parse fourth part |
| `geo_lat` | `PropertyLocation.latitude` | `parseFloat()` |
| `geo_long` | `PropertyLocation.longitude` | `parseFloat()` |
| `address` | `PropertyLocation.address` | Direct |

### Features

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `suite_amount` | `PropertyFeatures.bedrooms` | Direct |
| `total_suites` | `PropertyFeatures.bedrooms` | Fallback |
| `bathroom_amount` | `PropertyFeatures.bathrooms` | Direct |
| `suite_amount` | `PropertyFeatures.suites` | Direct |
| `toilet_amount` | `PropertyFeatures.halfBaths` | Direct |
| `room_amount` | `PropertyFeatures.rooms` | Direct |
| `living_amount` | `PropertyFeatures.livingRooms` | Direct |
| `dining_room` | `PropertyFeatures.diningRooms` | Direct |
| `tv_rooms` | `PropertyFeatures.tvRooms` | Direct |
| `parking_lot_amount` | `PropertyFeatures.parking` | Direct |
| `covered_parking_lot` | `PropertyFeatures.coveredParking` | Direct |
| `uncovered_parking_lot` | `PropertyFeatures.uncoveredParking` | Direct |
| `roofed_surface` | `PropertyFeatures.coveredArea` | `parseFloat()` |
| `total_area` | `PropertyFeatures.totalArea` | `parseFloat()` |
| `surface` | `PropertyFeatures.landArea` | `parseFloat()` |
| `floors_amount` | `PropertyFeatures.floors` | Direct |

### Media

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `photos[].image` | `PropertyImage.imageUrl` | Direct |
| `photos[].thumb` | `PropertyImage.thumbnailUrl` | Direct |
| `photos[].original` | `PropertyImage.originalUrl` | Direct |
| `photos[].social_media_url` | `PropertyImage.ogUrl` | Direct |
| `photos[].description` | `PropertyImage.alt` | Direct |
| `photos[].order` | `PropertyImage.order` | Direct (sorted) |
| `photos[].is_front_cover` | `PropertyImage.isFrontCover` | Direct |
| `photos[].is_blueprint` | `PropertyImage.isBlueprint` | Direct |
| `videos[]` | `PropertyVideo[]` | Empty (no video data in Branch 85101) |
| — | `PropertyPanorama[]` | Empty (no 360 data detected) |

### Agent

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `producer.id` | `PropertyAgent.id` | Direct |
| `producer.name` | `PropertyAgent.name` | Direct |
| `producer.email` | `PropertyAgent.email` | Direct |
| `producer.phone` | `PropertyAgent.phone` | Direct |
| `producer.cellphone` | `PropertyAgent.cellphone` | Direct |
| `producer.picture` | `PropertyAgent.photoUrl` | Direct |
| `producer.position` | `PropertyAgent.position` | Direct |

### External URLs

| Tokko Field | Internal Field | Transformation |
|-------------|----------------|----------------|
| `public_url` | `PropertyUrls.fichaUrl` | Direct |
| `public_url` | `PropertyUrls.fichaHash` | Extract hash from URL |
| `publication_title` | `PropertyUrls.canonical` | `/propiedades/{slug}` |
| `id` | `PropertyUrls.tokkoId` | Direct |

## Status Decisions

1. **`status` field** is the source of truth for availability.
2. **`deleted_at` does NOT indicate deletion** — all 128 properties have it set.
3. **Status 2 = Available** is documented but not assumed to be the only available status.
4. Unknown statuses default to `"unavailable"`.

## Branch Filtering

- **Server-side filtering does NOT work** — `branch_id` and `branch__id` URL parameters return HTTP 400.
- **All 128 properties are fetched**, then filtered client-side by `branch.id === 85101`.
- **Branch ID is configured server-side** via `TOKKO_BRANCH_ID` environment variable.
- **The frontend cannot change the branch** — it's a server-side configuration.

## Type Safety

- Unknown Tokko types map to `"other"` — the app does NOT break.
- Unknown operation types map to `"other"` — the app does NOT break.
- Unknown statuses map to `"unavailable"` — the app does NOT break.
- Missing optional fields use `undefined` — the app does NOT break.

## Test Coverage

| Test | Description |
|------|-------------|
| `golden.test.ts` | Validates mapper against real Tokko property (ID 6871387) |
| `mapper.test.ts` | Unit tests for all mapping functions |
| `batch.test.ts` | Validates all 36 Branch 85101 properties |

## Future Considerations

1. **Video structure** — Currently empty. Refine when real video data is encountered.
2. **360 panoramas** — No data detected. Model supports it, but not implemented.
3. **Slug stability** — If Tokko title changes, slug changes. Redirect strategy needed.
4. **Cache invalidation** — Currently time-based (30min). Could add webhook-based.
