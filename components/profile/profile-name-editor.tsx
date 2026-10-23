"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileNameEditor({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);

  function handleSave() {
    // TODO(Task 011): 실제 profiles 테이블 업데이트 API 연동
    toast("저장은 추후 지원됩니다");
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={50}
        placeholder="이름을 입력하세요"
        className="text-center"
      />
      <Button type="button" variant="outline" onClick={handleSave}>
        저장
      </Button>
    </div>
  );
}
