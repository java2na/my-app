# Gather 개발 로드맵

일회성 이벤트를 간편하게 관리하는 올인원 플랫폼 - 초대 링크 하나로 모든 것을 해결

**📅 최종 업데이트**: 2026-10-24
**📊 진행 상황**: Phase 2 완료, Phase 3 진행 중 (12/15 Tasks 완료)

## 개요

Gather는 5-30명 규모의 소규모 이벤트 주최자와 참여자를 위한 모바일 퍼스트 플랫폼으로 다음 기능을 제공합니다:

- **간편한 이벤트 생성**: 제목, 날짜, 장소만 입력하면 즉시 이벤트 생성
- **원클릭 초대 시스템**: 자동 생성된 초대 링크를 카카오톡으로 간편 공유
- **실시간 참여자 관리**: Supabase Realtime으로 참여자 목록 자동 업데이트
- **관리자 대시보드**: 플랫폼 전체 현황을 한눈에 파악하는 통계 시스템

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅ - 완료
  - ✅ Next.js App Router 기반 전체 라우트 구조 생성
  - ✅ 모든 주요 페이지의 빈 껍데기 파일 생성 (13개 페이지)
  - ✅ 공통 레이아웃 컴포넌트 골격 구현 (모바일/데스크톱)
  - ✅ 모바일 하단 내비게이션 바 구조 설정
  - ✅ 관리자 사이드바 레이아웃 구조 설정

- **Task 002: 타입 정의 및 인터페이스 설계** ✅ - 완료
  - ✅ TypeScript 인터페이스 및 타입 정의 파일 생성
  - ✅ 프론트엔드 컴포넌트 Props 타입 정의
  - ✅ API 응답 타입 정의
  - ✅ 전역 상태 관리 타입 정의
  - ✅ UI 컴포넌트용 임시 데이터 모델 타입 정의 (추후 DB 스키마로 교체 예정)

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 003: 공통 컴포넌트 라이브러리 구현** ✅ - 완료
  - ✅ shadcn/ui 추가 컴포넌트 설치 (Card, Avatar, Dialog, Toast, Form, Select — Toast는 Sonner로 대체 설치)
  - ✅ 이벤트 카드 컴포넌트 구현
  - ✅ 참여자 프로필 카드 컴포넌트 구현
  - ✅ 로딩 스켈레톤 컴포넌트 구현
  - ✅ 빈 상태 UI 컴포넌트 구현
  - ✅ 더미 데이터 생성 및 관리 유틸리티 작성

- **Task 004: 주최자 모바일 UI/UX 완성** ✅ - 완료
  - ✅ 홈 페이지 (랜딩) UI 구현 (F001)
  - ✅ 내 이벤트 목록 페이지 UI - 주최자 뷰 (F007, F008)
  - ✅ 이벤트 생성 페이지 폼 UI 구현 (F001, F009)
    - ✅ React Hook Form 및 Zod 설치
    - ✅ 폼 유효성 검사 구현
  - ✅ 이벤트 상세 페이지 UI - 주최자 뷰 (F002, F003, F005)
    - ✅ 참여자 목록 관리 UI
    - ✅ 초대 링크 공유 버튼
    - ✅ 이벤트 수정/삭제 권한 UI
  - ✅ 이벤트 수정 페이지 UI 구현 (F006, F009)
  - ✅ 주최자 프로필 페이지 UI 구현 (F011)
  - ✅ 주최자 전용 네비게이션 바 및 액션 버튼
    - ✅ "+ 이벤트 만들기" FAB 버튼 구현
  - ✅ 반응형 디자인 및 다크 모드 적용
  - **주요 차이점**: 이벤트 생성, 수정, 삭제 권한 보유

- **Task 005: 참여자 모바일 UI/UX 완성** ✅ - 완료
  - ✅ 초대 링크 참여 페이지 UI 구현 (F004)
    - ✅ 이벤트 정보 미리보기
    - ✅ 참여 확인 버튼
  - ✅ 내가 참여한 이벤트 목록 페이지 UI - 참여자 뷰 (F007)
  - ✅ 이벤트 상세 페이지 UI - 참여자 뷰 (F005)
    - ✅ 읽기 전용 이벤트 정보
    - ✅ 다른 참여자 목록 보기 (수정 불가)
    - ✅ 공유 기능 제한
  - ✅ 참여자 프로필 페이지 UI 구현 (F011)
  - ✅ 참여자 전용 네비게이션 바 (생성 버튼 없음)
  - ✅ 반응형 디자인 및 다크 모드 적용
  - **주요 차이점**: 읽기 전용 뷰, 초대 링크로만 참여 가능
  - **의존성**: Task 004 (공통 컴포넌트 재사용)

