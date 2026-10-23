// 임시 더미 데이터 — Task 007에서 실제 Supabase 쿼리로 교체 예정
// Supabase 클라이언트를 호출하지 않는 순수 함수만 둔다.
// DUMMY_EVENTS 등 고정 데이터셋은 모듈 스코프에서 1회만 생성되며 서버 재시작 시 초기화된다.

import type { Event, EventStatus } from "@/lib/types/event";
import type {
  EventParticipant,
  ParticipantRole,
} from "@/lib/types/participant";
import type { UserProfile } from "@/lib/types/user";

const SAMPLE_NAMES = [
  "김민준",
  "이서연",
  "박도윤",
  "최지우",
  "정하은",
  "강서준",
  "조유나",
  "윤재호",
];

const SAMPLE_TITLES = [
  "동아리 정기 모임",
  "분기별 워크숍",
  "송년회 파티",
  "스터디 그룹 모임",
  "창립 기념 행사",
  "친구 생일 파티",
];

const SAMPLE_LOCATIONS = [
  "서울 강남구 테헤란로 123",
  "서울 마포구 홍대입구역 근처",
  "경기 성남시 분당구 판교역로",
  "서울 종로구 광화문광장",
  "부산 해운대구 해운대해변로",
];

const DAY_MS = 24 * 60 * 60 * 1000;

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function toISODate(date: Date): string {
  return date.toISOString();
}

function randomStatus(): EventStatus {
  return pickRandom(["upcoming", "ongoing", "ended"] as const);
}

function eventDateForStatus(status: EventStatus): Date {
  const now = Date.now();
  switch (status) {
    case "upcoming":
      return new Date(now + (1 + Math.floor(Math.random() * 30)) * DAY_MS);
    case "ongoing":
      return new Date(now);
    case "ended":
      return new Date(now - (1 + Math.floor(Math.random() * 30)) * DAY_MS);
  }
}

export function createDummyProfile(
  overrides?: Partial<UserProfile>,
): UserProfile {
  const name = pickRandom(SAMPLE_NAMES);
  return {
    id: crypto.randomUUID(),
    email: `${name.toLowerCase()}@example.com`,
    name,
    avatarUrl: null,
    role: "user",
    createdAt: toISODate(new Date()),
    ...overrides,
  };
}

export function createDummyEvent(overrides?: Partial<Event>): Event {
  const status = overrides?.status ?? randomStatus();
  const eventDate =
    overrides?.eventDate ?? toISODate(eventDateForStatus(status));
  const now = toISODate(new Date());

  return {
    id: crypto.randomUUID(),
    title: pickRandom(SAMPLE_TITLES),
    description: null,
    location: pickRandom(SAMPLE_LOCATIONS),
    eventDate,
    coverImageUrl: null,
    inviteCode: crypto.randomUUID().slice(0, 8),
    status,
    createdBy: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createDummyEvents(count: number): Event[] {
  return Array.from({ length: count }, () => createDummyEvent());
}

export function createDummyParticipant(
  eventId: string,
  overrides?: Partial<EventParticipant>,
): EventParticipant {
  return {
    id: crypto.randomUUID(),
    eventId,
    userId: crypto.randomUUID(),
    role: "participant",
    joinedAt: toISODate(new Date()),
    ...overrides,
  };
}

export function createDummyParticipants(
  eventId: string,
  count: number,
): EventParticipant[] {
  return Array.from({ length: count }, (_, index) => {
    const role: ParticipantRole = index === 0 ? "host" : "participant";
    return createDummyParticipant(eventId, { role });
  });
}

export const DUMMY_EVENTS: Event[] = createDummyEvents(8);

const DUMMY_PARTICIPANTS_BY_EVENT = new Map<
  string,
  { participant: EventParticipant; profile: UserProfile }[]
>(
  DUMMY_EVENTS.map((event) => {
    const participants = createDummyParticipants(
      event.id,
      2 + Math.floor(Math.random() * 6),
    );
    return [
      event.id,
      participants.map((participant) => ({
        participant,
        profile: createDummyProfile({ id: participant.userId }),
      })),
    ];
  }),
);

export function getDummyEventById(id: string): Event | undefined {
  return DUMMY_EVENTS.find((event) => event.id === id);
}

export function getDummyEventByInviteCode(code: string): Event | undefined {
  return DUMMY_EVENTS.find((event) => event.inviteCode === code);
}

export function getDummyParticipantsWithProfiles(eventId: string) {
  return DUMMY_PARTICIPANTS_BY_EVENT.get(eventId) ?? [];
}
