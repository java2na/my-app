// 임시 타입 — Task 007에서 실제 DB 스키마 타입(lib/supabase/database.types.ts)으로 교체 예정

import type { EventStatus } from "./event";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface CreateEventInput {
  title: string;
  description?: string | null;
  location: string;
  eventDate: string;
  coverImageUrl?: string | null;
}

export interface UpdateEventInput {
  title?: string;
  description?: string | null;
  location?: string;
  eventDate?: string;
  coverImageUrl?: string | null;
  status?: EventStatus;
}

export interface JoinEventInput {
  inviteCode: string;
}
