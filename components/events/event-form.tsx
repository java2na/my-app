"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { validateEventCoverFile } from "@/lib/storage/event-cover";

const eventFormSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(50),
  description: z.string().max(500).optional(),
  location: z.string().min(1, "장소를 입력하세요").max(100),
  eventDate: z.string().min(1, "날짜를 선택하세요"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export type EventCoverChange = {
  file: File | null;
  remove: boolean;
};

export function EventForm({
  mode,
  defaultValues,
  defaultCoverImageUrl,
  onSubmitSuccess,
}: {
  mode: "create" | "edit";
  defaultValues?: Partial<EventFormValues>;
  defaultCoverImageUrl?: string | null;
  onSubmitSuccess: (
    values: EventFormValues,
    cover: EventCoverChange,
  ) => void | Promise<void>;
}) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      eventDate: "",
      ...defaultValues,
    },
  });

  const [coverFilePreviewUrl, setCoverFilePreviewUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!coverFile) {
      setCoverFilePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const previewUrl = coverFile
    ? coverFilePreviewUrl
    : !coverRemoved
      ? (defaultCoverImageUrl ?? null)
      : null;

  function handleCoverChange(fileList: FileList | null) {
    const file = fileList?.[0] ?? null;
    if (!file) {
      setCoverFile(null);
      setCoverError(null);
      return;
    }

    const error = validateEventCoverFile(file);
    if (error) {
      setCoverError(error);
      setCoverFile(null);
      return;
    }

    setCoverError(null);
    setCoverFile(file);
    setCoverRemoved(false);
  }

  function handleRemoveCover() {
    setCoverFile(null);
    setCoverError(null);
    setCoverRemoved(true);
  }

  async function handleSubmit(values: EventFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmitSuccess(values, { file: coverFile, remove: coverRemoved });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 제목" maxLength={50} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택)</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 설명" maxLength={500} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>장소</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 장소" maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>날짜</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <FormLabel>커버 이미지 (선택)</FormLabel>
          {previewUrl && (
            <div className="relative h-40 w-full overflow-hidden rounded-md border">
              <Image
                src={previewUrl}
                alt="커버 이미지 미리보기"
                fill
                sizes="100vw"
                className="object-cover"
                unoptimized={coverFile !== null}
              />
            </div>
          )}
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleCoverChange(e.target.files)}
          />
          {coverError && (
            <p className="text-destructive text-sm">{coverError}</p>
          )}
          {previewUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start"
              onClick={handleRemoveCover}
            >
              이미지 제거
            </Button>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "처리 중..."
            : mode === "create"
              ? "이벤트 생성"
              : "수정 완료"}
        </Button>
      </form>
    </Form>
  );
}