- **Task 006: 관리자 데스크톱 페이지 UI 완성** ✅ - 완료
  - ✅ 관리자 로그인 페이지 UI 구현 (실제 OAuth/role 체크는 Task 008)
  - ✅ 관리자 대시보드 메인 페이지 UI 구현 (F012)
  - ✅ 이벤트 관리 테이블 페이지 UI 구현 (F013)
  - ✅ 사용자 관리 테이블 페이지 UI 구현 (F014)
  - ✅ 통계 분석 페이지 UI 구현 (F015)
  - ✅ Recharts 라이브러리 설치 및 더미 차트 구현 (PRD의 2.x 대신 3.10.1 설치)

### Phase 3: 데이터베이스 설정 및 핵심 기능 구현

- **Task 007: 데이터베이스 스키마 및 Supabase 초기 설정** ✅ - 완료
  - ✅ UI 검토 후 최종 확정된 요구사항을 반영한 스키마 설계
  - ✅ Supabase 데이터베이스 테이블 생성 (PRD의 users는 기존 profiles 테이블에 role 컬럼을 추가해 대체 — shrimp-rules.md 규칙에 따라 새 users 테이블은 만들지 않음, events·event_participants 신규 생성)
  - ✅ Row Level Security (RLS) 정책 설정
  - ✅ 인덱스 생성 (invite_code는 unique 제약으로 자동 인덱싱, created_by, event_id, user_id)
  - ✅ Supabase Storage 버킷 생성 (event-covers)
  - ✅ Realtime 구독 설정 준비 (event_participants를 supabase_realtime publication에 등록)
  - ✅ UI에서 사용 중인 임시 타입을 실제 DB 스키마 타입으로 교체

