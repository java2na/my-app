import { Suspense } from "react";

import { LogoutButton } from "@/components/logout-button";
import { ProfileAvatarEditor } from "@/components/profile/profile-avatar-editor";
import { ProfileNameEditor } from "@/components/profile/profile-name-editor";
import { createClient } from "@/lib/supabase/server";

async function ProfileContent() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    return (
      <p className="text-muted-foreground p-4 text-sm">로그인이 필요합니다.</p>
    );
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name, email, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    // The profiles row should always exist (auto-created on signup by the
    // handle_new_user trigger), but that trigger only fires on auth.users
    // INSERT, so it can never repair a row that went missing after the fact.
    // Recreate it here from the session's own claims so the user isn't stuck.
    const metadata = claimsData?.claims?.user_metadata as
      { full_name?: string; avatar_url?: string } | undefined;

    const { data: created } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        email: claimsData?.claims?.email ?? "",
        full_name: metadata?.full_name ?? null,
        avatar_url: metadata?.avatar_url ?? null,
      })
      .select("avatar_url, full_name, email, created_at")
      .single();

    profile = created;
  }

  if (!profile) {
    return (
      <p className="text-muted-foreground p-4 text-sm">
        프로필을 불러올 수 없습니다.
      </p>
    );
  }

  const joinedAt = new Date(profile.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [{ count: createdEventCount }, { count: joinedEventCount }] =
    await Promise.all([
      supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("created_by", userId),
      supabase
        .from("event_participants")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("role", "participant"),
    ]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col items-center gap-3 py-4">
        <ProfileAvatarEditor
          userId={userId}
          initialAvatarUrl={profile.avatar_url}
          fallbackText={(profile.full_name ?? profile.email)
            .charAt(0)
            .toUpperCase()}
        />
        <ProfileNameEditor
          userId={userId}
          initialName={profile.full_name ?? ""}
        />
      </div>

      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">이메일</span>
          <span className="text-sm">{profile.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">가입일</span>
          <span className="text-sm">{joinedAt}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold">
              {createdEventCount ?? 0}
            </span>
            <span className="text-muted-foreground text-xs">만든 이벤트</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold">
              {joinedEventCount ?? 0}
            </span>
            <span className="text-muted-foreground text-xs">참여한 이벤트</span>
          </div>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}
