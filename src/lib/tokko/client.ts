// Tokko Client — HTTP layer for Tokko Broker API
// Responsibilities: authentication, HTTP, endpoints, timeout, errors, parsing, pagination.
// Does NOT map properties — that's the mapper's job.

// ============================================================
// TYPES — Raw Tokko API response shapes (subset we use)
// ============================================================

export interface TokkoPrice {
  currency: string;
  is_promotional: boolean;
  period: number;
  price: number;
}

export interface TokkoOperation {
  operation_id: number;
  operation_type: string;
  prices: TokkoPrice[];
}

export interface TokkoPhoto {
  description: string | null;
  image: string;
  is_blueprint: boolean;
  is_front_cover: boolean;
  order: number;
  original: string;
  social_media_url: string;
  thumb: string;
}

export interface TokkoVideo {
  id: number;
  description?: string;
  order?: number;
  player_url?: string;
  provider?: string;
  provider_id?: number;
  title?: string;
  url?: string;
  video_id?: string;
  [key: string]: unknown;
}

export interface TokkoAgent {
  cellphone?: string;
  email?: string;
  id: number;
  name: string;
  phone?: string;
  picture?: string;
  position?: string;
}

export interface TokkoBranch {
  address?: string;
  alternative_phone?: string;
  alternative_phone_area?: string;
  alternative_phone_country_code?: string;
  alternative_phone_extension?: string;
  branch_type?: string;
  contact_time?: string;
  created_date?: string;
  display_name?: string;
  email?: string;
  geo_lat?: string;
  geo_long?: string;
  gm_location_type?: string;
  id: number;
  is_default?: boolean;
  logo?: string;
  name?: string;
  pdf_footer_text?: string;
  phone?: string;
  phone_area?: string;
  phone_country_code?: string;
  phone_extension?: string;
  use_pdf_footer?: boolean;
}

export interface TokkoLocation {
  divisions?: unknown[];
  full_location?: string;
  id?: number;
  name?: string;
  parent_division?: string;
  short_location?: string;
  state?: unknown;
  weight?: number;
  zip_code?: null;
}

export interface TokkoPropertyType {
  code?: string;
  id?: number;
  name?: string;
}

export interface TokkoProperty {
  id: number;
  address?: string;
  address_complement?: string;
  age?: number;
  apartment_door?: string;
  appartments_per_floor?: number;
  bathroom_amount?: number;
  block_number?: string;
  branch?: TokkoBranch;
  building?: string;
  cleaning_tax?: string;
  common_area?: string;
  covered_parking_lot?: number;
  created_at?: string;
  credit_eligible?: string;
  custom1?: string;
  custom_tags?: unknown[];
  deleted_at?: string;
  depth_measure?: string;
  description?: string;
  development?: unknown;
  development_excel_extra_data?: string;
  dining_room?: number;
  disposition?: unknown;
  down_payment?: string;
  expenses?: number;
  extra_attributes?: unknown[];
  fake_address?: string;
  files?: unknown[];
  fire_insurance_cost?: string;
  floor?: string;
  floors_amount?: number;
  front_measure?: string;
  geo_lat?: string;
  geo_long?: string;
  gm_location_type?: string;
  guests_amount?: number;
  has_temporary_rent?: boolean;
  internal_data?: Record<string, unknown>;
  iptu?: number;
  iptu_type?: string;
  is_denounced?: boolean;
  is_starred_on_web?: boolean;
  legally_checked?: string;
  livable_area?: string;
  living_amount?: number;
  location?: TokkoLocation;
  location_level?: unknown;
  lot_number?: string;
  occupation?: unknown[];
  operations?: TokkoOperation[];
  orientation?: unknown;
  parking_lot_amount?: number;
  parking_lot_condition?: unknown;
  parking_lot_type?: unknown;
  photos?: TokkoPhoto[];
  portal_footer?: string;
  private_area?: string;
  producer?: TokkoAgent;
  property_condition?: string;
  public_url?: string;
  publication_title?: string;
  quality_level?: unknown;
  real_address?: string;
  reference_code?: string;
  rich_description?: string;
  roofed_surface?: string;
  room_amount?: number;
  semiroofed_surface?: string;
  seo_description?: string;
  seo_keywords?: string;
  situation?: string;
  status?: number;
  suite_amount?: number;
  suites_with_closets?: number;
  surface?: string;
  surface_measurement?: string;
  tags?: unknown[];
  toilet_amount?: number;
  total_area?: string;
  total_suites?: number;
  total_surface?: string;
  transaction_requirements?: string;
  tv_rooms?: number;
  type?: TokkoPropertyType;
  uncovered_parking_lot?: number;
  unroofed_surface?: string;
  videos?: TokkoVideo[];
  updated_at?: string;
  web_price?: boolean;
  zonification?: string;
}

