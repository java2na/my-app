// 임시 타입 — Task 007에서 실제 DB 스키마 타입(lib/supabase/database.types.ts)으로 교체 예정

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Event } from "./event";
import type { EventParticipant } from "./participant";
import type { UserProfile } from "./user";

export interface EventCardProps {
  event: Pick<
    Event,
    "id" | "title" | "coverImageUrl" | "eventDate" | "location" | "status"
  >;
  participantCount: number;
}

export interface ParticipantCardProps {
  participant: Pick<EventParticipant, "id" | "role">;
  profile: Pick<UserProfile, "id" | "name" | "avatarUrl">;
}

export interface EventStatusBadgeProps {
  status: Event["status"];
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export interface AdminMetricCardProps {
  label: string;
  value: number;
  icon?: LucideIcon;
}

export interface AdminEventRow {
  event: Event;
  hostName: string;
  participantCount: number;
}

export interface AdminUserRow {
  user: UserProfile;
  createdEventCount: number;
  joinedEventCount: number;
}

export interface ChartPoint {
  date: string;
  count: number;
}

export interface AdminDashboardMetrics {
  eventsToday: number;
  eventsThisWeek: number;
  eventsThisMonth: number;
  eventsTotal: number;
  usersToday: number;
  usersThisWeek: number;
  usersTotal: number;
}
