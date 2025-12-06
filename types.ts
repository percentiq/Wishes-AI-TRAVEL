
import React from 'react';

export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface GroundingMetadata {
  groundingChunks?: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
  webSearchQueries?: string[];
}

export type BookingType = 'flight' | 'hotel' | 'taxi' | 'restaurant';

export interface BookingItem {
  id: string;
  type: BookingType;
  title: string;
  description: string;
  price: string;
  currency: string;
  details?: any;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  isStreaming?: boolean;
  groundingMetadata?: GroundingMetadata;
  createdAt?: string;
  offer?: BookingItem; // The structured offer extracted from the model response
}

export interface Suggestion {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

export interface HistoryItem {
  id: string;
  title: string;
  emoji: string;
  date: string;
}

// --- Database Entities ---

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
}

export interface Passport {
  id?: string;
  user_id?: string;
  full_name: string;
  passport_number: string;
  expiry_date: string;
  issuing_country: string;
  nationality: string;
}

// --- New Types for Destinations ---

export type DestinationType = 'nature' | 'museum' | 'history' | 'food' | 'urban' | 'beach';
export type PriceLevel = '$' | '$$' | '$$$';

export interface Review {
  id: string;
  destinationId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  date: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  city: string;
  type: DestinationType;
  latitude: number;
  longitude: number;
  averageRating: number;
  reviewsCount: number;
  myScore: number; // 0-100
  priceLevel: PriceLevel;
  tags: string[];
  hasBooking: boolean;
  thumbnailUrl: string;
  gallery: string[];
  descriptionShort: string;
  descriptionFull: string;
  featured: boolean;
  reviews?: Review[];
}

export interface Booking {
  id: string;
  destinationId: string;
  date: string;
  guests: number;
  status: 'pending' | 'confirmed';
}
