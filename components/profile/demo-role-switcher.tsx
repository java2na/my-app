import { Button } from "@/components/ui/button";
import { getDemoViewerRole } from "@/lib/demo-role";
import { setDemoViewerRole } from "@/lib/demo-role-actions";

export async function DemoRoleSwitcher() {
  const role = await getDemoViewerRole();

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <span className="text-xs text-muted-foreground">
        데모 보기 전환 (Phase 2 전용)
      </span>
      <div className="flex gap-2">
        <form action={setDemoViewerRole.bind(null, "host")}>
          <Button
            type="submit"
            variant={role === "host" ? "default" : "outline"}
          >
            호스트로 보기
          </Button>
        </form>
        <form action={setDemoViewerRole.bind(null, "participant")}>
          <Button
            type="submit"
            variant={role === "participant" ? "default" : "outline"}
          >
            참여자로 보기
          </Button>
        </form>
      </div>
    </div>
  );
}
