"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

const eventFormSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요").max(50),
  description: z.string().max(500).optional(),
  location: z.string().min(1, "장소를 입력하세요").max(100),
  eventDate: z.string().min(1, "날짜를 선택하세요"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function EventForm({
  mode,
  defaultValues,
  onSubmitSuccess,
}: {
  mode: "create" | "edit";
  defaultValues?: Partial<EventFormValues>;
  onSubmitSuccess: (values: EventFormValues) => void;
}) {
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitSuccess)}
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

        <p className="text-xs text-muted-foreground">
          커버 이미지 업로드는 추후 지원됩니다 (Task 009)
        </p>

        <Button type="submit">
          {mode === "create" ? "이벤트 생성" : "수정 완료"}
        </Button>
      </form>
    </Form>
  );
}
