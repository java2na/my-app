import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ParticipantCardProps } from "@/lib/types/components";
import { cn } from "@/lib/utils";

function getInitial(name: string | null) {
  return name ? name.trim().charAt(0).toUpperCase() : "?";
}

export function ParticipantCard({
  participant,
  profile,
  className,
}: ParticipantCardProps & { className?: string }) {
  return (
    <div className={cn("flex min-h-12 items-center gap-3 px-1", className)}>
      <Avatar>
        {profile.avatarUrl && (
          <AvatarImage src={profile.avatarUrl} alt={profile.name ?? ""} />
        )}
        <AvatarFallback>{getInitial(profile.name)}</AvatarFallback>
      </Avatar>
      <span className="flex-1 text-sm font-medium">
        {profile.name ?? "이름 없음"}
      </span>
      {participant.role === "host" && <Badge variant="secondary">주최자</Badge>}
    </div>
  );
}
