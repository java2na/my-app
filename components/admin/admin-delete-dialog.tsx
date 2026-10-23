"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdminDeleteDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
}

export function AdminDeleteDialog({
  trigger,
  title,
  description,
  onConfirm,
}: AdminDeleteDialogProps) {
  function handleConfirm() {
    // TODO(Task 011): 실제 Supabase 삭제 API 연동
    onConfirm();
    toast.success("삭제되었습니다");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={handleConfirm}>
              삭제
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
