/**
 * Shared TypeScript types for PropFlow
 */

// --- Enums ---

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VALUER = 'VALUER',
  ADMIN = 'ADMIN',
}

export enum PropertyStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FOLLOW_UP = 'FOLLOW_UP',
  VALUED = 'VALUED',
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  VILLA = 'VILLA',
  COMMERCIAL = 'COMMERCIAL',
  LAND = 'LAND',
}

export enum PhotoType {
  EXTERIOR = 'EXTERIOR',
  INTERIOR = 'INTERIOR',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export enum QCStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// --- Auth Types ---

export interface Token {
  access_token: string;
  token_type: string;
}

export interface TokenPayload {
  sub?: string;
}

// --- User Types ---

export interface UserBase {
  phone: string;
  email?: string;
  name?: string;
  role: UserRole;
  is_active: boolean;
}

export interface User extends UserBase {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// --- Photo Types ---

export interface PropertyPhotoBase {
  photo_type: PhotoType;
  sequence: number;
  captured_at?: string;
  gps_lat?: number;
  gps_lng?: number;
  device_model?: string;
}

export interface PropertyPhoto extends PropertyPhotoBase {
  id: string;
  property_id: string;
  s3_key: string;
  s3_url: string;
  qc_status: QCStatus;
  qc_notes?: string;
  created_at: string;
}

// --- Property Types ---

export interface PropertyBase {
  property_type: PropertyType;
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  area_sqft: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  total_floors?: number;
  age?: number;
  description?: string;
}

export interface Property extends PropertyBase {
  id: string;
  user_id: string;
  status: PropertyStatus;
  submitted_at?: string;
  reviewed_at?: string;
  estimated_value?: number;
  valuer_notes?: string;
  valuer_id?: string;
  created_at: string;
  updated_at?: string;
  photos: PropertyPhoto[];
}

// --- Comparable Types ---

export interface ComparableBase {
  address: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  area_sqft: number;
  sale_price: number;
  sale_date: string;
  distance_km?: number;
  source_url?: string;
  description?: string;
}

export interface Comparable extends ComparableBase {
  id: string;
  created_at: string;
}

// --- Valuation Types ---

export interface ValuationBase {
  property_id: string;
  estimated_value: number;
  confidence_score: number;
  valuation_date: string;
  methodology: string;
  notes?: string;
}

export interface Valuation extends ValuationBase {
  id: string;
  valuer_id: string;
  created_at: string;
  comp1?: Comparable;
  comp2?: Comparable;
  comp3?: Comparable;
}

// --- API Response Types ---

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
