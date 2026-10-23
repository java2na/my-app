import { Suspense } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/logout-button";
import { DemoRoleSwitcher } from "@/components/profile/demo-role-switcher";
import { ProfileNameEditor } from "@/components/profile/profile-name-editor";
import { createClient } from "@/lib/supabase/server";

async function ProfileContent() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    return (
      <p className="p-4 text-sm text-muted-foreground">로그인이 필요합니다.</p>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name, email, created_at")
    .eq("id", userId)
    .single();

  if (!profile) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        프로필을 불러올 수 없습니다.
      </p>
    );
  }

  const joinedAt = new Date(profile.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col items-center gap-3 py-4">
        <Avatar size="lg">
          {profile.avatar_url && (
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.full_name ?? ""}
            />
          )}
          <AvatarFallback>
            {(profile.full_name ?? profile.email).charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <ProfileNameEditor initialName={profile.full_name ?? ""} />
      </div>

      <div className="flex flex-col gap-4 rounded-lg border p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">이메일</span>
          <span className="text-sm">{profile.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">가입일</span>
          <span className="text-sm">{joinedAt}</span>
        </div>
      </div>

      <DemoRoleSwitcher />

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
