import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rwfywzttwfwnipkigbml.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Znl3enR0d2Z3bmlwa2lnYm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzMxNTMsImV4cCI6MjA4NTcwOTE1M30.laLvQBbWQgaQPea6oeHy6dxM_o78Hh83am_J2w7-lKI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary_tags?: string[];
  featured?: boolean;
  image_url?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  rating: number;
  quote: string;
  date?: string;
};

export type Table = {
  id: string;
  name: string;
  capacity: number;
  location?: string;
};

export type Booking = {
  id?: string;
  date: string;
  time: string;
  party_size: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
  occasion?: string;
  status?: string;
  table_id?: string;
  created_at?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  opening_hours?: Record<string, string>;
};