- **Task 008: 인증 시스템 및 권한 관리** ✅ - 완료
  - ✅ Google OAuth 로그인 플로우 완성 (F010) — Task 004~007에서 선행 구현된 코드를 실제 Google 계정으로 1회 완주 검증
  - ✅ 사용자 프로필 자동 생성 로직 구현 — handle_new_user는 기존 구현 재사용, Google 계정 연동 시 raw_user_meta_data가 UPDATE로만 반영되어 profiles.full_name/avatar_url이 영원히 null로 남는 버그를 발견해 sync_profile_from_auth_user 트리거(fill-if-null) 추가
  - ✅ 관리자 권한 체크 미들웨어 구현 (role: admin) — lib/supabase/proxy.ts에 /admin/* role 체크 추가, 기존 allowlist 순서 버그(미인증 /admin/*가 /admin/login 대신 /auth/login으로 가로채짐)도 함께 수정
  - ✅ 보호된 라우트 접근 제어 구현 — 기존 getClaims 기반 리다이렉트 재검증 + profiles.role 자가 상승(self-escalation) RLS 취약점을 BEFORE UPDATE 트리거로 차단(마이그레이션 2건)
  - ✅ 로그아웃 기능 구현 — LogoutButton에 redirectTo prop 추가, 관리자 사이드바 로그아웃이 /admin/login으로 복귀하도록 수정
  - ✅ Playwright MCP를 활용한 인증 플로우 E2E 테스트 — 회원가입/로그인/로그아웃/에러 케이스/권한 거부/권한 상승 차단(실제 REST API 공격 시뮬레이션)/Google OAuth 전체 플로우 검증 완료

- **Task 009: 이벤트 CRUD 및 초대 시스템** ✅ - 완료
  - ✅ 이벤트 생성 API 구현 (F001)
  - ✅ 초대 코드 자동 생성 로직 구현 (F002)
  - ✅ 이벤트 수정/삭제 API 구현 (F006)
  - ✅ 커버 이미지 업로드 기능 구현 (F009)
  - ✅ 초대 링크 공유 기능 구현 — 클립보드 복사만 (F003). 카카오톡 공유는 사용자 요청에 따라 보류, JS 앱 키 확보 후 별도 작업으로 진행 예정(버튼은 기존처럼 비활성 상태 유지)
  - ✅ 이벤트 상태 자동 관리 로직 구현 (F008) — Task 007에서 만든 `computeEventStatus`/`toEvent`를 실제 쿼리 결과에 적용해 확인
  - ✅ Playwright MCP를 활용한 이벤트 생성/수정/삭제 테스트 — 생성(커버 이미지 포함/제외)/수정(이미지 교체·제거)/삭제, 비소유자 접근 차단(UI + REST 레벨 RLS), 초대 링크 미리보기까지 실제 Supabase 프로젝트에 대해 검증

- **Task 010: 참여자 관리** ✅ - 완료
  - ✅ 초대 링크 참여 로직 구현 (F004) — JoinConfirmButton이 event_participants에 직접 insert, 이미 로그인된 사용자의 userId를 서버에서 props로 전달
  - ✅ 중복 참여 방지 로직 구현 — 참여 페이지에서 isEventParticipant로 사전 체크(이미 참여 중이면 버튼 대신 안내 문구), DB unique(event_id, user_id) 제약 위반(23505)도 방어적으로 처리
  - ✅ 실시간 참여자 수 카운트 업데이트 — 이벤트 상세 페이지에 LiveParticipantList(Supabase Realtime postgres_changes) 적용. 테스트 중 DELETE 이벤트가 전달되지 않는 문제를 발견해 event_participants를 REPLICA IDENTITY FULL로 전환하는 마이그레이션 추가(INSERT/DELETE 모두 실시간 반영 확인)
  - ✅ 내가 참여한/만든 이벤트 목록 조회 구현 (F007) — getMyEvents로 event_participants 기준 실제 데이터 조회, /events 페이지를 "내가 만든 이벤트"/"참여한 이벤트" 2개 섹션으로 재구성. 기존 Phase 2 데모 역할 토글(lib/demo-role.ts 등)은 실제 데이터로 대체되어 제거
  - ✅ Playwright MCP를 활용한 실시간 참여자 업데이트 테스트 — 실제 Supabase 프로젝트에 대해 신규 참여/중복 참여 차단(호스트 자기 자신 포함)/실시간 INSERT·DELETE 반영/만든·참여한 목록 분리/상태 필터/초대 코드 404/미로그인 접근까지 검증

- **Task 011: 관리자 대시보드 백엔드 구현** ✅ - 완료
  - ✅ 대시보드 지표 집계 쿼리 구현 (F012) — lib/admin-queries.ts의 getAdminDashboardMetrics, UTC 기준 오늘/이번 주/이번 달/전체 집계
  - ✅ 이벤트 관리 테이블 검색/필터/삭제 API 구현 (F013) — getAdminEventRows + app/admin/(dashboard)/events/actions.ts의 adminDeleteEvent(service_role로 소유자 제한 RLS 우회, 타인 이벤트 삭제 검증 완료)
  - ✅ 사용자 관리 테이블 검색/필터/삭제 API 구현 (F014) — getAdminUserRows + app/admin/(dashboard)/users/actions.ts의 adminDeleteUser(supabase.auth.admin.deleteUser로 auth.users/profiles/연관 이벤트까지 cascade 삭제 검증 완료, 자기 계정 삭제는 코드 레벨에서 차단)
  - ✅ 통계 데이터 집계 및 그래프 데이터 API 구현 (F015) — getEventTrend/getUserTrend, 7/30/90일 기간 전환 확인
  - ✅ 페이지네이션 및 정렬 로직 구현 — 기존 클라이언트 사이드 검색/필터/페이지네이션 유지(소규모 플랫폼 특성상 전체 조회 후 클라이언트 처리로 충분), event-table.tsx/user-table.tsx에 컬럼 정렬(날짜·참여자 수·생성일 / 가입일·생성한 이벤트·참여한 이벤트) 신규 추가
  - ✅ Playwright MCP를 활용한 관리자 기능 통합 테스트 — 대시보드 지표·목록·분석 페이지 실데이터 대 SQL 대사 검증, 검색/필터/정렬 동작 확인, 타인이 만든 이벤트 삭제(참여자 cascade 포함), 테스트용 사용자 삭제(auth.users/profiles/이벤트 cascade 포함), 비인증 상태에서 Server Action 직접 호출 차단(307 리다이렉트) 검증. 테스트 중 event_participants RLS(is_event_member)로 인해 관리자가 비멤버 이벤트의 참여자 수를 과소 집계하는 버그를 발견해 lib/admin-queries.ts를 service_role 클라이언트 기반으로 전환해 수정
  - 신규 인프라: lib/supabase/admin.ts(service_role 클라이언트), lib/supabase/require-admin.ts(requireAdmin 가드, Server Component/Action 양쪽에서 재검증). lib/dummy-data.ts는 더 이상 쓰이지 않아 삭제

- **Task 012: 핵심 기능 통합 테스트**
  - Playwright MCP를 사용한 전체 사용자 플로우 테스트
  - 주최자 플로우: 이벤트 생성 → 초대 링크 공유 → 참여자 확인
  - 참여자 플로우: 초대 링크 클릭 → 로그인 → 자동 참여
  - 관리자 플로우: 로그인 → 지표 확인 → 데이터 관리
  - 에러 핸들링 및 엣지 케이스 테스트

### Phase 4: 고급 기능 및 최적화

- **Task 013: 사용자 경험 향상**
  - Toast 알림 시스템 구현
  - 로딩 상태 및 스켈레톤 UI 적용
  - 에러 바운더리 및 404 페이지 구현
  - 폼 유효성 검사 메시지 개선
  - 터치 영역 최적화 (모바일 48px 이상)
  - 무한 스크롤 또는 가상화 리스트 구현

- **Task 014: 성능 최적화 및 SEO**
  - 이미지 최적화 (next/image, webp 포맷)
  - 코드 스플리팅 최적화
  - Supabase 쿼리 최적화 (select 최소화, JOIN 최적화)
  - 메타 태그 및 Open Graph 설정
  - robots.txt 및 sitemap.xml 생성
  - Lighthouse 점수 90+ 달성

- **Task 015: 배포 및 모니터링** ✅ - 완료
  - ✅ Vercel 프로젝트 설정 및 환경 변수 구성 — GitHub 연동 및 3개 환경변수(Supabase URL/키/서비스롤)를 Production/Preview/Development 전체에 등록, GitHub Actions Secrets에도 동일 등록
  - ✅ CI/CD 파이프라인 구축 — `.github/workflows/ci.yml`(lint→type-check→build), master push 시 Vercel 자동 배포 연동 확인
  - ✅ 에러 모니터링 시스템 설정 (Sentry) — `@sentry/nextjs` 연동(client/server/edge), DSN은 환경변수로 분리. 테스트 중 Sentry의 tunnelRoute(`/monitoring`)가 proxy.ts 인증 리다이렉트에 막혀 에러가 전달되지 않던 버그를 발견해 allowlist에 추가
  - ✅ 분석 도구 설정 (Google Analytics) — `@next/third-parties`의 GoogleAnalytics 컴포넌트로 GA4 연동, 실제 page_view 이벤트 전송(204) 확인
  - ✅ 프로덕션 배포 및 도메인 연결 — Vercel 프로덕션 배포 성공(cacheComponents 정상 동작), 커스텀 도메인 없이 기본 `*.vercel.app` 사용. 배포 직후 Vercel Deployment Protection이 production까지 막고 있던 것을 발견해 production만 공개로 전환
  - ✅ 배포 후 통합 테스트 수행 — Playwright MCP로 프로덕션에서 로그인/이벤트 생성/초대 참여/Realtime 참여자 갱신/관리자 권한 격리까지 전부 재검증, 테스트 데이터 정리 완료

- **Task 016: 이벤트 날짜/시간 타임존 표시 버그 수정**
  - **배경**: Task 015 프로덕션 통합 테스트 중 발견. 이벤트 생성 시 18시로 선택했는데 상세/참여 페이지에 "오전 09:00"으로 표시됨(9시간 차이, KST-UTC 오프셋과 정확히 일치).
  - **원인(추정)**: `new Date(...).toLocaleString("ko-KR", {...})` 호출에 `timeZone: "Asia/Seoul"`을 지정하지 않아, 서버(Vercel, 기본 UTC)의 로컬 타임존 기준으로 포맷됨. DB에 저장된 값 자체는 정확한 UTC로 추정되며 표시 로직만 문제일 가능성이 높음(구현 시 재검증 필요).
  - **영향 범위**: `app/(app)/events/[id]/page.tsx`, `app/join/[invite_code]/page.tsx`, `components/common/event-card.tsx`, `app/(app)/profile/page.tsx`, `components/admin/event-table.tsx`, `components/admin/user-table.tsx` (날짜만 표시하는 두 곳은 자정 근처 경계에서만 영향)
  - [ ] 각 표시 지점에 `timeZone: "Asia/Seoul"` 명시 (또는 공용 포맷 유틸 함수로 통합)
  - [ ] 이벤트 생성/수정 폼(`components/events/event-form.tsx`)의 로컬 시간 → UTC 변환 로직도 함께 점검
  - [ ] Playwright MCP로 특정 시각 선택 → 저장 → 표시까지 왕복 검증

## 작업별 세부 사항

### 각 Task 파일 구조

```markdown
# Task XXX: [작업명]

## 개요

- **목표**: [작업의 핵심 목표]
- **예상 소요 시간**: [X일]
- **관련 기능**: [F001, F002 등]
- **의존성**: [이전에 완료되어야 할 Task]

## 구현 사항

- [ ] 세부 구현 항목 1
- [ ] 세부 구현 항목 2
- [ ] 세부 구현 항목 3

## 수락 기준

- 기준 1: [측정 가능한 완료 조건]
- 기준 2: [측정 가능한 완료 조건]

## 테스트 체크리스트 (API/비즈니스 로직 작업 시)

- [ ] Playwright MCP 테스트 시나리오 1
- [ ] Playwright MCP 테스트 시나리오 2
- [ ] 에러 케이스 테스트

## 관련 파일

- /app/[경로]/page.tsx
- /components/[컴포넌트].tsx
- /lib/[유틸리티].ts
```

## 기술 스택 체크리스트

### 이미 설치됨 ✅

- [x] Next.js 15 (App Router)
- [x] TypeScript 5.6+
- [x] React 19
- [x] Tailwind CSS v4
- [x] shadcn/ui (new-york 스타일)
- [x] Lucide React
- [x] next-themes
- [x] Supabase (@supabase/ssr, @supabase/supabase-js)
- [x] ESLint, Prettier, Husky

### 추가 필요

- [x] React Hook Form 7.x (Task 004에서 설치)
- [x] Zod (Task 004에서 설치)
- [x] Recharts (Task 006에서 설치 — PRD에 명시된 2.x 대신 최신 3.x(3.10.1) 설치)

## 품질 체크리스트

### Phase 완료 기준

#### Phase 1 (애플리케이션 골격) ✅

- [x] 모든 13개 페이지의 라우트 파일 생성
- [x] 모바일/데스크톱 레이아웃 분리 완성
- [x] 프론트엔드 타입 정의 파일 구조 완성
- [x] 임시 데이터 모델 타입 정의 완료

#### Phase 2 (UI/UX 완성) ✅

- [x] 모든 페이지 UI가 더미 데이터로 완성
- [x] 주최자와 참여자의 서로 다른 UX 플로우 동작 확인
- [x] 권한에 따른 UI 조건부 렌더링 확인
- [x] 반응형 디자인 적용 완료
- [x] 다크 모드 지원 완료
- [x] 사용자 플로우 네비게이션 동작

#### Phase 3 (데이터베이스 설정 및 핵심 기능)

- [x] 데이터베이스 스키마 생성 및 RLS 설정
- [ ] 모든 API 엔드포인트 구현 완료
- [ ] 실시간 기능 정상 동작
- [x] 인증 및 권한 시스템 동작
- [ ] Playwright MCP 테스트 모두 통과

#### Phase 4 (최적화)

- [ ] Lighthouse 점수 90+ 달성
- [ ] 모든 이미지 최적화 완료
- [x] 프로덕션 배포 성공
- [x] 에러 모니터링 설정 완료

## 주의사항

### 구조 우선 접근법 준수

1. **Phase 1을 완벽히 완료 후 Phase 2 시작**: 골격이 완성되지 않으면 UI 작업 시작 금지
2. **더미 데이터로 전체 UI 완성 후 데이터베이스 설계**: UI가 완성되어 요구사항이 확정된 후 최적화된 스키마 설계
3. **공통 컴포넌트 우선 개발**: 페이지별 컴포넌트보다 공통 컴포넌트 먼저 완성
4. **UI 피드백 반영 후 백엔드 구현**: UI 검토를 통해 도출된 개선사항을 데이터베이스 설계에 반영

### 테스트 필수 사항

1. **모든 API 연동은 Playwright MCP로 테스트**: 수동 테스트 의존 금지
2. **각 Phase 완료 시 통합 테스트 수행**: Phase 간 전환 시 회귀 테스트 필수
3. **에러 케이스 반드시 테스트**: Happy path만 테스트하지 말고 에러 상황도 검증

### 성능 목표

1. **모바일 First Contentful Paint**: 1.5초 이하
2. **Time to Interactive**: 3초 이하
3. **이미지 로딩**: Lazy loading 필수 적용
4. **번들 크기**: 각 페이지 200KB 이하

## 다음 단계

1. **즉시 시작**: Task 001 (프로젝트 구조 및 라우팅 설정)
2. **구현 시작**: 라우트 파일 및 레이아웃 골격 구축
3. **UI 우선 개발**: Phase 2에서 더미 데이터로 전체 UI를 완성한 후 데이터베이스 설계 진행

---

**📌 이 로드맵은 6주 내 MVP 완성을 목표로 하며, 각 Task는 1-2일 내 완료 가능한 단위로 구성되었습니다.**
**구조 우선 접근법을 엄격히 준수하여 중복 작업을 최소화하고 팀 협업 효율을 극대화합니다.**
