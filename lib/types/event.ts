// 임시 타입 — Task 007에서 실제 DB 스키마 타입(lib/supabase/database.types.ts)으로 교체 예정

export type EventStatus = "upcoming" | "ongoing" | "ended";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string;
  eventDate: string;
  coverImageUrl: string | null;
  inviteCode: string;
  status: EventStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