export interface TokkoMeta {
  limit?: number;
  next?: string | null;
  offset?: number;
  total_count?: number;
}

export interface TokkoListResponse {
  meta: TokkoMeta;
  objects: TokkoProperty[];
}

// ============================================================
// CLIENT CONFIGURATION
// ============================================================

export interface TokkoClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

// ============================================================
// CLIENT ERRORS
// ============================================================

export class TokkoApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string,
  ) {
    super(message);
    this.name = "TokkoApiError";
  }
}

export class TokkoNetworkError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = "TokkoNetworkError";
  }
}

export class TokkoTimeoutError extends Error {
  constructor(public endpoint: string) {
    super(`Tokko API timeout: ${endpoint}`);
    this.name = "TokkoTimeoutError";
  }
}

// ============================================================
// CLIENT IMPLEMENTATION
// ============================================================

const DEFAULT_BASE_URL = "https://www.tokkobroker.com/api/v1";
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_MAX_RETRIES = 3;

// Status codes that should trigger a retry
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

// Status codes that should NOT trigger a retry
const NON_RETRYABLE_STATUS_CODES = new Set([400, 401, 403, 404]);

export class TokkoClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(config: TokkoClientConfig) {
    if (!config.apiKey) {
      throw new Error("Tokko API key is required");
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  /**
   * Fetch a list of properties with pagination.
   * Does NOT filter by branch — caller must do that.
   */
  async getProperties(
    limit = 50,
    offset = 0,
  ): Promise<TokkoListResponse> {
    const endpoint = `${this.baseUrl}/property/?format=json&limit=${limit}&offset=${offset}`;
    return this.request<TokkoListResponse>(endpoint);
  }

  /**
   * Fetch all properties by paginating through the entire dataset.
   * Returns the full array of properties (no branch filtering).
   */
  async getAllProperties(): Promise<TokkoProperty[]> {
    const allProperties: TokkoProperty[] = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getProperties(limit, offset);
      allProperties.push(...response.objects);

      if (response.meta.next === null || response.objects.length === 0) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    return allProperties;
  }

  /**
   * Make an HTTP request with timeout, retries, and error handling.
   */
  private async request<T>(endpoint: string, retries = 0): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = new URL(endpoint);
      url.searchParams.set("key", this.apiKey);

      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Don't retry on client errors (except 429)
        if (
          NON_RETRYABLE_STATUS_CODES.has(response.status) &&
          response.status !== 429
        ) {
          throw new TokkoApiError(
            `Tokko API error: ${response.status} ${response.statusText}`,
            response.status,
            endpoint,
          );
        }

        // Retry on retryable status codes
        if (
          RETRYABLE_STATUS_CODES.has(response.status) &&
          retries < this.maxRetries
        ) {
          const delay = this.calculateBackoff(retries);
          await this.sleep(delay);
          return this.request<T>(endpoint, retries + 1);
        }

        throw new TokkoApiError(
          `Tokko API error: ${response.status} ${response.statusText}`,
          response.status,
          endpoint,
        );
      }

      const data: unknown = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof TokkoApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        if (retries < this.maxRetries) {
          const delay = this.calculateBackoff(retries);
          await this.sleep(delay);
          return this.request<T>(endpoint, retries + 1);
        }
        throw new TokkoTimeoutError(endpoint);
      }

      if (retries < this.maxRetries) {
        const delay = this.calculateBackoff(retries);
        await this.sleep(delay);
        return this.request<T>(endpoint, retries + 1);
      }

      throw new TokkoNetworkError(
        `Network error: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error : undefined,
      );
    }
  }

  /**
   * Exponential backoff with jitter.
   */
  private calculateBackoff(retryCount: number): number {
    const base = 1000 * Math.pow(2, retryCount);
    const jitter = Math.random() * 1000;
    return base + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
